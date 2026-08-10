export interface CompressionOptions {
  targetKB?: number;
  maxDimension?: number;
  quality?: number;
  forceJpeg?: boolean;
}

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
  sizeBytes: number;
  mimeType: string;
}

export async function compressImageToTarget(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const targetBytes = options.targetKB ? options.targetKB * 1024 : undefined;
  // Safety margin: target 95% of target size to avoid edge overflows
  const strictTargetBytes = targetBytes ? Math.floor(targetBytes * 0.95) : undefined;

  const imageBitmap = await createImageBitmap(file);
  let currentWidth = imageBitmap.width;
  let currentHeight = imageBitmap.height;

  if (options.maxDimension && (currentWidth > options.maxDimension || currentHeight > options.maxDimension)) {
    const ratio = Math.min(options.maxDimension / currentWidth, options.maxDimension / currentHeight);
    currentWidth = Math.round(currentWidth * ratio);
    currentHeight = Math.round(currentHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context.');

  const exportMime = (options.forceJpeg || file.type !== 'image/png') ? 'image/jpeg' : 'image/png';

  const renderToBlob = async (w: number, h: number, q: number): Promise<Blob> => {
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(imageBitmap, 0, 0, w, h);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas blob generation failed'));
        },
        exportMime,
        q
      );
    });
  };

  if (!strictTargetBytes) {
    const q = options.quality ?? 0.85;
    const blob = await renderToBlob(currentWidth, currentHeight, q);
    return {
      blob,
      width: currentWidth,
      height: currentHeight,
      quality: q,
      sizeBytes: blob.size,
      mimeType: exportMime,
    };
  }

  // Iterative quality & dimension reduction loop
  let bestBlob: Blob | null = null;
  let finalWidth = currentWidth;
  let finalHeight = currentHeight;
  let finalQuality = 0.9;
  let iterations = 0;
  const maxIterations = 15;

  while (iterations < maxIterations) {
    iterations++;

    // Binary search for optimal quality at current dimensions
    let lowQ = 0.05;
    let highQ = 0.92;
    let localBestBlob: Blob | null = null;
    let localBestQ = lowQ;

    for (let i = 0; i < 6; i++) {
      const midQ = (lowQ + highQ) / 2;
      const testBlob = await renderToBlob(finalWidth, finalHeight, midQ);

      if (testBlob.size <= strictTargetBytes) {
        localBestBlob = testBlob;
        localBestQ = midQ;
        lowQ = midQ; // Try higher quality
      } else {
        highQ = midQ; // Reduce quality
      }
    }

    if (localBestBlob && localBestBlob.size <= strictTargetBytes) {
      bestBlob = localBestBlob;
      finalQuality = localBestQ;
      break;
    }

    // If quality alone cannot reach target size, downscale dimensions by 15%
    finalWidth = Math.round(finalWidth * 0.85);
    finalHeight = Math.round(finalHeight * 0.85);

    if (finalWidth < 80 || finalHeight < 80) {
      // Force minimal render if dimensions are extremely small
      bestBlob = await renderToBlob(Math.max(finalWidth, 50), Math.max(finalHeight, 50), 0.05);
      finalQuality = 0.05;
      break;
    }
  }

  if (!bestBlob) {
    bestBlob = await renderToBlob(finalWidth, finalHeight, 0.05);
  }

  imageBitmap.close();

  return {
    blob: bestBlob,
    width: finalWidth,
    height: finalHeight,
    quality: finalQuality,
    sizeBytes: bestBlob.size,
    mimeType: exportMime,
  };
}
