import type { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/toolsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.formilo.in';
  const currentDate = new Date('2026-08-31');

  const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>();

  // 1. High-Priority Static & Dedicated Tools Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cyber-cafe`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    
    // Core Photo Resizers
    { url: `${baseUrl}/photo-resizer-20kb`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/photo-resizer-30kb`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/photo-resizer-50kb`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/photo-resizer-100kb`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/photo-resizer-150kb`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/photo-resizer-200kb`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/name-date-on-photo`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },

    // Core PDF & Conversion Suite
    { url: `${baseUrl}/jpg-to-pdf-converter`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/pdf-to-jpg-converter`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/pdf-compressor`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },

    // AdSense & Legal Compliance Pages
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/disclaimer`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
  ];

  staticPages.forEach((page) => {
    sitemapMap.set(page.url, page);
  });

  // 2. Dynamic 1,075+ Tools from Centralized Tool Registry
  const allTools = getAllTools();
  allTools.forEach((tool) => {
    const cleanSlug = tool.slug.replace(/^\/+/, '').trim();
    const fullUrl = `${baseUrl}/${cleanSlug}`;

    if (!sitemapMap.has(fullUrl)) {
      sitemapMap.set(fullUrl, {
        url: fullUrl,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: tool.popular ? 0.85 : 0.8,
      });
    }
  });

  return Array.from(sitemapMap.values());
}
