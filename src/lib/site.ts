import { getPage, tryFetchDelivery, type CmsPage, type DeliveryPayload } from '@latinovation/cms-client';

export const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || 'https://webproai.tech').replace(/\/$/, '');
export const CMS_SLUG = process.env.NEXT_PUBLIC_CMS_SLUG || 'almamineral';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://almamineral.179.236.72.201.sslip.io').replace(/\/$/, '');

export const PORTAL_ORIGINS = (process.env.NEXT_PUBLIC_PORTAL_ORIGINS || 'https://webproai.tech,http://localhost:3005')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const EMPTY_SITE: DeliveryPayload = {
  project: { id: '', name: 'Alma Mineral', slug: CMS_SLUG },
  global: {},
  seo: {},
  navigation: {},
  pages: [],
  collections: {},
  collectionDefinitions: {},
} as unknown as DeliveryPayload;

/** Contenido publicado en el CMS con ISR (60 s) y etiqueta `cms:almamineral` para revalidación inmediata. */
export async function getSite(): Promise<DeliveryPayload> {
  return (await tryFetchDelivery({ slug: CMS_SLUG, baseUrl: CMS_URL, revalidate: 60 })) || EMPTY_SITE;
}

export function findCmsPage(payload: DeliveryPayload, pageSlug: string): CmsPage | null {
  return getPage(payload, pageSlug) || null;
}
