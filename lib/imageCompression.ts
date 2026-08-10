export interface CompressionOptions {
  targetKB?: number;
  maxDimension?: number;
  quality?: number;
  forceJpeg?: boolean;
  isSignature?: boolean;
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

  const imageBitmap = await createImageBitmap(file);
  let currentWidth = imageBitmap.width;
  let currentHeight = imageBitmap.height;

  // Step 1: Bounding dimensions based on target KB
  let maxDim = options.maxDimension;
  if (!maxDim && options.targetKB) {
    if (options.targetKB <= 20) maxDim = 1200;
    else if (options.targetKB <= 50) maxDim = 1800;
    else if (options.targetKB <= 100) maxDim = 2400;
  }

  if (maxDim && (currentWidth > maxDim || currentHeight > maxDim)) {
    const ratio = Math.min(maxDim / currentWidth, maxDim / currentHeight);
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
          else reject(new Error('Canvas rendering failed'));
        },
        exportMime,
        q
      );
    });
  };

  if (!targetBytes) {
    const q = options.quality ?? 0.85;
    const blob = await renderToBlob(currentWidth, currentHeight, q);
    imageBitmap.close();
    return {
      blob,
      width: currentWidth,
      height: currentHeight,
      quality: q,
      sizeBytes: blob.size,
      mimeType: exportMime,
    };
  }

  let bestBlob: Blob | null = null;
  let finalWidth = currentWidth;
  let finalHeight = currentHeight;
  let finalQuality = 0.9;
  let iterations = 0;
  const maxIterations = 12;

  while (iterations < maxIterations) {
    iterations++;

    // Step 2: Binary Search Quality
    let lowQ = 0.05;
    let highQ = 0.95;
    let localBestBlob: Blob | null = null;
    let localBestQ = lowQ;

    for (let i = 0; i < 6; i++) {
      const midQ = (lowQ + highQ) / 2;
      const testBlob = await renderToBlob(finalWidth, finalHeight, midQ);

      if (testBlob.size <= targetBytes) {
        localBestBlob = testBlob;
        localBestQ = midQ;
        lowQ = midQ; // Attempt higher quality
      } else {
        highQ = midQ; // Reduce quality
      }
    }

    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      finalQuality = localBestQ;
      break;
    }

    // Step 3: Reduce dimensions by 15% if quality alone is insufficient
    finalWidth = Math.round(finalWidth * 0.85);
    finalHeight = Math.round(finalHeight * 0.85);

    if (finalWidth < 60 || finalHeight < 60) {
      bestBlob = await renderToBlob(Math.max(finalWidth, 40), Math.max(finalHeight, 40), 0.05);
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
