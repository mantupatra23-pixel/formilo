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
  options: CompressionOptions = {},
  onProgress?: (msg: string) => void
): Promise<CompressionResult> {
  // Format check for HEIC/HEIF
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'heic' || ext === 'heif' || file.type.includes('heic') || file.type.includes('heif')) {
    throw new Error('This camera photo uses HEIC/HEIF format, which your browser cannot decode directly. Please convert it to JPG or change camera output to JPG.');
  }

  onProgress?.('Reading image...');

  let imageBitmap: ImageBitmap | null = null;
  
  // Target Bounding Setup before full decoding
  let targetMaxDim = options.maxDimension;
  if (!targetMaxDim && options.targetKB) {
    if (options.targetKB <= 20) targetMaxDim = 1200;
    else if (options.targetKB <= 50) targetMaxDim = 1800;
    else if (options.targetKB <= 100) targetMaxDim = 2400;
  }

  try {
    // Attempt memory-safe downscaled bitmap decoding
    if ('createImageBitmap' in window) {
      if (targetMaxDim) {
        imageBitmap = await createImageBitmap(file, {
          resizeWidth: targetMaxDim,
          resizeQuality: 'high',
        }).catch(() => null);
      }
      if (!imageBitmap) {
        imageBitmap = await createImageBitmap(file).catch(() => null);
      }
    }
  } catch {
    imageBitmap = null;
  }

  // Fallback to HTMLImageElement if ImageBitmap fails
  if (!imageBitmap) {
    onProgress?.('Preparing camera photo...');
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Unable to decode camera image. File may be corrupted or unsupported.'));
    });

    URL.revokeObjectURL(objectUrl);
    
    // Canvas conversion
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Browser canvas allocation failed.');
    tempCtx.drawImage(img, 0, 0);

    imageBitmap = await createImageBitmap(tempCanvas);
  }

  onProgress?.('Optimizing dimensions...');

  let currentWidth = imageBitmap.width;
  let currentHeight = imageBitmap.height;

  if (targetMaxDim && (currentWidth > targetMaxDim || currentHeight > targetMaxDim)) {
    const ratio = Math.min(targetMaxDim / currentWidth, targetMaxDim / currentHeight);
    currentWidth = Math.round(currentWidth * ratio);
    currentHeight = Math.round(currentHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Browser memory was insufficient for rendering.');

  const exportMime = (options.forceJpeg || file.type !== 'image/png') ? 'image/jpeg' : 'image/png';
  const targetBytes = options.targetKB ? options.targetKB * 1024 : undefined;

  const renderToBlob = async (w: number, h: number, q: number): Promise<Blob> => {
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(imageBitmap!, 0, 0, w, h);

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
    onProgress?.('Compressing image...');
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

  onProgress?.('Finding best quality under target...');

  let bestBlob: Blob | null = null;
  let finalWidth = currentWidth;
  let finalHeight = currentHeight;
  let finalQuality = 0.9;
  let iterations = 0;
  const maxIterations = 14;

  while (iterations < maxIterations) {
    iterations++;

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
        lowQ = midQ;
      } else {
        highQ = midQ;
      }
    }

    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      finalQuality = localBestQ;
      break;
    }

    // Downscale dimensions by 15% if quality tuning wasn't enough
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
  onProgress?.('Verifying final size...');

  return {
    blob: bestBlob,
    width: finalWidth,
    height: finalHeight,
    quality: finalQuality,
    sizeBytes: bestBlob.size,
    mimeType: exportMime,
  };
}
