import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { SitePage } from '@/components/blocks/registry';
import { findCmsPage, getSite, SITE_URL } from '@/lib/site';
import { breadcrumbLd, ldScript, resolveOgImage } from '@/lib/seo';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string[] }> };

const NOINDEX_PREFIXES = ['/checkout', '/pedido', '/cuenta', '/favoritos', '/carrito'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = `/${slug.join('/')}`;
  const site = await getSite();
  const page = findCmsPage(site, pageSlug);
  if (!page) return {};
  const title = (page as any).seoTitle || page.title;
  const description =
    (page as any).seoDescription ||
    (page as any).description ||
    `${page.title} en Alma Mineral Colombia · Desodorante natural en vidrio ámbar con Piedra de Alumbre y siete activos botánicos.`;
  const ogImg = resolveOgImage(site, (page as any).seoImage);
  const canonicalUrl = `${SITE_URL}${pageSlug}`;
  const isPrivate = NOINDEX_PREFIXES.some((p) => pageSlug === p || pageSlug.startsWith(`${p}/`));

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: isPrivate ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: 'es_CO',
      type: 'website',
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

export default async function CmsDynamicPage({ params }: Props) {
  const { slug } = await params;
  const pageSlug = `/${slug.join('/')}`;
  const site = await getSite();

  // Check CMS redirects first
  const redirects: Array<{ from: string; to: string; permanent?: boolean }> = (site as any).redirects || [];
  const hit = redirects.find((r) => r.from === pageSlug);
  if (hit && hit.to && hit.to !== pageSlug) {
    if (hit.permanent) permanentRedirect(hit.to);
    redirect(hit.to);
  }

  const page = findCmsPage(site, pageSlug);
  if (!page) {
    notFound();
  }

  const crumbs = breadcrumbLd([
    { name: 'Inicio', path: '/' },
    { name: page.title || slug[slug.length - 1], path: pageSlug },
  ]);

  return (
    <>
      <SitePage pageSlug={pageSlug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(crumbs)} />
    </>
  );
}
