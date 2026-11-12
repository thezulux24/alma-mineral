import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getItem } from '@latinovation/cms-client';
import { ProductDetailView } from '@/components/blocks/CatalogBlocks';
import { getSite, SITE_URL } from '@/lib/site';
import { ldScript, productLd, resolveOgImage } from '@/lib/seo';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const item = getItem(site, 'productos', slug);
  if (!item) return { title: 'Producto' };
  const title = (item as any).seoTitle || `${item.title} · Desodorante Piedra de Alumbre`;
  const description =
    (item as any).seoDescription ||
    item.summary ||
    `${item.title}: protección natural 24h con Piedra de Alumbre, Neem, Romero, Menta y Vitamina E. Envíos a toda Colombia con Wompi o contraentrega.`;
  const canonicalUrl = `${SITE_URL}/producto/${item.slug}`;
  const ogImg = resolveOgImage(site, String(item.imageUrl || ''));

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: 'es_CO',
      type: 'website',
      images: ogImg ? [{ url: ogImg, alt: String(item.title) }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const site = await getSite();
  const item = getItem(site, 'productos', slug);
  if (!item) {
    notFound();
  }

  return (
    <>
      <ProductDetailView slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(productLd(item, site))} />
    </>
  );
}
