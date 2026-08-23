import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // 1. Redirect indexed legacy KB tools to dedicated high-CTR landing pages
      {
        source: '/tools/photo-resize-to-20-kb',
        destination: '/photo-resizer-20kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-20kb',
        destination: '/photo-resizer-20kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-30-kb',
        destination: '/photo-resizer-30kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-30kb',
        destination: '/photo-resizer-30kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-50-kb',
        destination: '/photo-resizer-50kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-50kb',
        destination: '/photo-resizer-50kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-100-kb',
        destination: '/photo-resizer-100kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-100kb',
        destination: '/photo-resizer-100kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-150-kb',
        destination: '/photo-resizer-150kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-150kb',
        destination: '/photo-resizer-150kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-to-200-kb',
        destination: '/photo-resizer-200kb',
        permanent: true,
      },
      {
        source: '/tools/photo-resize-200kb',
        destination: '/photo-resizer-200kb',
        permanent: true,
      },

      // 2. Redirect legacy PDF tools to new clean utility routes
      {
        source: '/tools/pdf-compress-to-200-kb',
        destination: '/tools/pdf-compressor-under-200kb',
        permanent: true,
      },
      {
        source: '/tools/pdf-compreso-to-100-kb',
        destination: '/tools/pdf-compressor-under-200kb',
        permanent: true,
      },

      // 3. Fix corrupted / nested duplicate URL patterns from Googlebot
      {
        source: '/exam/:path*-postcard-photo-4x6-postcard-size-photo-4x6-resizer',
        destination: '/exam/:path*-postcard-size-photo-4x6-resizer',
        permanent: true,
      },
      {
        source: '/exam/:path*-postcard-photo-4x6-passport-size-photo-resizer',
        destination: '/exam/:path*-passport-size-photo-resizer',
        permanent: true,
      },
      {
        source: '/exam/:path*-postcard-photo-4x6-signature-crop-compress',
        destination: '/exam/:path*-signature-crop-compress',
        permanent: true,
      },
      {
        source: '/exam/:path*-postcard-photo-4x6-left-thumb-impression-resizer',
        destination: '/exam/:path*-left-thumb-impression-resizer',
        permanent: true,
      },
      {
        source: '/exam/:path*-left-left-thumb-impression-resizer',
        destination: '/exam/:path*-left-thumb-impression-resizer',
        permanent: true,
      },
      {
        source: '/exam/:path*-signature-resize-to-20kb-signature-crop-compress',
        destination: '/exam/signature-resize-to-20kb',
        permanent: true,
      },
      {
        source: '/exam/pan-card-postcard-size-photo-4x6-resizer',
        destination: '/exam/pan-card-photo-resizer',
        permanent: true,
      },
      {
        source: '/exam/pan-card-left-thumb-impression-resizer',
        destination: '/exam/pan-card-signature-resizer',
        permanent: true,
      },

      // 4. Redirect legacy indexed PAN & specific tools to dynamic exam routes
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

      // 5. Universal Fallback: Any other legacy /tools/[slug] redirected to /exam/[slug]
      {
        source: '/tools/:slug((?!jpg-to-pdf-converter|pdf-to-jpg-converter|pdf-compressor-under-200kb).*)',
        destination: '/exam/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
