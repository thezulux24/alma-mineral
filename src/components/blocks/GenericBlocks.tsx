'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Check, ChevronDown, Leaf, MessageCircle, Shield, Sparkles, Truck } from 'lucide-react';
import {
  CmsImage,
  CmsLink,
  CmsList,
  CmsRichText,
  CmsText,
  type CmsBlockProps,
} from '@latinovation/cms-client/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const rootRef = useRef<HTMLDivElement>(null);
  const isLeft = s.data.imageSide === 'left';

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(rootRef.current.children, {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: rootRef.current, start: 'top 86%', once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div className="am-section-pad">
      <div ref={rootRef} className={`am-container am-split-content ${isLeft ? 'is-img-left' : ''}`}>
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
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rows = gsap.utils.toArray<HTMLElement>('.am-alt-row', rootRef.current);
      rows.forEach((row) => {
        gsap.from(row, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: row, start: 'top 86%', once: true },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-surface-band">
      <div className="am-container">
        <CmsText f="heading" as="h2" className="am-h2 am-mb-xl" />
        <CmsList
          f="items"
          className="am-alt-rows"
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
  );
}

export function FeaturesGridBlock(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-feature-item', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-surface-band">
      <div className="am-container">
        <div className="am-section-head">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />
        </div>
        <CmsList
          f="items"
          className="am-features-row"
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
  );
}

export function StepsProcessBlock(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-step-card', {
        y: 22,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad">
      <div className="am-container">
        <div className="am-section-head">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />
        </div>
        <CmsList
          f="items"
          as="ol"
          className="am-steps-list"
          renderItem={(_item, i, h) => (
            <li key={i} {...h.attrs} className="am-step-card">
              <CmsText f="title" as="h3" className="am-h3" />
              <CmsText f="body" as="p" className="am-body-text" />
              {h.toolbar}
            </li>
          )}
        />
      </div>
    </div>
  );
}

export function FaqAccordionBlock(_props: CmsBlockProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-faq-item', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: rootRef.current, start: 'top 88%', once: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-faq-section">
      <div className="am-container am-faq-layout">
        <div className="am-faq-intro-col">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />

          <div className="am-faq-help-card">
            <div className="am-faq-help-head">
              <Sparkles size={17} />
              <strong>¿Cambias desde un antitranspirante comercial?</strong>
            </div>
            <p>
              Durante los primeros días tus poros liberan residuos acumulados. Aplica 3 a 4 atomizaciones sobre piel
              limpia y seca para protección mineral continua.
            </p>
            <Link href="/contacto" className="am-inline-cta">
              <MessageCircle size={15} /> Hablar con asesoría de la botica →
            </Link>
          </div>
        </div>

        <CmsList
          f="items"
          className="am-faq-list"
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
                  <span className="am-faq-chevron-box">
                    <ChevronDown size={18} className="am-faq-chevron" />
                  </span>
                </button>
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
            <CmsLink f="primaryCta" className={inverse ? 'am-btn am-btn-gold' : 'am-btn am-btn-primary'} />
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
          <CmsList
            f="items"
            className="am-features-row am-mt-lg"
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
        ) : null}
      </div>
    </div>
  );
}
