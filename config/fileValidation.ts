export interface FileTypeConfig {
  accept: string[];
  extensions: string[];
  maxSizeMB: number;
  label: string;
}

export const TOOL_FILE_CONFIG: Record<string, FileTypeConfig> = {
  pdfToJpg: {
    accept: ['application/pdf'],
    extensions: ['.pdf'],
    maxSizeMB: 50,
    label: 'Supports PDF files',
  },
  jpgToPdf: {
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 25,
    label: 'Supports JPG, JPEG, PNG, and WebP images',
  },
  pdfCompressor: {
    accept: ['application/pdf'],
    extensions: ['.pdf'],
    maxSizeMB: 50,
    label: 'Supports PDF files',
  },
  imageCompressor: {
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 25,
    label: 'Supports JPG, JPEG, PNG, and WebP images',
  },
  photoResize20: {
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 25,
    label: 'Supports JPG, JPEG, PNG, and WebP images',
  },
  photoResize50: {
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 25,
    label: 'Supports JPG, JPEG, PNG, and WebP images',
  },
  photoResize100: {
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 25,
    label: 'Supports JPG, JPEG, PNG, and WebP images',
  },
  signatureResize20: {
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMB: 15,
    label: 'Supports JPG, JPEG, PNG, and WebP images',
  },
};

export function getAcceptString(configKey: string): string {
  const conf = TOOL_FILE_CONFIG[configKey];
  if (!conf) return 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
  return [...conf.accept, ...conf.extensions].join(',');
}

export function validateSelectedFile(file: File, configKey: string): { valid: boolean; message?: string } {
  const conf = TOOL_FILE_CONFIG[configKey];
  if (!conf) return { valid: true };

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidMime = conf.accept.includes(file.type);
  const isValidExt = conf.extensions.includes(ext);

  if (!isValidMime && !isValidExt) {
    return {
      valid: false,
      message: `Invalid file format (${file.name}). ${conf.label}.`,
    };
  }

  if (file.size > conf.maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      message: `File size exceeds the ${conf.maxSizeMB} MB limit for browser processing.`,
    };
  }

  return { valid: true };
}
