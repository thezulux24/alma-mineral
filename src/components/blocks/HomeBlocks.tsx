'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  CreditCard,
  Droplets,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { mediaUrl } from '@latinovation/cms-client';
import {
  CmsImage,
  CmsItem,
  CmsItemText,
  CmsLink,
  CmsList,
  CmsText,
  useCart,
  useCms,
  useMoney,
  useProducts,
  type CmsBlockProps,
} from '@latinovation/cms-client/react';
import { useStoreUi } from '../StoreUiContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* 1. HERO — Luxury D2C Split Showcase (100 % Above-the-Fold Conversion)      */
/* -------------------------------------------------------------------------- */

export function HeroEscenario({ section: s }: CmsBlockProps) {
  const { cmsUrl } = useCms();
  const products = useProducts({ collection: 'productos' });
  const cart = useCart();
  const money = useMoney();
  const { openCart, notify, triggerBagPulse } = useStoreUi();

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides: Array<Record<string, any>> = Array.isArray(s.data.stageSlides) ? s.data.stageSlides : [];
  const slideCount = slides.length;

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
      }, 5400);
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

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.am-hero-stagger', {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.06,
        clearProps: 'transform,opacity',
      }).from(
        '.am-stage-card-frame',
        {
          scale: 0.98,
          opacity: 0,
          duration: 0.8,
          clearProps: 'transform,opacity',
        },
        0.08,
      );
    },
    { scope: containerRef },
  );

  const activeProduct = products[selectedIdx] || products[0] || null;
  const activePrice = Number(activeProduct?.price || 37000);
  const activeCompare = Number(activeProduct?.compareAtPrice || 0);

  const handleSelectOption = (idx: number) => {
    setSelectedIdx(idx);
    if (slideCount > 1) {
      setActiveSlide(idx % slideCount);
    }
  };

  const handleQuickAdd = () => {
    if (!activeProduct) return;
    cart.add(
      {
        productId: activeProduct.slug || activeProduct.id,
        title: String(activeProduct.title || 'Desodorante Natural Alma Mineral'),
        unitPrice: activePrice,
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
    <div ref={containerRef} className="am-hero-wrap">
      <div className="am-container am-hero-grid">
        {/* Left Column: High-Converting Luxury Buy Sheet */}
        <div className="am-hero-copy-col">
          <div className="am-hero-top-block am-hero-stagger">
            <CmsText f="headline" as="h1" className="am-hero-h1" />

            <div className="am-hero-proof-row">
              <span className="am-stars-gold" aria-label="Calificación 4.9 de 5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={14} fill="currentColor" />
                ))}
              </span>
              <strong className="am-tabular">4.9/5</strong>
              <span className="am-proof-sep">·</span>
              <span>Botica natural colombiana</span>
              <span className="am-proof-sep">·</span>
              <span className="am-ritual-code-hint">Código ALMAMINERAL10 (-10 %)</span>
            </div>

            <CmsText f="subheadline" as="p" className="am-hero-lead" />
          </div>

          {/* Clean Beauty Pillars */}
          <div className="am-hero-pillars am-hero-stagger" aria-label="Beneficios clave">
            <div className="am-pillar-chip">
              <ShieldCheck size={15} />
              <span>24 h cero mal olor</span>
            </div>
            <div className="am-pillar-chip">
              <Droplets size={15} />
              <span>0 % aluminio sintético</span>
            </div>
            <div className="am-pillar-chip">
              <Sparkles size={15} />
              <span>No mancha tu ropa</span>
            </div>
            <div className="am-pillar-chip">
              <Leaf size={15} />
              <span>Calma y unifica el tono</span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="am-ritual-picker am-hero-stagger">
              <CmsText f="ritualLabel" as="p" className="am-ritual-picker-label" />

              <div className="am-ritual-options" role="radiogroup" aria-label="Presentaciones disponibles">
                {products.slice(0, 3).map((prod, idx) => {
                  const selected = idx === selectedIdx;
                  const price = Number(prod.price || 37000);
                  const compare = Number(prod.compareAtPrice || 0);
                  const units = Number(prod.unitsCount || idx + 1);
                  const perUnit = Math.round(price / Math.max(1, units));
                  const thumb = prod.imageUrl ? mediaUrl(String(prod.imageUrl), cmsUrl) : '';

                  return (
                    <CmsItem key={prod.id} collection="productos" item={prod}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => handleSelectOption(idx)}
                        className={`am-ritual-option ${selected ? 'is-selected' : ''} ${units === 3 ? 'is-best-value' : ''}`}
                      >
                        <div className="am-ritual-opt-left">
                          <span className="am-ritual-radio" aria-hidden="true" />
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              width={38}
                              height={44}
                              className="am-ritual-thumb"
                              loading="eager"
                            />
                          ) : null}
                          <div className="am-ritual-opt-text">
                            <div className="am-ritual-opt-title-row">
                              <CmsItemText f="title" as="strong" className="am-ritual-opt-title" />
                              {prod.badge ? (
                                <CmsItemText
                                  f="badge"
                                  as="span"
                                  className={`am-ritual-opt-badge ${units === 3 ? 'is-gold' : ''}`}
                                />
                              ) : null}
                            </div>
                            <span className="am-ritual-opt-unit am-tabular">
                              {units > 1 ? `${money(perUnit)} por frasco · ${units} unidades` : '1 frasco spray en vidrio ámbar'}
                            </span>
                          </div>
                        </div>

                        <div className="am-ritual-opt-prices am-tabular">
                          <strong className="am-ritual-price-main">{money(price)}</strong>
                          {compare > price ? <s className="am-ritual-price-old">{money(compare)}</s> : null}
                        </div>
                      </button>
                    </CmsItem>
                  );
                })}
              </div>

              <div className="am-stage-cta-stack">
                <button type="button" onClick={handleQuickAdd} className="am-btn am-btn-primary am-btn-xl am-w-full">
                  <ShoppingBag size={18} />
                  <CmsText f="buyButtonLabel" as="span" fallback="Agregar al ritual" />
                  <span className="am-cta-divider">·</span>
                  <span className="am-tabular">{money(activePrice)}</span>
                  {activeCompare > activePrice ? (
                    <span className="am-cta-save-tag am-tabular">Ahorras {money(activeCompare - activePrice)}</span>
                  ) : null}
                </button>

                <div className="am-stage-secondary-row">
                  <CmsLink f="primaryCta" className="am-stage-text-link" />
                  {activeProduct?.slug ? (
                    <Link href={`/producto/${activeProduct.slug}`} className="am-stage-text-link">
                      Ver ficha e ingredientes →
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="am-stage-cta-stack am-hero-stagger">
              <CmsLink f="primaryCta" className="am-btn am-btn-primary am-btn-xl" />
            </div>
          )}

          {/* Unclipped Trust & Payment Footer */}
          <div className="am-hero-trust-strip am-hero-stagger">
            <div className="am-trust-strip-item">
              <Truck size={15} />
              <CmsText f="barLeft" as="span" />
            </div>
            <div className="am-trust-strip-item">
              <CreditCard size={15} />
              <CmsText f="barRight" as="span" />
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Framed Gallery Stage */}
        <div className="am-hero-visual-col">
          <div className="am-stage-card-frame">
            <CmsList
              f="stageSlides"
              className="am-stage-slides"
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
                    height={1440}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <figcaption className="am-stage-slide-caption">
                    <Sparkles size={14} />
                    <CmsText f="caption" as="span" />
                  </figcaption>
                  {h.toolbar}
                </figure>
              )}
            />

            {/* Bottom Spec Card inside Stage */}
            <div className="am-stage-floating-card">
              <div className="am-stage-floating-bottle-box">
                <CmsImage
                  f="bottleCutout"
                  className="am-stage-floating-bottle-img"
                  width={120}
                  height={180}
                  loading="eager"
                />
              </div>
              <div className="am-stage-floating-meta">
                <strong>Fórmula Magistral en Vidrio Ámbar</strong>
                <span>Piedra de Alumbre · Neem · Romero · Menta · Vitamina E</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. CLINICAL BIO-VISUALIZER — Poro Libre vs. Conducto Obstruido             */
/* -------------------------------------------------------------------------- */

export function CienciaPoro(_props: CmsBlockProps) {
  const [mode, setMode] = useState<'alum' | 'synth'>('alum');
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('.am-pore-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 86%',
          once: true,
        },
      });

      gsap.to('.am-crystal-node', {
        y: -5,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
        ease: 'sine.inOut',
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (!svgRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isAlum = mode === 'alum';
      gsap.to('.am-pore-plug', {
        scaleY: isAlum ? 0 : 1,
        opacity: isAlum ? 0 : 0.95,
        transformOrigin: '50% 0%',
        duration: 0.55,
        ease: 'expo.out',
      });
      gsap.to('.am-pore-flow', {
        opacity: isAlum ? 1 : 0.12,
        y: isAlum ? -8 : 10,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
      });
      gsap.to('.am-alum-crystals', {
        opacity: isAlum ? 1 : 0.15,
        scale: isAlum ? 1 : 0.88,
        transformOrigin: '50% 50%',
        duration: 0.55,
        ease: 'expo.out',
      });
    },
    { dependencies: [mode], scope: svgRef },
  );

  return (
    <div ref={sectionRef} className="am-section-pad am-pore-section">
      <div className="am-container">
        <div className="am-pore-top-bar am-pore-reveal">
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
              <Sparkles size={16} />
              <CmsText f="alumTabLabel" as="span" />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'synth'}
              onClick={() => setMode('synth')}
              className={`am-pore-tab am-pore-tab-synth ${mode === 'synth' ? 'is-active' : ''}`}
            >
              <AlertCircle size={16} />
              <CmsText f="synthTabLabel" as="span" />
            </button>
          </div>
        </div>

        <div className="am-pore-stage am-pore-reveal">
          {/* Bio-Optical Dermal Cross-Section Stage */}
          <div className="am-pore-diagram-card">
            <div className="am-pore-diagram-head">
              <div className={`am-pore-diagram-badge ${mode === 'synth' ? 'is-warn' : ''}`}>
                <span className="am-live-indicator" />
                <span className={mode === 'alum' ? undefined : 'am-sr-only'}>
                  <CmsText f="alumMoleculeLabel" as="span" />
                </span>
                <span className={mode === 'synth' ? undefined : 'am-sr-only'}>
                  <CmsText f="synthMoleculeLabel" as="span" />
                </span>
              </div>
              <span className="am-pore-scale-tag">Corte epidérmico</span>
            </div>

            <svg
              ref={svgRef}
              viewBox="0 0 520 340"
              className="am-pore-svg"
              role="img"
              aria-label="Visualizador anatómico comparativo del poro axilar"
            >
              <defs>
                <linearGradient id="amBgGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#162D1F" />
                  <stop offset="100%" stopColor="#0D1A12" />
                </linearGradient>
                <linearGradient id="amEpidermis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A4233" />
                  <stop offset="100%" stopColor="#1E3125" />
                </linearGradient>
                <linearGradient id="amDermis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#19291F" />
                  <stop offset="100%" stopColor="#101C15" />
                </linearGradient>
                <linearGradient id="amGoldCrystal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F2D794" />
                  <stop offset="50%" stopColor="#C8A252" />
                  <stop offset="100%" stopColor="#8F6B24" />
                </linearGradient>
                <linearGradient id="amPlugGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C95B4B" />
                  <stop offset="100%" stopColor="#6E231A" />
                </linearGradient>
                <radialGradient id="amMistOrb" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9AF0C0" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#389E67" stopOpacity="0.15" />
                </radialGradient>
              </defs>

              <rect width="520" height="340" rx="18" fill="url(#amBgGlow)" />

              <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                <line x1="0" y1="68" x2="520" y2="68" />
                <line x1="0" y1="136" x2="520" y2="136" />
                <line x1="130" y1="0" x2="130" y2="340" />
                <line x1="390" y1="0" x2="390" y2="340" />
              </g>

              <path d="M0 132 Q110 128 212 136 L212 212 L0 212 Z" fill="url(#amEpidermis)" />
              <path d="M308 136 Q410 128 520 132 L520 212 L308 212 Z" fill="url(#amEpidermis)" />
              <rect x="0" y="212" width="520" height="128" fill="url(#amDermis)" />

              <path d="M0 132 Q110 128 212 136" fill="none" stroke="#C8A252" strokeWidth="2.5" strokeOpacity="0.8" />
              <path d="M308 136 Q410 128 520 132" fill="none" stroke="#C8A252" strokeWidth="2.5" strokeOpacity="0.8" />

              <path
                d="M212 136 C226 176, 232 232, 232 276 C232 308, 288 308, 288 276 C288 232, 294 176, 308 136 Z"
                fill="#0B150F"
                stroke="rgba(200, 162, 82, 0.42)"
                strokeWidth="1.8"
              />

              <path
                className="am-pore-plug"
                d="M210 132 L310 132 L294 236 C284 250, 236 250, 226 236 Z"
                fill="url(#amPlugGrad)"
                style={{ opacity: mode === 'synth' ? 0.95 : 0 }}
              />

              <g className="am-pore-flow">
                <circle cx="260" cy="272" r="9" fill="url(#amMistOrb)" />
                <circle cx="250" cy="224" r="7.5" fill="url(#amMistOrb)" />
                <circle cx="270" cy="182" r="8" fill="url(#amMistOrb)" />
                <circle cx="260" cy="96" r="10" fill="url(#amMistOrb)" />
                <path
                  d="M260 122 L260 54 M251 64 L260 53 L269 64"
                  stroke="#8EE8B5"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              <g className="am-alum-crystals">
                <g className="am-crystal-node">
                  <polygon points="116,104 134,82 154,98 146,120 122,120" fill="url(#amGoldCrystal)" stroke="#FFF3D1" strokeWidth="1.2" />
                </g>
                <g className="am-crystal-node">
                  <polygon points="166,108 182,90 198,105 190,123 172,123" fill="url(#amGoldCrystal)" stroke="#FFF3D1" strokeWidth="1.2" />
                </g>
                <g className="am-crystal-node">
                  <polygon points="322,108 338,90 354,105 346,123 328,123" fill="url(#amGoldCrystal)" stroke="#FFF3D1" strokeWidth="1.2" />
                </g>
                <g className="am-crystal-node">
                  <polygon points="366,104 384,82 404,98 396,120 372,120" fill="url(#amGoldCrystal)" stroke="#FFF3D1" strokeWidth="1.2" />
                </g>
              </g>

              <text x="24" y="52" fill="rgba(250,248,245,0.82)" fontSize="13.5" fontWeight="500">
                Superficie antibacteriana
              </text>
              <text x="24" y="168" fill="#E8E3D9" fontSize="13.5" fontWeight="600">
                Epidermis intacta
              </text>
              <text x="24" y="246" fill="rgba(232,227,217,0.78)" fontSize="13.5">
                Dermis y glándula sudorípara libre
              </text>
            </svg>

            <CmsText f="diagramCaption" as="p" className="am-pore-caption" />
          </div>

          {/* Right Clinical Comparison Cards */}
          <div className="am-pore-columns">
            <article
              onClick={() => setMode('alum')}
              className={`am-pore-card am-pore-card-alum ${mode === 'alum' ? 'is-focused' : ''}`}
            >
              <div className="am-pore-card-head">
                <CmsText f="alumTitle" as="h3" className="am-h3" />
                <span className="am-pore-pill-good">
                  <CheckCircle2 size={15} />
                  Alma Mineral
                </span>
              </div>
              <CmsText f="alumSummary" as="p" className="am-body-text" />
              <CmsList
                f="alumPoints"
                as="ul"
                className="am-check-list"
                renderItem={(_it, i, h) => (
                  <li key={i} {...h.attrs}>
                    <Check size={17} className="am-check-icon" />
                    <CmsText f="text" as="span" />
                    {h.toolbar}
                  </li>
                )}
              />
            </article>

            <article
              onClick={() => setMode('synth')}
              className={`am-pore-card am-pore-card-synth ${mode === 'synth' ? 'is-focused' : ''}`}
            >
              <div className="am-pore-card-head">
                <CmsText f="synthTitle" as="h3" className="am-h3" />
                <span className="am-pore-pill-warn">
                  <AlertCircle size={15} />
                  Comercial
                </span>
              </div>
              <CmsText f="synthSummary" as="p" className="am-body-text" />
              <CmsList
                f="synthPoints"
                as="ul"
                className="am-dot-list"
                renderItem={(_it, i, h) => (
                  <li key={i} {...h.attrs}>
                    <span className="am-dot-warn" aria-hidden="true" />
                    <CmsText f="text" as="span" />
                    {h.toolbar}
                  </li>
                )}
              />
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
/* 3. HERBARIO MINERAL — Architectural 2×2 Botanical Bento Atelier            */
/* -------------------------------------------------------------------------- */

export function HerbarioMineral({ section: s }: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapters: Array<any> = Array.isArray(s.data.chapters) ? s.data.chapters : [];

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('.am-herb-top-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 86%',
          once: true,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>('.am-herb-chapter', rootRef.current);
      if (cards.length) {
        gsap.from(cards, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.am-herb-bento',
            start: 'top 88%',
            once: true,
          },
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-herb-field">
      <div className="am-container">
        <div className="am-herb-hero-bar">
          <div className="am-herb-intro am-herb-top-reveal">
            <CmsText f="heading" as="h2" className="am-herb-display" />
            <CmsText f="lead" as="p" className="am-herb-lead" />
          </div>

          <div className="am-herb-pedestal-card am-herb-top-reveal">
            <div className="am-herb-pedestal-img-wrap">
              <CmsImage f="pinnedBottle" className="am-herb-bottle" width={200} height={320} />
            </div>
            <div className="am-herb-pedestal-info">
              <span className="am-herb-pedestal-eyebrow">Fórmula botánica limpia</span>
              <strong>0 % Clorhidrato · 0 % Parabenos · 0 % Alcohol irritante</strong>
              {chapters.length > 0 ? (
                <div className="am-herb-pills-nav" role="tablist" aria-label="Activos principales">
                  {chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={activeChapter === idx}
                      onClick={() => setActiveChapter(idx)}
                      className={`am-herb-mini-pill ${activeChapter === idx ? 'is-active' : ''}`}
                    >
                      {String(ch?.title || '').split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* True 2x2 Bento Grid directly on CmsList */}
        <CmsList
          f="chapters"
          className="am-herb-bento"
          renderItem={(_ch, i, h) => (
            <article
              key={i}
              {...h.attrs}
              onMouseEnter={() => setActiveChapter(i)}
              className={`am-herb-chapter ${activeChapter === i ? 'is-highlighted' : ''}`}
            >
              <div className="am-herb-photo-wrap">
                <CmsImage f="image" className="am-herb-photo" width={680} height={460} />
              </div>

              <div className="am-herb-card-content">
                <div className="am-herb-chapter-head">
                  <CmsText f="title" as="h3" className="am-herb-title" />
                  <CmsText f="role" as="p" className="am-herb-role" />
                </div>

                <CmsList
                  f="notes"
                  as="ul"
                  className="am-herb-notes"
                  renderItem={(_note, j, nh) => (
                    <li key={j} {...nh.attrs}>
                      <Check size={15} className="am-herb-check" />
                      <CmsText f="line" as="span" />
                      {nh.toolbar}
                    </li>
                  )}
                />
              </div>
              {h.toolbar}
            </article>
          )}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. GALERÍA RITUAL — Editorial Horizontal Filmstrip with Tactile Controls   */
/* -------------------------------------------------------------------------- */

export function GaleriaRitual({ section: s }: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frames: Array<any> = Array.isArray(s.data.frames) ? s.data.frames : [];

  const dragState = useRef<{ down: boolean; startX: number; scrollLeft: number }>({
    down: false,
    startX: 0,
    scrollLeft: 0,
  });

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-gallery-module', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 88%',
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  const scrollByStep = (dir: -1 | 1) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

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
    <div ref={rootRef} className="am-gallery-section">
      <div className="am-gallery-head">
        <CmsText f="heading" as="h2" className="am-h2" />

        <div className="am-gallery-controls-row">
          <p className="am-gallery-count am-tabular">
            <span>{frames.length}</span> <CmsText f="countSuffix" as="span" />
          </p>
          <div className="am-gallery-nav-btns" aria-label="Controles de galería">
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              className="am-carousel-btn"
              aria-label="Anterior escena"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              className="am-carousel-btn"
              aria-label="Siguiente escena"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
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
          className="am-gallery-track-inner"
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
/* 5. RESPALDO INTEGRATIVO — Luxury Editorial Magazine Spread Card            */
/* -------------------------------------------------------------------------- */

export function RespaldoIntegrativo(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-quote-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 84%',
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-endorsement">
      <div className="am-container">
        <div className="am-endorsement-card">
          <figure className="am-endorsement-portrait am-quote-reveal">
            <CmsImage f="portrait" className="am-endorsement-img" width={760} height={920} />
          </figure>

          <div className="am-endorsement-quote-col am-quote-reveal">
            <blockquote className="am-offset-quote">
              <CmsText f="quote" as="p" />
            </blockquote>

            <div className="am-endorsement-badge">
              <Award size={16} />
              <span>Criterio en salud integrativa</span>
            </div>

            <div className="am-quote-footer-row">
              <div className="am-quote-attribution">
                <CmsText f="authorName" as="strong" className="am-quote-author" />
                <CmsText f="authorRole" as="span" className="am-quote-role" />
              </div>

              <div className="am-endorsement-mini-product">
                <figure className="am-endorsement-detail">
                  <CmsImage f="detailImage" className="am-endorsement-detail-img" width={140} height={140} />
                </figure>
                <div className="am-endorsement-mini-copy">
                  <strong>Fórmula limpia</strong>
                  <span>Uso diario en piel sensible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. CIERRE BOTICA — Architectural Split Banner (Zero Overlapping Copy)      */
/* -------------------------------------------------------------------------- */

export function CierreBotica(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-closing-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 86%',
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-closing-wrap">
      <div className="am-container">
        <div className="am-closing-card">
          <div className="am-closing-copy-panel">
            <CmsText f="heading" as="h2" className="am-closing-title am-closing-reveal" />
            <CmsText f="body" as="p" className="am-closing-body am-closing-reveal" />

            <div className="am-closing-perks am-closing-reveal">
              <span>
                <CheckCircle2 size={15} /> Envío nacional $5.000 COP
              </span>
              <span>
                <CheckCircle2 size={15} /> Gratis desde $95.000 COP
              </span>
              <span>
                <CheckCircle2 size={15} /> Wompi y Contraentrega
              </span>
            </div>

            <div className="am-closing-cta-row am-closing-reveal">
              <CmsLink f="cta" className="am-btn am-btn-gold am-btn-xl" />
            </div>
          </div>

          <div className="am-closing-media-panel">
            <CmsImage f="image" className="am-closing-img" width={1100} height={900} />
          </div>
        </div>
      </div>
    </div>
  );
}
