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

// 1. File Type Detection Helper
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

// 2. Base64 DataURL to Blob Converter (Fallback for older mobile browsers)
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

// 3. Robust Canvas to Blob with Memory Fallback
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
  const fallbackBlob = dataURLToBlob(dataUrl);
  if (!fallbackBlob || fallbackBlob.size === 0) {
    throw new Error('Your browser could not encode this image.');
  }
  return fallbackBlob;
}

// 4. Subtle Convolution Sharpen Filter (Prevents blur on downscaled photos/text)
export function applyCrispFilter(ctx: CanvasRenderingContext2D, w: number, h: number) {
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    const weights = [
      0, -0.15, 0,
      -0.15, 1.6, -0.15,
      0, -0.15, 0
    ];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const dstOff = (y * w + x) * 4;
        let r = 0, g = 0, b = 0;

        for (let cy = 0; cy < 3; cy++) {
          for (let cx = 0; cx < 3; cx++) {
            const scx = x + cx - 1;
            const scy = y + cy - 1;
            const srcOff = (scy * w + scx) * 4;
            const wt = weights[cy * 3 + cx];
            r += copy[srcOff] * wt;
            g += copy[srcOff + 1] * wt;
            b += copy[srcOff + 2] * wt;
          }
        }

        data[dstOff] = Math.min(255, Math.max(0, r));
        data[dstOff + 1] = Math.min(255, Math.max(0, g));
        data[dstOff + 2] = Math.min(255, Math.max(0, b));
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {}
}

// 5. 3-Stage Safe Image Loader
export async function decodeImageSafely(file: File, maxDimension?: number): Promise<any> {
  const format = getImageFormat(file);
  if (format === 'HEIC') {
    throw new Error('HEIC/HEIF format is not supported directly. Please upload a JPG or PNG file.');
  }

  // Method A: Native createImageBitmap
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

  // Method B: Image Object URL
  try {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image ObjectURL load error'));
    });
    URL.revokeObjectURL(objectUrl);
    return img;
  } catch {}

  // Method C: FileReader Base64 Buffer
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

// 6. HD Binary Search Target Compressor
export async function compressImageToTarget(
  file: File,
  options: CompressionOptions = {},
  onProgress?: (msg: string) => void
): Promise<CompressionResult> {
  onProgress?.('Reading photo...');

  const decodedSource: any = await decodeImageSafely(file, options.maxDimension);

  const sourceWidth = Number(decodedSource.naturalWidth || decodedSource.width || 350);
  const sourceHeight = Number(decodedSource.naturalHeight || decodedSource.height || 450);

  let targetWidth = options.width || sourceWidth;
  let targetHeight = options.height || sourceHeight;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    if (decodedSource && typeof decodedSource.close === 'function') decodedSource.close();
    throw new Error('Canvas memory allocation failed.');
  }

  // High-Quality Step-down Bicubic Sampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(decodedSource, 0, 0, targetWidth, targetHeight);

  // Apply crisp sharpness to prevent fuzzy text/signatures
  applyCrispFilter(ctx, targetWidth, targetHeight);

  const targetBytes = options.targetKB ? options.targetKB * 1024 : 50 * 1024;
  const exportMime = 'image/jpeg';

  onProgress?.('Locking maximum HD clarity...');

  let lowQ = 0.25;
  let highQ = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.95;

  // 9-Step Precision Binary Search (Preserves maximum allowed KB)
  for (let i = 0; i < 9; i++) {
    const midQ = (lowQ + highQ) / 2;
    const blob = await canvasToBlobSafe(canvas, exportMime, midQ);

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      bestQuality = midQ;
      lowQ = midQ; // Push for higher sharpness
    } else {
      highQ = midQ; // Scale down quality slightly
    }
  }

  if (!bestBlob) {
    bestBlob = await canvasToBlobSafe(canvas, exportMime, 0.2);
    bestQuality = 0.2;
  }

  if (decodedSource && typeof decodedSource.close === 'function') {
    decodedSource.close();
  }

  return {
    blob: bestBlob,
    width: targetWidth,
    height: targetHeight,
    quality: bestQuality,
    sizeBytes: bestBlob.size,
    mimeType: exportMime,
  };
}

// 7. Exact-Dimension Preset Formatter
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
