import type { Metadata } from 'next';
import { SitePage } from '@/components/blocks/registry';
import { findCmsPage, getSite, SITE_URL } from '@/lib/site';
import { homeStructuredData, ldScript, resolveOgImage } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const page = findCmsPage(site, '/');
  const seo: Record<string, any> = site.seo || {};
  const g: Record<string, any> = site.global || {};
  const brand = g.brandName || 'Alma Mineral';
  const title =
    (page as any)?.seoTitle ||
    seo.metaTitle ||
    `${brand} | Desodorante Natural de Piedra de Alumbre · Sin Aluminio Sintético`;
  const description =
    (page as any)?.seoDescription ||
    seo.metaDescription ||
    'Protección mineral 24h en vidrio ámbar con Piedra de Alumbre, Neem, Romero, Menta y Vitamina E. Libre de clorhidrato de aluminio, no oscurece la piel ni mancha tu ropa. Envíos en Colombia con Wompi o contraentrega.';
  const ogImg = resolveOgImage(site, (page as any)?.seoImage || seo.ogImage);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: 'website',
      locale: 'es_CO',
      images: ogImg ? [{ url: ogImg, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

export default async function HomePage() {
  const site = await getSite();
  return (
    <>
      <SitePage pageSlug="/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(homeStructuredData(site))} />
    </>
  );
}
