import { getContexts } from '@/lib/firebase/firebase-server';
import { getSiteUrl } from '@/lib/site-url';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  const contexts = (await getContexts()) ?? [];
  if (contexts.length === 0) {
    // Intentional fallback: if no contexts are available, the sitemap only includes static pages.
    console.warn(
      'sitemap(): getContexts() returned no contexts; generating sitemap with base URL only.',
    );
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-to`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const contextPages: MetadataRoute.Sitemap = [];

  for (const context of contexts) {
    const id = context.context_id;

    contextPages.push({
      url: `${baseUrl}/${id}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  return [...staticPages, ...contextPages];
}
