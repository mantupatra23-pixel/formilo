// app/manifest.ts

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Formilo — Online Photo, Signature & PDF Tools',
    short_name: 'Formilo',
    description: 'Fast, browser-side file optimization for online forms, competitive exams, and job portals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#10b981',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
