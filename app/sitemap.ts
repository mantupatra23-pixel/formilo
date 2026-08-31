import { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/toolsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://www.formilo.in';
  const allTools = getAllTools();

  const toolEntries = allTools.map((t) => ({
    url: `${siteUrl}/${t.slug.replace(/^\//, '')}`,
    lastModified: new Date('2026-08-31'),
    changeFrequency: 'weekly' as const,
    priority: t.popular ? 0.9 : 0.8,
  }));

  const staticPages = [
    { url: `${siteUrl}`, lastModified: new Date('2026-08-31'), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date('2026-08-31'), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date('2026-08-31'), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date('2026-08-31'), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/terms`, lastModified: new Date('2026-08-31'), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/disclaimer`, lastModified: new Date('2026-08-31'), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/tools`, lastModified: new Date('2026-08-31'), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/cyber-cafe`, lastModified: new Date('2026-08-31'), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${siteUrl}/photo-resizer-20kb`, lastModified: new Date('2026-08-31'), changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${siteUrl}/photo-resizer-50kb`, lastModified: new Date('2026-08-31'), changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${siteUrl}/jpg-to-pdf-converter`, lastModified: new Date('2026-08-31'), changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${siteUrl}/pdf-to-jpg-converter`, lastModified: new Date('2026-08-31'), changeFrequency: 'weekly' as const, priority: 0.95 },
    { url: `${siteUrl}/pdf-compressor`, lastModified: new Date('2026-08-31'), changeFrequency: 'weekly' as const, priority: 0.95 },
  ];

  return [...staticPages, ...toolEntries];
}
