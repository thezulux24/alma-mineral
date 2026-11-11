import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { mediaUrl } from '@latinovation/cms-client';
import { SitePage } from '@/components/blocks/registry';
import { CMS_URL, findCmsPage, getSite } from '@/lib/site';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = `/${slug.join('/')}`;
  const site = await getSite();
  const page = findCmsPage(site, pageSlug);
  if (!page) return {};
  const title = (page as any).seoTitle || page.title;
  const description = (page as any).seoDescription || (page as any).description || undefined;
  const seoImage = (page as any).seoImage;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seoImage ? [{ url: mediaUrl(String(seoImage), CMS_URL) }] : undefined,
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

  return <SitePage pageSlug={pageSlug} />;
}
