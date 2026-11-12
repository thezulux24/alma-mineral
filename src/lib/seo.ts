import { mediaUrl, type CollectionItem, type DeliveryPayload } from '@latinovation/cms-client';
import { CMS_URL, findCmsPage, SITE_URL } from './site';

export function ldScript(obj: unknown): { __html: string } {
  return { __html: JSON.stringify(obj).replace(/</g, '\\u003c') };
}

function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveOgImage(payload: DeliveryPayload, preferred?: string | null): string | undefined {
  const seo: Record<string, any> = payload.seo || {};
  const g: Record<string, any> = payload.global || {};
  const products: CollectionItem[] = (payload.collections as any)?.productos || [];
  const raw = preferred || seo.ogImage || products[0]?.imageUrl || g.logoUrl;
  return raw ? mediaUrl(String(raw), CMS_URL) : undefined;
}

function colombiaShippingDetails() {
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: 5000,
      currency: 'COP',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'CO',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'DAY',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 4,
        unitCode: 'DAY',
      },
    },
  };
}

function merchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'CO',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 5,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
  };
}

export function organizationLd(payload: DeliveryPayload) {
  const g: Record<string, any> = payload.global || {};
  const social = Array.isArray(g.social) ? g.social.map((s: any) => s?.url).filter(Boolean) : [];
  const brandName = g.brandName || payload.project?.name || 'Alma Mineral';
  const logo = g.logoUrl ? mediaUrl(g.logoUrl, CMS_URL) : undefined;
  const heroImage = resolveOgImage(payload);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'OnlineStore'],
        '@id': `${SITE_URL}/#organization`,
        name: brandName,
        url: SITE_URL,
        logo: logo
          ? {
              '@type': 'ImageObject',
              url: logo,
            }
          : undefined,
        image: heroImage,
        description:
          g.tagline ||
          'Desodorante natural colombiano en vidrio ámbar con Piedra de Alumbre (Potassium Alum), Neem, Romero, Menta, Vitamina E y Omega 6.',
        email: g.email || 'almamineral.co@gmail.com',
        currenciesAccepted: 'COP',
        paymentAccepted: 'Wompi, PSE, Nequi, Tarjeta de Crédito, Tarjeta Débito, Pago Contraentrega',
        priceRange: '$37.000 - $99.900 COP',
        areaServed: {
          '@type': 'Country',
          name: 'Colombia',
        },
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Valle del Cauca',
          addressCountry: 'CO',
        },
        hasMerchantReturnPolicy: merchantReturnPolicy(),
        sameAs: social.length ? social : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: brandName,
        inLanguage: 'es-CO',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function homeStructuredData(payload: DeliveryPayload) {
  const products: CollectionItem[] = ((payload.collections as any)?.productos || []).slice(0, 6);
  const homePage = findCmsPage(payload, '/');
  const rawSections: any = homePage?.sections;
  let faqData: any = null;
  if (Array.isArray(rawSections)) {
    const found = rawSections.find(
      (sec: any) =>
        sec?.key === 'preguntas' ||
        sec?.blockId === 'faq.accordion' ||
        sec?.data?._block === 'faq.accordion',
    );
    faqData = found?.data || found;
  } else if (rawSections && typeof rawSections === 'object') {
    const direct = rawSections.preguntas;
    if (direct) {
      faqData = direct.data || direct;
    } else {
      const found = Object.values(rawSections).find(
        (sec: any) => sec?. _block === 'faq.accordion' || sec?.data?._block === 'faq.accordion',
      ) as any;
      faqData = found?.data || found;
    }
  }
  const faqItems: Array<{ question?: string; answer?: string }> = Array.isArray(faqData?.items)
    ? faqData.items
    : [];

  const graph: Record<string, unknown>[] = [];

  if (products.length > 0) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#catalog`,
      name: 'Presentaciones Desodorante Natural Alma Mineral',
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/producto/${p.slug}`,
        item: productNode(p, payload),
      })),
    });
  }

  const validFaqs = faqItems
    .map((f) => ({ q: stripHtml(f.question || ''), a: stripHtml(f.answer || '') }))
    .filter((f) => f.q && f.a);

  if (validFaqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: validFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function breadcrumbNode(crumbs: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: c.path.startsWith('http') ? c.path : `${SITE_URL}${c.path === '/' ? '' : c.path}`,
    })),
  };
}

export function breadcrumbLd(crumbs: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    ...breadcrumbNode(crumbs),
  };
}

function productNode(item: CollectionItem, payload: DeliveryPayload) {
  const g: Record<string, any> = payload.global || {};
  const price = Number(item.price ?? item.data?.price ?? 37000);
  const stock = Number(item.stock ?? item.data?.stock ?? 10);
  const img = item.imageUrl || item.data?.imageUrl;
  const gallery = Array.isArray(item.gallery)
    ? item.gallery.map((x: any) => (typeof x === 'string' ? x : x?.url)).filter(Boolean)
    : [];
  const allImgs = [img, ...gallery].filter(Boolean).map((u) => mediaUrl(String(u), CMS_URL));

  return {
    '@type': 'Product',
    '@id': `${SITE_URL}/producto/${item.slug}#product`,
    name: item.title,
    sku: item.sku || item.data?.sku || item.slug,
    mpn: item.sku || item.slug,
    category: 'Cuidado Personal Natural > Desodorantes sin Aluminio',
    description:
      item.summary ||
      item.data?.summary ||
      g.tagline ||
      'Desodorante natural en spray con Piedra de Alumbre, Neem, Romero, Menta y Vitamina E.',
    image: allImgs.length ? allImgs : undefined,
    brand: {
      '@type': 'Brand',
      name: item.brand || item.data?.brand || g.brandName || 'Alma Mineral',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/producto/${item.slug}`,
      priceCurrency: payload.ecommerce?.currency || 'COP',
      price: price > 0 ? price : 37000,
      priceValidUntil: '2027-12-31',
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#organization` },
      shippingDetails: colombiaShippingDetails(),
      hasMerchantReturnPolicy: merchantReturnPolicy(),
    },
  };
}

export function productLd(item: CollectionItem, payload: DeliveryPayload) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      productNode(item, payload),
      breadcrumbNode([
        { name: 'Inicio', path: '/' },
        { name: 'Tienda', path: '/tienda' },
        { name: String(item.title || 'Producto'), path: `/producto/${item.slug}` },
      ]),
    ],
  };
}
