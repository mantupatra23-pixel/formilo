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

      // 2. Direct PDF-to-JPG Dedicated Routes
      {
        source: '/tools/pdf-to-jpg-converter',
        destination: '/pdf-to-jpg-converter',
        permanent: true,
      },
      {
        source: '/exam/pdf-to-jpg-converter',
        destination: '/pdf-to-jpg-converter',
        permanent: true,
      },
      {
        source: '/exam/pdf-to-jpg-converter-passport-size-photo-resizer',
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

      // 4. Universal Fallback for Any Legacy /tools/:slug Route
      {
        source: '/tools/:slug',
        destination: '/exam/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
