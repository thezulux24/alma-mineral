import type { Metadata, Viewport } from 'next';
import { Young_Serif, Source_Serif_4 } from 'next/font/google';
import { mediaUrl } from '@latinovation/cms-client';
import './globals.css';
import { CMS_SLUG, CMS_URL, getSite, PORTAL_ORIGINS, SITE_URL } from '@/lib/site';
import { ldScript, organizationLd } from '@/lib/seo';
import {
  CartDrawer,
  CookieConsentBanner,
  Footer,
  Header,
  SiteProviders,
  SkipLink,
  ToastBanner,
} from '@/components/Shell';

const youngSerif = Young_Serif({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-young-serif',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const seo: Record<string, any> = site.seo || {};
  const g: Record<string, any> = site.global || {};
  const brand = g.brandName || site.project?.name || 'Alma Mineral';
  const title = seo.metaTitle || `${brand} · Desodorante Natural de Piedra de Alumbre`;
  const description =
    seo.metaDescription ||
    g.tagline ||
    'Desodorante natural en spray con Piedra de Alumbre y aceites esenciales. Hecho en Colombia.';

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${brand}` },
    description,
    icons: g.faviconUrl
      ? { icon: mediaUrl(g.faviconUrl, CMS_URL), apple: mediaUrl(g.faviconUrl, CMS_URL) }
      : undefined,
    openGraph: {
      title,
      description,
      siteName: brand,
      locale: 'es_CO',
      type: 'website',
      images: seo.ogImage ? [{ url: mediaUrl(seo.ogImage, CMS_URL) }] : undefined,
    },
    robots: seo.robotsIndex === false ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#1F381E',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="es-CO" className={`${youngSerif.variable} ${sourceSerif.variable}`}>
      <head>
        <link rel="preconnect" href={CMS_URL} />
      </head>
      <body>
        <SiteProviders initial={site} slug={CMS_SLUG} cmsUrl={CMS_URL} allowedOrigins={PORTAL_ORIGINS}>
          <SkipLink />
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <CartDrawer />
          <ToastBanner />
          <CookieConsentBanner />
        </SiteProviders>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(organizationLd(site))} />
      </body>
    </html>
  );
}
