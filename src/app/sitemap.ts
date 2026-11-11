import type { MetadataRoute } from 'next';
import { getSite, SITE_URL } from '@/lib/site';

const PRIVATE_SLUGS = new Set([
  '/checkout',
  '/pedido',
  '/favoritos',
  '/cuenta',
  '/cuenta/pedidos',
  '/cuenta/direcciones',
  '/cuenta/restablecer',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const now = new Date();

  const pageEntries: MetadataRoute.Sitemap = (site.pages || [])
    .filter((p) => !PRIVATE_SLUGS.has(p.slug))
    .map((p) => ({
      url: p.slug === '/' ? SITE_URL : `${SITE_URL}${p.slug}`,
      lastModified: now,
      changeFrequency: p.slug === '/' || p.slug === '/tienda' ? 'weekly' : 'monthly',
      priority: p.slug === '/' ? 1 : 0.8,
    }));

  const products = site.collections?.productos || [];
  const productEntries: MetadataRoute.Sitemap = products.map((it) => ({
    url: `${SITE_URL}/producto/${it.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...pageEntries, ...productEntries];
}
