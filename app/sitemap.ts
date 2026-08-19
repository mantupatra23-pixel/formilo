// app/sitemap.ts
import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import examToolsData from '@/data/exam-presets.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 1. Core Static, Legal, and Category Pages
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/photo-tools',
    '/signature-tools',
    '/pdf-tools',
    '/image-tools',
    '/form-tools',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. All Core Dynamic Tools (169+ Tools)
  const toolRoutes: MetadataRoute.Sitemap = (TOOLS || [])
    .filter((t) => t.enabled)
    .map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: tool.badge === 'Popular' || tool.badge === 'Exam Preset' ? 0.85 : 0.75,
    }));

  // 3. Programmatic Exam Tools (160+ Long-Tail Exam Pages)
  const examRoutes: MetadataRoute.Sitemap = (examToolsData || []).map((item) => ({
    url: `${BASE_URL}/exam/${item.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...toolRoutes, ...examRoutes];
}
