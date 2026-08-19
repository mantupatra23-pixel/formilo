// lib/imageCompression.ts

export interface CompressionOptions {
  targetKB?: number;
  maxDimension?: number;
  width?: number;
  height?: number;
  dpi?: number;
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

export interface ExactDimensionOptions {
  targetKB: number;
  width: number;
  height: number;
  dpi?: number;
  isSignature?: boolean;
}

export function getImageFormat(file: File): 'JPEG' | 'PNG' | 'WEBP' | 'HEIC' | 'UNKNOWN' {
  const mime = (file.type || '').toLowerCase();
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

export function dataURLToBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function canvasToBlobSafe(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), mimeType, quality);
    });
    if (blob && blob.size > 0) return blob;
  } catch {}

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const blob = dataURLToBlob(dataUrl);
  if (!blob || blob.size === 0) {
    throw new Error('Your browser could not encode this photo.');
  }
  return blob;
}

export async function decodeImageSafely(file: File, maxDimension?: number): Promise<any> {
  const format = getImageFormat(file);
  if (format === 'HEIC') {
    throw new Error('HEIC/HEIF format is not supported directly. Please select JPG/PNG.');
  }

  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      if (maxDimension) {
        return await createImageBitmap(file, {
          resizeWidth: maxDimension,
          resizeQuality: 'high',
        });
      }
      return await createImageBitmap(file);
    } catch {}
  }

  try {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('ObjectURL load error'));
    });
    URL.revokeObjectURL(objectUrl);
    return img;
  } catch {}

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('FileReader decoding failed.'));
    };
    reader.onerror = () => reject(new Error('Storage read failure.'));
    reader.readAsDataURL(file);
  });
}

export async function compressImageToTarget(
  file: File,
  options: CompressionOptions = {},
  onProgress?: (msg: string) => void
): Promise<CompressionResult> {
  onProgress?.('Reading photo...');

  let targetMaxDim = options.maxDimension;
  if (!targetMaxDim && options.targetKB) {
    if (options.targetKB <= 20) targetMaxDim = 1200;
    else if (options.targetKB <= 50) targetMaxDim = 1800;
    else if (options.targetKB <= 100) targetMaxDim = 2400;
  }

  onProgress?.('Decoding image safely...');
  const decodedSource: any = await decodeImageSafely(file, targetMaxDim);

  const sourceWidth = Number(decodedSource.naturalWidth || decodedSource.width || 350);
  const sourceHeight = Number(decodedSource.naturalHeight || decodedSource.height || 450);

  let currentWidth = options.width || sourceWidth;
  let currentHeight = options.height || sourceHeight;

  if (targetMaxDim && !options.width && (currentWidth > targetMaxDim || currentHeight > targetMaxDim)) {
    const ratio = Math.min(targetMaxDim / currentWidth, targetMaxDim / currentHeight);
    currentWidth = Math.round(currentWidth * ratio);
    currentHeight = Math.round(currentHeight * ratio);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    if (decodedSource && typeof decodedSource.close === 'function') decodedSource.close();
    throw new Error('Canvas memory allocation failed.');
  }

  const format = getImageFormat(file);
  const exportMime = (options.forceJpeg || format !== 'PNG' || options.isSignature) ? 'image/jpeg' : 'image/png';
  const targetBytes = options.targetKB ? options.targetKB * 1024 : undefined;

  const renderToBlob = async (w: number, h: number, q: number): Promise<Blob> => {
    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(decodedSource, 0, 0, w, h);

    return await canvasToBlobSafe(canvas, exportMime, q);
  };

  if (!targetBytes) {
    onProgress?.('Compressing photo...');
    const q = options.quality ?? 0.85;
    const blob = await renderToBlob(currentWidth, currentHeight, q);
    if (decodedSource && typeof decodedSource.close === 'function') decodedSource.close();
    return {
      blob,
      width: currentWidth,
      height: currentHeight,
      quality: q,
      sizeBytes: blob.size,
      mimeType: exportMime,
    };
  }

  onProgress?.('Locking target KB...');

  let bestBlob: Blob | null = null;
  let finalWidth = currentWidth;
  let finalHeight = currentHeight;
  let finalQuality = 0.9;
  let iterations = 0;

  while (iterations < 14) {
    iterations++;

    let lowQ = 0.05;
    let highQ = 0.96;
    let localBestBlob: Blob | null = null;
    let localBestQ = lowQ;

    for (let i = 0; i < 7; i++) {
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

    finalWidth = Math.round(finalWidth * 0.88);
    finalHeight = Math.round(finalHeight * 0.88);

    if (finalWidth < 80 || finalHeight < 80) {
      bestBlob = await renderToBlob(Math.max(finalWidth, 50), Math.max(finalHeight, 50), 0.05);
      finalQuality = 0.05;
      break;
    }
  }

  if (!bestBlob) {
    bestBlob = await renderToBlob(finalWidth, finalHeight, 0.05);
  }

  if (decodedSource && typeof decodedSource.close === 'function') {
    decodedSource.close();
  }

  return {
    blob: bestBlob,
    width: finalWidth,
    height: finalHeight,
    quality: finalQuality,
    sizeBytes: bestBlob.size,
    mimeType: exportMime,
  };
}

export async function processAndCompressImage(
  file: File,
  options: ExactDimensionOptions
): Promise<Blob> {
  const result = await compressImageToTarget(file, {
    targetKB: options.targetKB,
    width: options.width,
    height: options.height,
    forceJpeg: true,
    isSignature: options.isSignature
  });

  return result.blob;
}
