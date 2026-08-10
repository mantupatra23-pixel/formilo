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

export function getImageFormat(file: File): 'JPEG' | 'PNG' | 'WEBP' | 'HEIC' | 'UNKNOWN' {
  const mime = file.type.toLowerCase();
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();

  if (mime === 'image/heic' || mime === 'image/heif' || ext === '.heic' || ext === '.heif') {
    return 'HEIC';
  }
  if (mime === 'image/jpeg' || mime === 'image/jpg' || ext === '.jpg' || ext === '.jpeg') {
    return 'JPEG';
  }
  if (mime === 'image/png' || ext === '.png') {
    return 'PNG';
  }
  if (mime === 'image/webp' || ext === '.webp') {
    return 'WEBP';
  }
  return 'UNKNOWN';
}

async function decodeImageForProcessing(file: File, maxDimension?: number): Promise<ImageBitmap> {
  const format = getImageFormat(file);

  if (format === 'HEIC') {
    throw new Error('HEIC/HEIF camera photos are not supported by this browser. Please use JPG format or convert the photo to JPG.');
  }

  // Pre-calculate target dimensions before canvas creation
  let resizeWidth: number | undefined = maxDimension;

  if ('createImageBitmap' in window) {
    try {
      if (resizeWidth) {
        return await createImageBitmap(file, {
          resizeWidth,
          resizeQuality: 'high',
        });
      }
      return await createImageBitmap(file);
    } catch {
      // Fallback if createImageBitmap fails on camera photo
    }
  }

  // HTMLImageElement Fallback
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = objectUrl;
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Unable to read or decode this camera photo. File may be corrupted.'));
    });

    let w = img.naturalWidth;
    let h = img.naturalHeight;

    if (w <= 0 || h <= 0) {
      throw new Error('Invalid camera photo dimensions.');
    }

    if (maxDimension && (w > maxDimension || h > maxDimension)) {
      const ratio = Math.min(maxDimension / w, maxDimension / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) throw new Error('Browser memory was insufficient while processing this large camera photo.');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    return await createImageBitmap(tempCanvas);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function compressImageToTarget(
  file: File,
  options: CompressionOptions = {},
  onProgress?: (msg: string) => void
): Promise<CompressionResult> {
  onProgress?.('Reading camera photo...');

  let targetMaxDim = options.maxDimension;
  if (!targetMaxDim && options.targetKB) {
    if (options.targetKB <= 20) targetMaxDim = 1200;
    else if (options.targetKB <= 50) targetMaxDim = 1800;
    else if (options.targetKB <= 100) targetMaxDim = 2400;
  }

  onProgress?.('Preparing photo dimensions...');
  const imageBitmap = await decodeImageForProcessing(file, targetMaxDim);

  onProgress?.('Optimizing photo layout...');
  let currentWidth = imageBitmap.width;
  let currentHeight = imageBitmap.height;

  if (targetMaxDim && (currentWidth > targetMaxDim || currentHeight > targetMaxDim)) {
    const ratio = Math.min(targetMaxDim / currentWidth, targetMaxDim / currentHeight);
    currentWidth = Math.round(currentWidth * ratio);
    currentHeight = Math.round(currentHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    imageBitmap.close();
    throw new Error('Browser canvas allocation failed for large photo.');
  }

  const format = getImageFormat(file);
  const exportMime = (options.forceJpeg || format !== 'PNG') ? 'image/jpeg' : 'image/png';
  const targetBytes = options.targetKB ? options.targetKB * 1024 : undefined;

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
          else reject(new Error('Canvas rendering failed for photo.'));
        },
        exportMime,
        q
      );
    });
  };

  if (!targetBytes) {
    onProgress?.('Compressing photo...');
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

  onProgress?.('Finding optimal quality under target...');

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
