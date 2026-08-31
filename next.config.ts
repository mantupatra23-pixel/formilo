import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      // 1. Force 301 Redirect from Vercel preview domains to Main Domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'formilo-jzcl.vercel.app',
          },
        ],
        destination: 'https://www.formilo.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'formilo-jzcl-git-main-mantupatra23-8293s-projects.vercel.app',
          },
        ],
        destination: 'https://www.formilo.in/:path*',
        permanent: true,
      },

      // 2. Dedicated PDF & Document Tool Routing
      {
        source: '/tools/pdf-compressor-under-200kb',
        destination: '/pdf-compressor',
        permanent: true,
      },
      {
        source: '/tools/compress-pdf-to-100kb',
        destination: '/pdf-compressor',
        permanent: true,
      },
      {
        source: '/tools/compress-pdf-to-200kb',
        destination: '/pdf-compressor',
        permanent: true,
      },
      {
        source: '/tools/compress-pdf-to-500kb',
        destination: '/pdf-compressor',
        permanent: true,
      },
      {
        source: '/tools/pdf-size-reducer-300kb',
        destination: '/pdf-compressor',
        permanent: true,
      },
      {
        source: '/tools/jpg-to-pdf-converter',
        destination: '/jpg-to-pdf-converter',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-jpg-converter',
        destination: '/pdf-to-jpg-converter',
        permanent: true,
      },

      // 3. Redirect Legacy Tools to Dedicated Landing Pages
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

      // 4. Clean Nested Corrupted URL Patterns
      {
        source: '/exam/:slug*-postcard-photo-4x6-postcard-size-photo-4x6-resizer',
        destination: '/exam/:slug*-postcard-size-photo-4x6-resizer',
        permanent: true,
      },
      {
        source: '/exam/:slug*-postcard-photo-4x6-passport-size-photo-resizer',
        destination: '/exam/:slug*-passport-size-photo-resizer',
        permanent: true,
      },
      {
        source: '/exam/:slug*-postcard-photo-4x6-signature-crop-compress',
        destination: '/exam/:slug*-signature-crop-compress',
        permanent: true,
      },
      {
        source: '/exam/:slug*-postcard-photo-4x6-left-thumb-impression-resizer',
        destination: '/exam/:slug*-left-thumb-impression-resizer',
        permanent: true,
      },
      {
        source: '/exam/:slug*-left-left-thumb-impression-resizer',
        destination: '/exam/:slug*-left-thumb-impression-resizer',
        permanent: true,
      },
      {
        source: '/exam/:slug*-signature-resize-to-20kb-signature-crop-compress',
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

      // 5. Universal Fallback
      {
        source: '/tools/:slug',
        destination: '/exam/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
