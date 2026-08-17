// app/sitemap.ts

import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 1. Core Category & Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/photo-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pdf-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/signature-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/image-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/form-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 2. All Dynamic Tools (Auto-updates for 169+ tools and future additions)
  const toolRoutes: MetadataRoute.Sitemap = TOOLS
    .filter((t) => t.enabled)
    .map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: tool.badge === 'Popular' || tool.badge === 'Exam Preset' ? 0.85 : 0.75,
    }));

  return [...staticRoutes, ...toolRoutes];
}
