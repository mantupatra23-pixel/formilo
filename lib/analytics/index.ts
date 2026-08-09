/**
 * Event analytics wrapper - never sends file contents or private metadata
 */
export function trackToolOpen(slug: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'tool_open', { tool_slug: slug });
  }
}

export function trackUpload(slug: string, fileType: string, fileSize: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'file_upload', {
      tool_slug: slug,
      file_type: fileType,
      file_size_kb: Math.round(fileSize / 1024),
    });
  }
}

export function trackDownload(slug: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'file_download', { tool_slug: slug });
  }
}

export function trackError(slug: string, errorMessage: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'tool_error', {
      tool_slug: slug,
      error: errorMessage,
    });
  }
}
