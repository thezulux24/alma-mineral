import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getItem, mediaUrl } from '@latinovation/cms-client';
import { ProductDetailView } from '@/components/blocks/CatalogBlocks';
import { CMS_URL, getSite } from '@/lib/site';
import { ldScript, productLd } from '@/lib/seo';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const item = getItem(site, 'productos', slug);
  if (!item) return { title: 'Producto' };
  const title = (item as any).seoTitle || item.title;
  const description = (item as any).seoDescription || item.summary || undefined;
  const img = item.imageUrl;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: img ? [{ url: mediaUrl(String(img), CMS_URL) }] : undefined,
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
