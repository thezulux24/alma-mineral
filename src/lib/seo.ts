import { mediaUrl, type CollectionItem, type DeliveryPayload } from '@latinovation/cms-client';
import { CMS_URL, SITE_URL } from './site';

export function ldScript(obj: unknown): { __html: string } {
  return { __html: JSON.stringify(obj).replace(/</g, '\\u003c') };
}

export function organizationLd(payload: DeliveryPayload) {
  const g: Record<string, any> = payload.global || {};
  const social = Array.isArray(g.social) ? g.social.map((s: any) => s?.url).filter(Boolean) : [];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: g.brandName || payload.project?.name || 'Alma Mineral',
    url: SITE_URL,
    logo: g.logoUrl ? mediaUrl(g.logoUrl, CMS_URL) : undefined,
    email: g.email || undefined,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Valle del Cauca',
      addressCountry: 'CO',
    },
    sameAs: social.length ? social : undefined,
  };
}

export function productLd(item: CollectionItem, payload: DeliveryPayload) {
  const g: Record<string, any> = payload.global || {};
  const price = Number(item.price ?? item.data?.price ?? 0);
  const stock = Number(item.stock ?? item.data?.stock ?? 10);
  const img = item.imageUrl || item.data?.imageUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    sku: item.sku || item.data?.sku || item.slug,
    description: item.summary || item.data?.summary || g.tagline,
    image: img ? [mediaUrl(String(img), CMS_URL)] : undefined,
    brand: {
      '@type': 'Brand',
      name: item.brand || item.data?.brand || g.brandName || 'Alma Mineral',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/producto/${item.slug}`,
      priceCurrency: payload.ecommerce?.currency || 'COP',
      price: price > 0 ? price : 37000,
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}
