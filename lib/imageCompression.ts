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

// 1. Image Format Detector
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

// 2. DataURL to Blob Fallback for Mobile Android Engines
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

// 3. Safe Canvas to Blob Encoder
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
  } catch {
    // Fallback to toDataURL when canvas.toBlob fails in older mobile webviews
  }

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const blob = dataURLToBlob(dataUrl);
  if (!blob || blob.size === 0) {
    throw new Error('Your browser could not encode this camera photo.');
  }
  return blob;
}

// 4. 3-Stage Safe Camera Image Decoder (Prevents Mobile RAM Crashes)
export async function decodeImageSafely(
  file: File,
  maxDimension?: number
): Promise<ImageBitmap | HTMLImageElement> {
  const format = getImageFormat(file);

  if (format === 'HEIC') {
    throw new Error('HEIC/HEIF format is not supported directly. Please select a standard JPG/PNG photo.');
  }

  // METHOD A: Native createImageBitmap with Hardware Acceleration
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      if (maxDimension) {
        return await createImageBitmap(file, {
          resizeWidth: maxDimension,
          resizeQuality: 'high',
        });
      }
      return await createImageBitmap(file);
    } catch {
      console.warn('[FORMILO] Method A failed. Switching to Method B (ObjectURL)...');
    }
  }

  // METHOD B: HTMLImageElement + ObjectURL
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
  } catch {
    console.warn('[FORMILO] Method B failed. Switching to Method C (FileReader)...');
  }

  // METHOD C: FileReader Base64 Buffer Fallback
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

// 5. Binary Search Target Compressor for Custom KB and Auto Scale
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

  onProgress?.('Decoding camera image safely...');
  const decodedSource = await decodeImageSafely(file, targetMaxDim);

  const sourceWidth = 'width' in decodedSource ? decodedSource.width : decodedSource.naturalWidth;
  const sourceHeight = 'height' in decodedSource ? decodedSource.height : decodedSource.naturalHeight;

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
    if ('close' in decodedSource && typeof decodedSource.close === 'function') decodedSource.close();
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
    if ('close' in decodedSource && typeof decodedSource.close === 'function') decodedSource.close();
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
  const maxIterations = 14;

  while (iterations < maxIterations) {
    iterations++;

    let lowQ = 0.05;
    let highQ = 0.96;
    let localBestBlob: Blob | null = null;
    let localBestQ = lowQ;

    // 7-Stage Fast Binary Search for Exact KB
    for (let i = 0; i < 7; i++) {
      const midQ = (lowQ + highQ) / 2;
      const testBlob = await renderToBlob(finalWidth, finalHeight, midQ);

      if (testBlob.size <= targetBytes) {
        localBestBlob = testBlob;
        localBestQ = midQ;
        lowQ = midQ; // Try sharper quality
      } else {
        highQ = midQ; // Reduce quality
      }
    }

    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      finalQuality = localBestQ;
      break;
    }

    // Step down dimensions if strict KB threshold requires scaling
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

  if ('close' in decodedSource && typeof decodedSource.close === 'function') {
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

// 6. Direct Exact-Dimension Formatter for SSC, UPSC, PAN & Exam Presets
export async function processAndCompressImage(
  file: File,
  options: ExactDimensionOptions
): Promise<Blob> {
  const { targetKB, width, height } = options;

  const result = await compressImageToTarget(file, {
    targetKB,
    width,
    height,
    forceJpeg: true,
    isSignature: options.isSignature
  });

  return result.blob;
}
