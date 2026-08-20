// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // 1. Redirect indexed KB tools to dedicated high-speed routes
      {
        source: '/tools/photo-resize-to-20-kb',
        destination: '/photo-resizer-20kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-30-kb',
        destination: '/photo-resizer-30kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-50-kb',
        destination: '/photo-resizer-50kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-100-kb',
        destination: '/photo-resizer-100kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-150-kb',
        destination: '/photo-resizer-150kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-200-kb',
        destination: '/photo-resizer-200kb',
        permanent: true,
      },
      // 2. Redirect indexed PAN & Exam tools to dynamic /exam routes
      {
        source: '/tools/pan-card-photo-resizer',
        destination: '/exam/pan-card-photo-resizer',
        permanent: true,
      },
      {
        source: '/tools/pan-card-signature-resizer',
        destination: '/exam/pan-card-signature-resizer',
        permanent: true,
      },
      // 3. Fallback: Any other /tools/[slug] redirected to /exam/[slug]
      {
        source: '/tools/:slug((?!jpg-to-pdf-converter|pdf-to-jpg-converter|pdf-compressor-under-200kb).*)',
        destination: '/exam/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
