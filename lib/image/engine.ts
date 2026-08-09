export interface ProcessImageOptions {
  file: File;
  targetKB?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  initialQuality?: number;
}

export interface ProcessImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  originalSizeBytes: number;
  reductionPercentage: number;
}

/**
 * Loads a File into an HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to parse image file. File may be corrupted or unsupported.'));
    };
    img.src = url;
  });
}

/**
 * Core Binary-Search Target KB Image Compression Engine
 */
export async function processImageToTargetKB(options: ProcessImageOptions): Promise<ProcessImageResult> {
  const { file, targetKB, maxWidth, maxHeight, format = 'image/jpeg' } = options;
  const img = await loadImage(file);

  let width = img.naturalWidth;
  let height = img.naturalHeight;

  // Calculate proportional resize if dimensions exceed limits
  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Browser Canvas context non-available.');
  }

  // Draw background white for transparent PNGs converting to JPEG
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const targetBytes = targetKB ? targetKB * 1024 : Infinity;
  let minQuality = 0.01;
  let maxQuality = 0.98;
  let bestBlob: Blob | null = null;
  let currentQuality = 0.85;

  // If no target KB specified, single render with default quality
  if (!targetKB) {
    bestBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), format, 0.90));
  } else {
    // Binary Search quality optimization loop (Max 8 attempts for performance)
    for (let i = 0; i < 8; i++) {
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), format, currentQuality));
      
      if (blob.size <= targetBytes) {
        bestBlob = blob;
        minQuality = currentQuality; // Try higher quality if room exists
      } else {
        maxQuality = currentQuality; // Reduce quality limit
      }
      currentQuality = (minQuality + maxQuality) / 2;
    }

    // Fallback dimension reduction if quality alone cannot meet target size
    if (!bestBlob || bestBlob.size > targetBytes) {
      let scale = 0.9;
      while (scale >= 0.2) {
        const scaledWidth = Math.round(width * scale);
        const scaledHeight = Math.round(height * scale);
        
        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = scaledWidth;
        scaledCanvas.height = scaledHeight;
        const sCtx = scaledCanvas.getContext('2d')!;
        
        if (format === 'image/jpeg') {
          sCtx.fillStyle = '#FFFFFF';
          sCtx.fillRect(0, 0, scaledWidth, scaledHeight);
        }
        sCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
        const blob = await new Promise<Blob>((res) => scaledCanvas.toBlob((b) => res(b!), format, 0.65));
        if (blob.size <= targetBytes) {
          bestBlob = blob;
          width = scaledWidth;
          height = scaledHeight;
          break;
        }
        scale -= 0.15;
      }
    }
  }

  if (!bestBlob) {
    throw new Error(`Unable to reach ${targetKB} KB target. Try choosing a smaller original photo.`);
  }

  const dataUrl = URL.createObjectURL(bestBlob);
  const reductionPercentage = Math.max(0, Number((((file.size - bestBlob.size) / file.size) * 100).toFixed(1)));

  return {
    blob: bestBlob,
    dataUrl,
    width,
    height,
    sizeBytes: bestBlob.size,
    originalSizeBytes: file.size,
    reductionPercentage
  };
}
