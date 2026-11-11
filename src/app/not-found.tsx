'use client';

import Link from 'next/link';
import { CmsGlobalText, useGlobal } from '@latinovation/cms-client/react';

export default function NotFound() {
  const ctaHref = useGlobal<string>('site.notFound.ctaHref', '/tienda');

  return (
    <section className="am-section-pad">
      <div className="am-container am-narrow-container">
        <div className="am-empty-card">
          <CmsGlobalText
            f="site.notFound.title"
            as="h1"
            className="am-h2"
            fallback="Esta página no hace parte de la botica."
          />
          <CmsGlobalText
            f="site.notFound.body"
            as="p"
            className="am-lead"
            fallback="Es posible que el enlace haya cambiado. Explora nuestras presentaciones en la tienda."
          />
          <div>
            <Link href={ctaHref || '/tienda'} className="am-btn am-btn-primary">
              <CmsGlobalText f="site.notFound.ctaLabel" fallback="Ir a la tienda" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
