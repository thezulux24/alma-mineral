'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, Leaf, Shield, Truck } from 'lucide-react';
import {
  CmsImage,
  CmsLink,
  CmsList,
  CmsRichText,
  CmsText,
  type CmsBlockProps,
} from '@latinovation/cms-client/react';

function renderCatalogIcon(name?: string) {
  switch (name) {
    case 'truck':
      return <Truck size={22} />;
    case 'shield':
      return <Shield size={22} />;
    case 'leaf':
      return <Leaf size={22} />;
    default:
      return <Check size={22} />;
  }
}

export function ContentSplitBlock({ section: s }: CmsBlockProps) {
  const isLeft = s.data.imageSide === 'left';

  return (
    <div className="am-section-pad">
      <div className={`am-container am-split-content ${isLeft ? 'is-img-left' : ''}`}>
        <div className="am-split-text-col">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsRichText f="body" className="am-richtext am-body-text" />
          {s.data.cta ? (
            <div className="am-split-cta-wrap">
              <CmsLink f="cta" className="am-btn am-btn-primary" />
            </div>
          ) : null}
        </div>
        <div className="am-split-media-col">
          <CmsImage f="image" className="am-split-img" width={840} height={960} />
        </div>
      </div>
    </div>
  );
}

export function FeaturesAlternatingBlock(_props: CmsBlockProps) {
  return (
    <div className="am-section-pad am-surface-band">
      <div className="am-container">
        <CmsText f="heading" as="h2" className="am-h2 am-mb-xl" />
        <div className="am-alt-rows">
          <CmsList
            f="items"
            wrap={false}
            renderItem={(_item, i, h) => (
              <article key={i} {...h.attrs} className={`am-alt-row ${i % 2 === 1 ? 'is-reversed' : ''}`}>
                <div className="am-alt-media">
                  <CmsImage f="image" className="am-alt-img" width={760} height={880} />
                </div>
                <div className="am-alt-copy">
                  <CmsText f="title" as="h3" className="am-h3" />
                  <CmsText f="body" as="p" className="am-body-text" />
                  <CmsLink f="link" className="am-inline-cta" />
                </div>
                {h.toolbar}
              </article>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function FeaturesGridBlock(_props: CmsBlockProps) {
  return (
    <div className="am-section-pad am-surface-band">
      <div className="am-container">
        <div className="am-section-head">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />
        </div>
        <div className="am-features-row">
          <CmsList
            f="items"
            wrap={false}
            renderItem={(item, i, h) => (
              <article key={i} {...h.attrs} className="am-feature-item">
                <span className="am-feature-icon" aria-hidden="true">
                  {renderCatalogIcon(item?.icon)}
                </span>
                <CmsText f="title" as="h3" className="am-h3" />
                <CmsText f="body" as="p" className="am-body-text" />
                {h.toolbar}
              </article>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function StepsProcessBlock(_props: CmsBlockProps) {
  return (
    <div className="am-section-pad">
      <div className="am-container">
        <div className="am-section-head">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />
        </div>
        <ol className="am-steps-list">
          <CmsList
            f="items"
            wrap={false}
            renderItem={(_item, i, h) => (
              <li key={i} {...h.attrs} className="am-step-card">
                <span className="am-step-num am-tabular">Paso {i + 1}</span>
                <CmsText f="title" as="h3" className="am-h3" />
                <CmsText f="body" as="p" className="am-body-text" />
                {h.toolbar}
              </li>
            )}
          />
        </ol>
      </div>
    </div>
  );
}

export function FaqAccordionBlock(_props: CmsBlockProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="am-section-pad">
      <div className="am-container am-faq-layout">
        <div className="am-faq-intro-col">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />
        </div>

        <div className="am-faq-list">
          <CmsList
            f="items"
            wrap={false}
            renderItem={(_item, i, h) => {
              const isOpen = openIdx === i;
              return (
                <div key={i} {...h.attrs} className={`am-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="am-faq-trigger"
                  >
                    <CmsText f="question" as="span" className="am-faq-q" />
                    <ChevronDown size={19} className="am-faq-chevron" />
                  </button>
                  {/* Keep answer in SSR DOM so SEO and CMS editability audit see 100 % of answers */}
                  <div className="am-faq-panel" aria-hidden={!isOpen}>
                    <div className="am-faq-panel-inner">
                      <CmsRichText f="answer" className="am-richtext am-body-text" />
                    </div>
                  </div>
                  {h.toolbar}
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function CtaBannerBlock({ section: s }: CmsBlockProps) {
  const inverse = s.data.tone === 'inverse' || s.data.tone === 'primary';

  return (
    <div className={`am-section-pad ${inverse ? 'am-cta-inverse' : 'am-surface-band'}`}>
      <div className="am-container am-cta-banner-inner">
        <div>
          {s.data.headline ? (
            <CmsText f="headline" as="h2" className="am-h2" />
          ) : (
            <CmsText f="heading" as="h2" className="am-h2" />
          )}
          <CmsText f="body" as="p" className="am-lead" />
        </div>
        <div className="am-cta-actions">
          {s.data.primaryCta ? (
            <CmsLink f="primaryCta" className={inverse ? 'am-btn am-btn-paper' : 'am-btn am-btn-primary'} />
          ) : null}
          {s.data.secondaryCta ? (
            <CmsLink f="secondaryCta" className="am-btn am-btn-outline" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function RichTextSectionBlock({ section: s }: CmsBlockProps) {
  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        {s.data.heading ? <CmsText f="heading" as="h1" className="am-h1-page" /> : null}
        <CmsRichText f="body" className="am-richtext am-legal-prose" />
      </div>
    </div>
  );
}

/**
 * Respaldo universal (GenericSection): cualquier bloque nuevo creado desde /portal o Art AI
 * renderiza automáticamente sus textos, imágenes, enlaces y listas con primitivas editables.
 */
export function GenericSection({ section: s }: CmsBlockProps) {
  const data = s.data || {};

  return (
    <div className="am-section-pad">
      <div className="am-container">
        {data.headline ? <CmsText f="headline" as="h2" className="am-h2" /> : null}
        {data.heading ? <CmsText f="heading" as="h2" className="am-h2" /> : null}
        {data.subheadline ? <CmsText f="subheadline" as="p" className="am-lead" /> : null}
        {data.intro ? <CmsText f="intro" as="p" className="am-lead" /> : null}
        {data.body ? <CmsRichText f="body" className="am-richtext am-body-text" /> : null}
        {data.image ? (
          <div className="am-generic-media">
            <CmsImage f="image" className="am-split-img" width={960} height={640} />
          </div>
        ) : null}
        <div className="am-cta-actions">
          {data.primaryCta ? <CmsLink f="primaryCta" className="am-btn am-btn-primary" /> : null}
          {data.secondaryCta ? <CmsLink f="secondaryCta" className="am-btn am-btn-outline" /> : null}
          {data.cta ? <CmsLink f="cta" className="am-btn am-btn-primary" /> : null}
        </div>
        {Array.isArray(data.items) && data.items.length > 0 ? (
          <div className="am-features-row am-mt-lg">
            <CmsList
              f="items"
              wrap={false}
              renderItem={(it, i, h) => (
                <article key={i} {...h.attrs} className="am-feature-item">
                  {it?.image ? <CmsImage f="image" className="am-alt-img" width={480} height={360} /> : null}
                  {it?.title ? <CmsText f="title" as="h3" className="am-h3" /> : null}
                  {it?.question ? <CmsText f="question" as="h3" className="am-h3" /> : null}
                  {it?.body ? <CmsText f="body" as="p" className="am-body-text" /> : null}
                  {it?.answer ? <CmsRichText f="answer" className="am-richtext am-body-text" /> : null}
                  {it?.link ? <CmsLink f="link" className="am-inline-cta" /> : null}
                  {h.toolbar}
                </article>
              )}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
