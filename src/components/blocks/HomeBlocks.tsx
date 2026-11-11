'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Check, ShoppingBag } from 'lucide-react';
import {
  CmsImage,
  CmsItem,
  CmsItemText,
  CmsLink,
  CmsList,
  CmsText,
  useCart,
  useMoney,
  useProducts,
  type CmsBlockProps,
} from '@latinovation/cms-client/react';
import { useStoreUi } from '../StoreUiContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* 1. HERO — The Split Stage (carta de botica + escenario fijo con crossfade) */
/* -------------------------------------------------------------------------- */

export function HeroEscenario({ section: s }: CmsBlockProps) {
  const products = useProducts({ collection: 'productos' });
  const cart = useCart();
  const money = useMoney();
  const { openCart, notify, triggerBagPulse } = useStoreUi();

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: Array<Record<string, any>> = Array.isArray(s.data.stageSlides) ? s.data.stageSlides : [];
  const slideCount = slides.length;

  // Slow atmospheric crossfade (1.6s transition, ~5.5s hold), paused on hidden tab & disabled under prefers-reduced-motion
  useEffect(() => {
    if (slideCount <= 1 || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (!document.hidden) {
          setActiveSlide((prev) => (prev + 1) % slideCount);
        }
      }, 5600);
    };
    const onVis = () => {
      if (document.hidden && timer) {
        clearInterval(timer);
        timer = null;
      } else if (!document.hidden && !timer) {
        start();
      }
    };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [slideCount]);

  // GSAP entrance & subtle optical bottle parallax on scroll
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('.am-hero-stagger', {
        y: 22,
        opacity: 0,
        duration: 0.78,
        stagger: 0.09,
        ease: 'power3.out',
      });

      const bottle = containerRef.current?.querySelector('.am-hero-floating-bottle');
      if (bottle) {
        gsap.to(bottle, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }
    },
    { scope: containerRef },
  );

  const activeProduct = products[selectedIdx] || products[0] || null;

  const handleQuickAdd = () => {
    if (!activeProduct) return;
    cart.add(
      {
        productId: activeProduct.slug || activeProduct.id,
        title: String(activeProduct.title || 'Desodorante Natural Alma Mineral'),
        unitPrice: Number(activeProduct.price || 37000),
        imageUrl: String(activeProduct.imageUrl || ''),
        sku: String(activeProduct.sku || ''),
      },
      1,
    );
    triggerBagPulse();
    notify(`${activeProduct.title} agregado a tu bolsa`);
    openCart();
  };

  return (
    <div ref={containerRef} className="am-split-stage">
      {/* Left panel: Apothecary Menu Sheet */}
      <div className="am-stage-sheet">
        <div className="am-stage-sheet-center">
          <CmsText f="headline" as="h1" className="am-stage-h1 am-hero-stagger" />
          <CmsText f="subheadline" as="p" className="am-stage-lead am-hero-stagger" />

          {products.length > 0 ? (
            <div className="am-ritual-picker am-hero-stagger">
              <CmsText f="ritualLabel" as="p" className="am-ritual-picker-label" />
              <div className="am-ritual-options" role="radiogroup" aria-label="Presentaciones disponibles">
                {products.slice(0, 3).map((prod, idx) => {
                  const selected = idx === selectedIdx;
                  const price = Number(prod.price || 37000);
                  const compare = Number(prod.compareAtPrice || 0);
                  return (
                    <CmsItem key={prod.id} collection="productos" item={prod}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSelectedIdx(idx)}
                        className={`am-ritual-option ${selected ? 'is-selected' : ''}`}
                      >
                        <div className="am-ritual-opt-left">
                          <span className="am-ritual-radio" aria-hidden="true" />
                          <div>
                            <CmsItemText f="title" as="strong" className="am-ritual-opt-title" />
                            {prod.badge ? <CmsItemText f="badge" as="span" className="am-ritual-opt-badge" /> : null}
                          </div>
                        </div>
                        <div className="am-ritual-opt-prices am-tabular">
                          <strong>{money(price)}</strong>
                          {compare > price ? <s>{money(compare)}</s> : null}
                        </div>
                      </button>
                    </CmsItem>
                  );
                })}
              </div>

              <div className="am-stage-cta-row">
                <button type="button" onClick={handleQuickAdd} className="am-btn am-btn-primary am-btn-lg am-stage-buy">
                  <ShoppingBag size={18} />
                  <CmsText f="buyButtonLabel" as="span" fallback="Agregar al ritual" />
                  {activeProduct ? (
                    <span className="am-stage-buy-price am-tabular">· {money(Number(activeProduct.price || 37000))}</span>
                  ) : null}
                </button>
                <CmsLink f="primaryCta" className="am-stage-text-link" />
              </div>
            </div>
          ) : (
            <div className="am-stage-cta-row am-hero-stagger">
              <CmsLink f="primaryCta" className="am-btn am-btn-primary am-btn-lg" />
            </div>
          )}
        </div>

        <div className="am-stage-sheet-foot" aria-hidden="true" />
      </div>

      {/* Right panel: Sticky Full-Height Optical Stage */}
      <div className="am-stage-visual">
        <div className="am-stage-sticky-frame">
          <div className="am-stage-slides">
            <CmsList
              f="stageSlides"
              wrap={false}
              renderItem={(_item, i, h) => (
                <figure
                  key={i}
                  {...h.attrs}
                  className={`am-stage-slide ${i === activeSlide ? 'is-active' : ''}`}
                >
                  <CmsImage
                    f="image"
                    className="am-stage-slide-img"
                    width={1200}
                    height={1500}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <figcaption className="am-stage-slide-caption">
                    <CmsText f="caption" as="span" />
                  </figcaption>
                  {h.toolbar}
                </figure>
              )}
            />
          </div>

          <div className="am-hero-floating-bottle">
            <CmsImage
              f="bottleCutout"
              className="am-hero-bottle-img"
              width={420}
              height={700}
              loading="eager"
            />
          </div>

          {slideCount > 1 ? (
            <div className="am-stage-dots" role="tablist" aria-label="Escenas de la botica">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activeSlide}
                  aria-label={`Escena ${i + 1}`}
                  onClick={() => setActiveSlide(i)}
                  className={`am-stage-dot ${i === activeSlide ? 'is-active' : ''}`}
                />
              ))}
            </div>
          ) : null}

          <div className="am-stage-bottom-bar">
            <CmsText f="barLeft" as="span" className="am-stage-bar-item" />
            <CmsText f="barRight" as="span" className="am-stage-bar-item am-stage-bar-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. ONE LIVE THING — Comparador Molecular en Vivo del Poro Axilar           */
/* -------------------------------------------------------------------------- */

export function CienciaPoro(_props: CmsBlockProps) {
  const [mode, setMode] = useState<'alum' | 'synth'>('alum');
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!svgRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isAlum = mode === 'alum';
      gsap.to('.am-pore-plug', {
        scaleY: isAlum ? 0 : 1,
        opacity: isAlum ? 0 : 0.92,
        transformOrigin: '50% 0%',
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to('.am-pore-flow', {
        opacity: isAlum ? 1 : 0.14,
        y: isAlum ? -6 : 8,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power2.out',
      });
      gsap.to('.am-alum-crystals', {
        opacity: isAlum ? 1 : 0.15,
        scale: isAlum ? 1 : 0.85,
        transformOrigin: '50% 50%',
        duration: 0.5,
        ease: 'power3.out',
      });
    },
    { dependencies: [mode], scope: svgRef },
  );

  return (
    <div className="am-section-pad am-pore-section">
      <div className="am-container">
        <div className="am-pore-header">
          <CmsText f="heading" as="h2" className="am-h2" />
          <CmsText f="intro" as="p" className="am-lead" />
        </div>

        <div className="am-pore-controls" role="tablist" aria-label="Mecanismo en la piel">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'alum'}
            onClick={() => setMode('alum')}
            className={`am-pore-tab ${mode === 'alum' ? 'is-active' : ''}`}
          >
            <CmsText f="alumTabLabel" as="span" />
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'synth'}
            onClick={() => setMode('synth')}
            className={`am-pore-tab am-pore-tab-synth ${mode === 'synth' ? 'is-active' : ''}`}
          >
            <CmsText f="synthTabLabel" as="span" />
          </button>
        </div>

        <div className="am-pore-stage">
          {/* Interactive SVG Cross-Section of Epidermis & Sweat Duct */}
          <div className="am-pore-diagram-card">
            <div className="am-pore-diagram-badge">
              <span className={mode === 'alum' ? undefined : 'am-sr-only'}>
                <CmsText f="alumMoleculeLabel" as="span" />
              </span>
              <span className={mode === 'synth' ? undefined : 'am-sr-only'}>
                <CmsText f="synthMoleculeLabel" as="span" />
              </span>
            </div>

            <svg
              ref={svgRef}
              viewBox="0 0 460 320"
              className="am-pore-svg"
              role="img"
              aria-label="Corte anatómico esquemático del poro axilar"
            >
              {/* Warm skin layers */}
              <rect x="0" y="108" width="460" height="72" fill="#E3D7C3" />
              <rect x="0" y="180" width="460" height="140" fill="#D5C6AE" />
              <line x1="0" y1="108" x2="188" y2="108" stroke="#8A6A26" strokeWidth="2.5" />
              <line x1="272" y1="108" x2="460" y2="108" stroke="#8A6A26" strokeWidth="2.5" />

              {/* Open Sweat Duct Channel */}
              <path
                d="M188 108 C202 145, 206 205, 206 252 C206 278, 254 278, 254 252 C254 205, 258 145, 272 108 Z"
                fill="#F6F2EA"
                stroke="#6B3612"
                strokeWidth="2"
              />

              {/* Synthetic aluminum plug (scales in only when mode === 'synth') */}
              <path
                className="am-pore-plug"
                d="M190 106 L270 106 L258 198 L202 198 Z"
                fill="#7A3429"
                style={{ opacity: mode === 'synth' ? 0.92 : 0 }}
              />

              {/* Natural thermoregulation droplets rising cleanly in 'alum' mode */}
              <g className="am-pore-flow">
                <circle cx="230" cy="238" r="6" fill="#3B6E4C" />
                <circle cx="222" cy="196" r="5" fill="#3B6E4C" />
                <circle cx="238" cy="158" r="5.5" fill="#3B6E4C" />
                <path d="M230 92 L230 56 M222 65 L230 55 L238 65" stroke="#1F381E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>

              {/* Large Potassium Alum mineral crystals resting strictly on surface */}
              <g className="am-alum-crystals">
                <polygon points="118,86 134,68 152,82 144,102 122,102" fill="#CFA958" stroke="#1F381E" strokeWidth="2" />
                <polygon points="158,90 172,74 186,88 178,104 162,104" fill="#E6C97A" stroke="#1F381E" strokeWidth="2" />
                <polygon points="278,90 294,74 310,88 302,104 282,104" fill="#E6C97A" stroke="#1F381E" strokeWidth="2" />
                <polygon points="318,86 336,68 352,84 344,102 322,102" fill="#CFA958" stroke="#1F381E" strokeWidth="2" />
              </g>

              <text x="24" y="136" fill="#231914" fontSize="13" fontWeight="600">
                Epidermis
              </text>
              <text x="24" y="208" fill="#5E4F45" fontSize="13">
                Dermis y glándula sudorípara
              </text>
            </svg>

            <CmsText f="diagramCaption" as="p" className="am-pore-caption" />
          </div>

          {/* Both comparison columns remain in the SSR DOM for 100 % CMS editability & instant side-by-side clarity */}
          <div className="am-pore-columns">
            <article
              onClick={() => setMode('alum')}
              className={`am-pore-card am-pore-card-alum ${mode === 'alum' ? 'is-focused' : ''}`}
            >
              <CmsText f="alumTitle" as="h3" className="am-h3" />
              <CmsText f="alumSummary" as="p" className="am-body-text" />
              <ul className="am-check-list">
                <CmsList
                  f="alumPoints"
                  wrap={false}
                  renderItem={(_it, i, h) => (
                    <li key={i} {...h.attrs}>
                      <Check size={17} className="am-check-icon" />
                      <CmsText f="text" as="span" />
                      {h.toolbar}
                    </li>
                  )}
                />
              </ul>
            </article>

            <article
              onClick={() => setMode('synth')}
              className={`am-pore-card am-pore-card-synth ${mode === 'synth' ? 'is-focused' : ''}`}
            >
              <CmsText f="synthTitle" as="h3" className="am-h3" />
              <CmsText f="synthSummary" as="p" className="am-body-text" />
              <ul className="am-dot-list">
                <CmsList
                  f="synthPoints"
                  wrap={false}
                  renderItem={(_it, i, h) => (
                    <li key={i} {...h.attrs}>
                      <span className="am-dot-warn" aria-hidden="true" />
                      <CmsText f="text" as="span" />
                      {h.toolbar}
                    </li>
                  )}
                />
              </ul>
            </article>

            <div className="am-pore-cta-wrap">
              <CmsLink f="cta" className="am-inline-cta" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. HERBARIO MINERAL — Pinned Heading, Passing Botanical Rows               */
/* -------------------------------------------------------------------------- */

export function HerbarioMineral({ section: s }: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapters: Array<any> = Array.isArray(s.data.chapters) ? s.data.chapters : [];

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      const cards = gsap.utils.toArray<HTMLElement>('.am-herb-chapter', rootRef.current);
      cards.forEach((card, idx) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveChapter(idx),
          onEnterBack: () => setActiveChapter(idx),
        });

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.from(card, {
            y: 32,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              once: true,
            },
          });
        }
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-herb-field">
      <div className="am-container am-herb-grid">
        <div className="am-herb-pinned">
          <CmsText f="heading" as="h2" className="am-herb-display" />
          <CmsText f="lead" as="p" className="am-herb-lead" />

          <div className="am-herb-bottle-stage">
            <CmsImage f="pinnedBottle" className="am-herb-bottle" width={240} height={400} />
            {chapters[activeChapter]?.title ? (
              <div className="am-herb-active-pill">
                <span className="am-herb-active-dot" />
                <span>{chapters[activeChapter].title}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="am-herb-passing">
          <CmsList
            f="chapters"
            wrap={false}
            renderItem={(_ch, i, h) => (
              <article
                key={i}
                {...h.attrs}
                className={`am-herb-chapter ${i % 2 === 1 ? 'is-reversed' : ''}`}
              >
                <div className="am-herb-chapter-head">
                  <CmsText f="title" as="h3" className="am-herb-title" />
                  <CmsText f="role" as="p" className="am-herb-role" />
                </div>

                <div className="am-herb-chapter-body">
                  <div className="am-herb-photo-wrap">
                    <CmsImage f="image" className="am-herb-photo" width={420} height={560} />
                  </div>
                  <ul className="am-herb-notes">
                    <CmsList
                      f="notes"
                      wrap={false}
                      renderItem={(_note, j, nh) => (
                        <li key={j} {...nh.attrs}>
                          <CmsText f="line" as="span" />
                          {nh.toolbar}
                        </li>
                      )}
                    />
                  </ul>
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

/* -------------------------------------------------------------------------- */
/* 4. GALERÍA RITUAL — Drag Row of Mixed Modules                              */
/* -------------------------------------------------------------------------- */

export function GaleriaRitual({ section: s }: CmsBlockProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frames: Array<any> = Array.isArray(s.data.frames) ? s.data.frames : [];

  // Pointer drag scrolling on desktop
  const dragState = useRef<{ down: boolean; startX: number; scrollLeft: number }>({
    down: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !trackRef.current) return;
    dragState.current = {
      down: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.down || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX) * 1.25;
  };

  const endDrag = () => {
    dragState.current.down = false;
  };

  return (
    <div className="am-gallery-section">
      <div className="am-gallery-head">
        <CmsText f="heading" as="h2" className="am-h2" />
        <p className="am-gallery-count am-tabular">
          <span>{frames.length}</span> <CmsText f="countSuffix" as="span" />
        </p>
      </div>

      <div
        ref={trackRef}
        className="am-gallery-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <CmsList
          f="frames"
          wrap={false}
          renderItem={(frame, i, h) => (
            <figure
              key={i}
              {...h.attrs}
              className={`am-gallery-module ${frame?.kind === 'wide' ? 'is-wide' : 'is-tall'}`}
            >
              <CmsImage f="image" className="am-gallery-img" width={900} height={1100} />
              <CmsText f="kind" as="span" editable={false} className="am-sr-only" />
              {h.toolbar}
            </figure>
          )}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. RESPALDO INTEGRATIVO — Portrait and Offset Quotation                    */
/* -------------------------------------------------------------------------- */

export function RespaldoIntegrativo(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-quote-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-endorsement">
      <div className="am-container am-endorsement-grid">
        <figure className="am-endorsement-portrait am-quote-reveal">
          <CmsImage f="portrait" className="am-endorsement-img" width={720} height={960} />
        </figure>

        <div className="am-endorsement-quote-col am-quote-reveal">
          <blockquote className="am-offset-quote">
            <CmsText f="quote" as="p" />
          </blockquote>

          <div className="am-quote-attribution">
            <CmsText f="authorName" as="strong" className="am-quote-author" />
            <CmsText f="authorRole" as="span" className="am-quote-role" />
          </div>

          <figure className="am-endorsement-detail">
            <CmsImage f="detailImage" className="am-endorsement-detail-img" width={360} height={360} />
          </figure>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. CIERRE BOTICA — Full-bleed Last Photograph, Text Beside                 */
/* -------------------------------------------------------------------------- */

export function CierreBotica(_props: CmsBlockProps) {
  return (
    <div className="am-closing-bleed">
      <div className="am-closing-media">
        <CmsImage f="image" className="am-closing-img" width={1600} height={1100} />
      </div>
      <div className="am-closing-content">
        <div className="am-closing-box">
          <CmsText f="heading" as="h2" className="am-closing-title" />
          <CmsText f="body" as="p" className="am-closing-body" />
          <CmsLink f="cta" className="am-btn am-btn-paper am-btn-lg" />
        </div>
      </div>
    </div>
  );
}
