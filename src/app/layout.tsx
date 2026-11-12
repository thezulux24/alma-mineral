import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { mediaUrl } from '@latinovation/cms-client';
import './globals.css';
import { CMS_SLUG, CMS_URL, getSite, PORTAL_ORIGINS, SITE_URL } from '@/lib/site';
import { ldScript, organizationLd, resolveOgImage } from '@/lib/seo';
import {
  CartDrawer,
  CookieConsentBanner,
  Footer,
  Header,
  SiteProviders,
  SkipLink,
  ToastBanner,
} from '@/components/Shell';

const cormorant = Cormorant_Garamond({
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const seo: Record<string, any> = site.seo || {};
  const g: Record<string, any> = site.global || {};
  const brand = g.brandName || site.project?.name || 'Alma Mineral';
  const title =
    seo.metaTitle || `${brand} | Desodorante Natural de Piedra de Alumbre en Colombia`;
  const description =
    seo.metaDescription ||
    'Desodorante natural en vidrio ámbar con Piedra de Alumbre, Neem, Romero, Menta y Vitamina E. 24h sin mal olor, sin clorhidrato de aluminio y sin manchar tu ropa. Envíos a toda Colombia.';
  const ogImg = resolveOgImage(site, seo.ogImage);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${brand}` },
    description,
    keywords: [
      'desodorante natural Colombia',
      'desodorante piedra de alumbre',
      'desodorante sin aluminio Colombia',
      'desodorante que no mancha la ropa',
      'desodorante piel sensible axilas',
      'Alma Mineral',
      'desodorante vegano artesanal Colombia',
      'potassium alum spray',
    ],
    authors: [{ name: brand, url: SITE_URL }],
    creator: brand,
    publisher: brand,
    category: 'beauty',
    alternates: {
      canonical: SITE_URL,
      languages: { 'es-CO': SITE_URL },
    },
    icons: g.faviconUrl
      ? { icon: mediaUrl(g.faviconUrl, CMS_URL), apple: mediaUrl(g.faviconUrl, CMS_URL) }
      : { icon: '/icon.webp', apple: '/icon.webp' },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: brand,
      locale: 'es_CO',
      type: 'website',
      images: ogImg ? [{ url: ogImg, width: 1200, height: 1200, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
    },
    robots:
      seo.robotsIndex === false
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
  };
}

export const viewport: Viewport = {
  themeColor: '#14261B',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="es-CO" className={`${cormorant.variable} ${jakarta.variable}`}>
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
