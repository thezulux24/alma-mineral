import type { MetadataRoute } from 'next';
import { getSite, SITE_URL } from '@/lib/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  const allowIndex = (site.seo as any)?.robotsIndex !== false;

  return {
    rules: allowIndex
      ? {
          userAgent: '*',
          allow: '/',
          disallow: ['/checkout', '/pedido', '/cuenta', '/favoritos', '/carrito'],
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
