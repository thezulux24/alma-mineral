'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { mediaUrl, type CollectionItem } from '@latinovation/cms-client';
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
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Splits text inside an element into masked word chips ONLY on the real visitor
 * storefront (never during SSR and never inside the WebProAI /portal visual editor),
 * returning a cleanup function that restores the exact original HTML.
 */
function splitWordsForMotion(el: HTMLElement | null): {
  chips: HTMLElement[];
  revert: () => void;
} {
  if (!el || typeof window === 'undefined' || window.self !== window.top) {
    return { chips: [], revert: () => {} };
  }
  const originalHtml = el.innerHTML;
  const rawText = (el.textContent || '').trim();
  if (!rawText) {
    return { chips: [], revert: () => {} };
  }
  const tokens = rawText.split(/(\s+)/);
  el.innerHTML = tokens
    .map((tok) => {
      if (/^\s+$/.test(tok)) return tok;
      const safe = tok
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<span class="am-wmask"><span class="am-wchip">${safe}</span></span>`;
    })
    .join('');
  const chips = Array.from(el.querySelectorAll<HTMLElement>('.am-wchip'));
  return {
    chips,
    revert: () => {
      el.innerHTML = originalHtml;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 1. HERO — Pinned 4-Phase Scrollytelling Cinema (Kinetic Type + Bottle)     */
/* -------------------------------------------------------------------------- */

const STAGE_LABELS = ['Apertura', 'Manifiesto', 'Fórmula', 'Ritual'];

export function HeroEscenario({ section: s }: CmsBlockProps) {
  const { cmsUrl } = useCms();
  const products = useProducts({ collection: 'productos' });
  const cart = useCart();
  const money = useMoney();
  const { openCart, notify, triggerBagPulse } = useStoreUi();

  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stInstanceRef = useRef<ScrollTrigger | null>(null);

  const [selectedIdx, setSelectedIdx] = useState(2); // Default highlight on high-value Ritual or fallback to 0
  const [activeSlide, setActiveSlide] = useState(0);
  const [phase, setPhase] = useState(0);

  // Ensure selectedIdx is valid when products load
  const safeIdx = products[selectedIdx] ? selectedIdx : 0;
  const activeProduct = products[safeIdx] || products[0] || null;
  const activePrice = Number(activeProduct?.price || 37000);
  const activeCompare = Number(activeProduct?.compareAtPrice || 0);

  const slides: Array<Record<string, any>> = Array.isArray(s.data.stageSlides) ? s.data.stageSlides : [];
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1 || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!document.hidden) {
        setActiveSlide((prev) => (prev + 1) % slideCount);
      }
    }, 4800);
    return () => clearInterval(id);
  }, [slideCount]);

  useGSAP(
    () => {
      if (!rootRef.current || !pinRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const reverts: Array<() => void> = [];
      const h1El = rootRef.current.querySelector<HTMLElement>('.am-scrolly-h1');
      const m1El = rootRef.current.querySelector<HTMLElement>('.am-mline-1');
      const m2El = rootRef.current.querySelector<HTMLElement>('.am-mline-2');
      const m3El = rootRef.current.querySelector<HTMLElement>('.am-mline-3');

      const sH1 = splitWordsForMotion(h1El);
      const sM1 = splitWordsForMotion(m1El);
      const sM2 = splitWordsForMotion(m2El);
      const sM3 = splitWordsForMotion(m3El);
      reverts.push(sH1.revert, sM1.revert, sM2.revert, sM3.revert);

      // Opening page-load choreography (runs immediately at scroll = 0)
      const introTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      if (sH1.chips.length) {
        introTl.from(sH1.chips, {
          yPercent: 112,
          opacity: 0,
          duration: 0.95,
          stagger: 0.08,
        });
      } else if (h1El) {
        introTl.from(h1El, { y: 28, opacity: 0, duration: 0.8 });
      }
      introTl
        .from(
          '.am-open-fade',
          {
            y: 18,
            opacity: 0,
            duration: 0.75,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '-=0.55',
        )
        .from(
          '.am-bottle-entry',
          {
            y: 54,
            scale: 0.92,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
          },
          '-=0.75',
        );

      const getHeaderHeight = () => {
        const hdr = document.querySelector<HTMLElement>('.am-header-wrap');
        return Math.round(hdr?.getBoundingClientRect().height || 92);
      };

      const mm = gsap.matchMedia();

      // DESKTOP (>= 960px): Full 4-beat pinned cinema (Opening -> Kinetic Manifesto -> Bottle Reveal -> Ritual Atelier)
      mm.add('(min-width: 960px)', () => {
        gsap.set('.am-scrolly-beat-manifesto', { autoAlpha: 0 });
        gsap.set('.am-scrolly-callouts', { autoAlpha: 0 });
        gsap.set('.am-scrolly-backdrop', { autoAlpha: 0, scale: 0.9 });
        gsap.set('.am-scrolly-atelier-panel', { autoAlpha: 0, x: 56 });
        gsap.set('.am-bottle-stage', { yPercent: 38, xPercent: 0, scale: 0.84, opacity: 0.68 });

        if (sM1.chips.length) gsap.set(sM1.chips, { yPercent: 118, opacity: 0 });
        if (sM2.chips.length) gsap.set(sM2.chips, { yPercent: 118, opacity: 0 });
        if (sM3.chips.length) gsap.set(sM3.chips, { yPercent: 118, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: () => `top top+=${getHeaderHeight()}`,
            end: '+=270%',
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              setPhase(p < 0.22 ? 0 : p < 0.54 ? 1 : p < 0.82 ? 2 : 3);
            },
          },
        });

        stInstanceRef.current = tl.scrollTrigger || null;

        // Progress bar scrub
        tl.fromTo(
          '.am-scrolly-progress-fill',
          { scaleY: 0.08 },
          { scaleY: 1, ease: 'none', duration: 3.0 },
          0,
        );

        // BEAT 1 -> BEAT 2 (0.00 -> 1.05): Opening clears, Kinetic Manifesto Words assemble cleanly center-stage
        tl.to(
          '.am-scrolly-beat-open',
          { y: -64, autoAlpha: 0, duration: 0.44, ease: 'power2.inOut' },
          0.02,
        )
          .to(
            '.am-scrolly-scroll-cue',
            { y: 16, autoAlpha: 0, duration: 0.28, ease: 'power2.out' },
            0.0,
          )
          .to(
            '.am-bottle-stage',
            { yPercent: 18, scale: 0.9, opacity: 0.16, duration: 0.55, ease: 'power2.inOut' },
            0.08,
          )
          .to(
            '.am-scrolly-halo',
            { scale: 1.28, opacity: 0.88, duration: 0.85, ease: 'sine.out' },
            0.1,
          )
          .to(
            '.am-scrolly-ring',
            { rotation: 95, scale: 1.04, duration: 0.95, ease: 'none' },
            0.05,
          )
          .set('.am-scrolly-beat-manifesto', { autoAlpha: 1 }, 0.22);

        if (sM1.chips.length) {
          tl.fromTo(
            '.am-mline-1',
            { xPercent: -12 },
            { xPercent: 0, duration: 0.52, ease: 'power3.out' },
            0.24,
          ).to(
            sM1.chips,
            { yPercent: 0, opacity: 1, duration: 0.42, stagger: 0.06, ease: 'power3.out' },
            0.24,
          );
        } else {
          tl.fromTo(
            '.am-mline-1',
            { x: -48, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.48, ease: 'power3.out' },
            0.24,
          );
        }

        if (sM2.chips.length) {
          tl.fromTo(
            '.am-mline-2',
            { xPercent: 12 },
            { xPercent: 0, duration: 0.54, ease: 'power3.out' },
            0.42,
          ).to(
            sM2.chips,
            { yPercent: 0, opacity: 1, duration: 0.44, stagger: 0.06, ease: 'power3.out' },
            0.42,
          );
        } else {
          tl.fromTo(
            '.am-mline-2',
            { x: 48, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.48, ease: 'power3.out' },
            0.42,
          );
        }

        if (sM3.chips.length) {
          tl.to(
            sM3.chips,
            { yPercent: 0, opacity: 1, duration: 0.46, stagger: 0.045, ease: 'power3.out' },
            0.6,
          );
        } else {
          tl.fromTo(
            '.am-mline-3',
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.46, ease: 'power3.out' },
            0.6,
          );
        }

        // BEAT 2 -> BEAT 3 (1.14 -> 1.98): Letters part & THE PRODUCT EMERGES INTO FULL SPOTLIGHT + 4 radial callouts
        tl.to(
          '.am-scrolly-beat-manifesto',
          { y: -48, autoAlpha: 0, duration: 0.34, ease: 'power2.inOut' },
          1.14,
        )
          .to(
            '.am-bottle-stage',
            { yPercent: 0, scale: 1.06, opacity: 1, duration: 0.58, ease: 'power3.out' },
            1.22,
          )
          .to(
            '.am-scrolly-backdrop',
            { autoAlpha: 0.46, scale: 1, duration: 0.54, ease: 'power2.out' },
            1.26,
          )
          .to(
            '.am-scrolly-ring',
            { rotation: 190, scale: 1.1, duration: 0.75, ease: 'none' },
            1.2,
          )
          .to('.am-scrolly-callouts', { autoAlpha: 1, duration: 0.1 }, 1.38)
          .fromTo(
            '.am-callout-node',
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.42, stagger: 0.08, ease: 'power3.out' },
            1.4,
          )
          .fromTo(
            '.am-callout-line',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
            1.44,
          );

        // BEAT 3 -> BEAT 4 (2.06 -> 2.85): Bottle glides to left pedestal, Luxury Ritual Atelier slides in right
        tl.to(
          '.am-scrolly-callouts',
          { autoAlpha: 0, y: -16, duration: 0.28, ease: 'power2.in' },
          2.06,
        )
          .to(
            '.am-bottle-stage',
            { x: '-21vw', yPercent: 0, scale: 0.98, duration: 0.62, ease: 'power3.inOut' },
            2.16,
          )
          .to(
            '.am-scrolly-backdrop',
            { x: '-21vw', autoAlpha: 0.62, scale: 0.96, duration: 0.62, ease: 'power3.inOut' },
            2.16,
          )
          .to(
            '.am-scrolly-ring',
            { x: '-21vw', rotation: 250, scale: 0.96, duration: 0.62, ease: 'power3.inOut' },
            2.16,
          )
          .to(
            '.am-scrolly-halo',
            { x: '-18vw', scale: 1.12, duration: 0.62, ease: 'power3.inOut' },
            2.16,
          )
          .to(
            '.am-scrolly-atelier-panel',
            { x: 0, autoAlpha: 1, duration: 0.56, ease: 'power3.out' },
            2.28,
          )
          .to({}, { duration: 0.18 }, 2.82); // Calm dwell before unpinning
      });

      // MOBILE / TABLET (< 960px): Smooth 3-beat pinned scrollytelling + tactile natural-flow Atelier below
      mm.add('(max-width: 959px)', () => {
        gsap.set('.am-scrolly-beat-manifesto', { autoAlpha: 0 });
        gsap.set('.am-scrolly-callouts', { autoAlpha: 0 });
        gsap.set('.am-scrolly-backdrop', { autoAlpha: 0, scale: 0.94 });
        gsap.set('.am-scrolly-atelier-panel', { clearProps: 'all' });
        gsap.set('.am-bottle-stage', { yPercent: 36, scale: 0.84, opacity: 0.65 });

        if (sM1.chips.length) gsap.set(sM1.chips, { yPercent: 115, opacity: 0 });
        if (sM2.chips.length) gsap.set(sM2.chips, { yPercent: 115, opacity: 0 });
        if (sM3.chips.length) gsap.set(sM3.chips, { yPercent: 115, opacity: 0 });

        const tlMob = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: () => `top top+=${getHeaderHeight()}`,
            end: '+=175%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              setPhase(p < 0.3 ? 0 : p < 0.68 ? 1 : 2);
            },
          },
        });

        tlMob
          .to('.am-scrolly-beat-open', { y: -44, autoAlpha: 0, duration: 0.4 }, 0.02)
          .to('.am-scrolly-scroll-cue', { autoAlpha: 0, duration: 0.25 }, 0)
          .to('.am-bottle-stage', { yPercent: 16, scale: 0.88, opacity: 0.16, duration: 0.5, ease: 'power2.inOut' }, 0.06)
          .to('.am-scrolly-ring', { rotation: 140, duration: 1.6, ease: 'none' }, 0)
          .set('.am-scrolly-beat-manifesto', { autoAlpha: 1 }, 0.24);

        if (sM1.chips.length) {
          tlMob.to(sM1.chips, { yPercent: 0, opacity: 1, duration: 0.36, stagger: 0.05 }, 0.28);
        }
        if (sM2.chips.length) {
          tlMob.to(sM2.chips, { yPercent: 0, opacity: 1, duration: 0.36, stagger: 0.05 }, 0.46);
        }
        if (sM3.chips.length) {
          tlMob.to(sM3.chips, { yPercent: 0, opacity: 1, duration: 0.36, stagger: 0.04 }, 0.64);
        }

        tlMob
          .to('.am-scrolly-beat-manifesto', { y: -32, autoAlpha: 0, duration: 0.3 }, 1.08)
          .to('.am-bottle-stage', { yPercent: -18, scale: 0.82, opacity: 1, duration: 0.45, ease: 'power3.out' }, 1.14)
          .to('.am-scrolly-backdrop', { yPercent: -12, autoAlpha: 0.34, scale: 0.94, duration: 0.4 }, 1.16)
          .to('.am-scrolly-callouts', { autoAlpha: 1, duration: 0.15 }, 1.2)
          .fromTo(
            '.am-callout-node',
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, stagger: 0.06 },
            1.22,
          )
          .to({}, { duration: 0.18 }, 1.62);
      });

      return () => {
        mm.revert();
        reverts.forEach((fn) => fn());
      };
    },
    { scope: rootRef },
  );

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

  const jumpToPhase = (targetIdx: number) => {
    const st = stInstanceRef.current;
    if (!st || typeof window === 'undefined') {
      const el = document.getElementById('am-hero-atelier') || document.getElementById('cms-section-rituales_catalogo');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const ratios = [0, 0.36, 0.68, 0.96];
    const r = ratios[targetIdx] ?? 0.96;
    const targetY = st.start + (st.end - st.start) * r;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div ref={rootRef} className="am-scrolly-root">
      {/* Pinned Dark Obsidian Botanical Theatre */}
      <div ref={pinRef} className="am-scrolly-pin">
        {/* Ambient Studio Lighting & Astrolabe Ring */}
        <div className="am-scrolly-halo" aria-hidden="true" />

        <svg
          className="am-scrolly-ring"
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="300" cy="300" r="268" stroke="rgba(223,190,115,0.16)" strokeWidth="1" />
          <circle
            cx="300"
            cy="300"
            r="224"
            stroke="rgba(223,190,115,0.24)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle cx="300" cy="32" r="4" fill="#DFBE73" />
          <circle cx="568" cy="300" r="3" fill="rgba(223,190,115,0.65)" />
          <circle cx="300" cy="568" r="4" fill="#DFBE73" />
          <circle cx="32" cy="300" r="3" fill="rgba(223,190,115,0.65)" />
        </svg>

        {/* Arched Studio Backdrop (CMS Editable Slides) */}
        <div className="am-scrolly-backdrop">
          <CmsList
            f="stageSlides"
            className="am-scrolly-slides"
            renderItem={(_item, i, h) => (
              <figure
                key={i}
                {...h.attrs}
                className={[h.attrs?.className, 'am-scrolly-slide', i === activeSlide ? 'is-active' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <CmsImage
                  f="image"
                  className="am-scrolly-slide-img"
                  width={960}
                  height={1200}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <figcaption className="am-scrolly-slide-cap am-sr-only">
                  <CmsText f="caption" as="span" />
                </figcaption>
                {h.toolbar}
              </figure>
            )}
          />
        </div>

        {/* Centerpiece Transparent Amber Bottle Sculpture */}
        <div className="am-bottle-stage">
          <div className="am-bottle-entry">
            <CmsImage
              f="bottleCutout"
              className="am-scrolly-bottle-img"
              width={520}
              height={872}
              loading="eager"
            />
            <div className="am-bottle-floor-shadow" aria-hidden="true" />
          </div>
        </div>

        {/* BEAT 1: Monumental Editorial Opening (Scroll 0%) */}
        <div className={`am-scrolly-beat-open ${phase === 0 ? 'is-interactive' : ''}`}>
          <CmsText f="headline" as="h1" className="am-scrolly-h1" />

          <div className="am-open-proof am-open-fade">
            <span className="am-stars-champagne" aria-label="Calificación 4.9 de 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} fill="currentColor" />
              ))}
            </span>
            <strong className="am-tabular">4.9/5</strong>
            <span className="am-open-dot" aria-hidden="true">·</span>
            <span>Botica Mineral Colombiana</span>
          </div>

          <CmsText f="subheadline" as="p" className="am-scrolly-sub am-open-fade" />

          <div className="am-open-actions am-open-fade">
            <button
              type="button"
              onClick={() => jumpToPhase(3)}
              className="am-btn am-btn-gold am-btn-lg"
            >
              <ShoppingBag size={17} />
              <span>Elegir mi ritual</span>
              <span className="am-cta-divider">·</span>
              <span className="am-tabular">Desde {money(Number(products[0]?.price || 37000))}</span>
            </button>

            <a href="#cms-section-rituales_catalogo" className="am-btn am-btn-glass-light am-btn-lg">
              <span>Ver presentaciones</span>
            </a>
          </div>
        </div>

        {/* BEAT 2: Kinetic Scroll Manifesto ("Letras que se van colocando") */}
        <div className="am-scrolly-beat-manifesto" aria-live="off">
          <CmsText f="manifestoLine1" as="p" className="am-mline am-mline-1" />
          <CmsText f="manifestoLine2" as="p" className="am-mline am-mline-2" />
          <CmsText f="manifestoLine3" as="p" className="am-mline am-mline-3" />
        </div>

        {/* BEAT 3: Radial Anatomical Bottle Callouts ("Aparece el producto y sus activos") */}
        <div className="am-scrolly-callouts">
          <CmsList
            f="callouts"
            className="am-callouts-grid"
            renderItem={(_item, i, h) => (
              <div
                key={i}
                {...h.attrs}
                className={[
                  h.attrs?.className,
                  'am-callout-node',
                  i % 2 === 0 ? 'am-callout-left' : 'am-callout-right',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="am-callout-copy">
                  <CmsText f="title" as="strong" className="am-callout-title" />
                  <CmsText f="detail" as="span" className="am-callout-detail" />
                </div>
                <span className="am-callout-line" aria-hidden="true">
                  <span className="am-callout-dot" />
                </span>
                {h.toolbar}
              </div>
            )}
          />
        </div>

        {/* Desktop Beat 4 In-Stage Conversion Panel */}
        <div
          className={`am-scrolly-atelier-panel am-atelier-desktop-only ${phase === 3 ? 'is-interactive' : ''}`}
        >
          <HeroRitualSelector
            products={products}
            selectedIdx={safeIdx}
            onSelect={handleSelectOption}
            onAdd={handleQuickAdd}
            cmsUrl={cmsUrl}
            money={money}
            activeProduct={activeProduct}
            activePrice={activePrice}
            activeCompare={activeCompare}
          />
        </div>

        {/* Right-Rail Chapter Scrubber (Desktop) */}
        <nav className="am-scrolly-rail" aria-label="Capítulos del escenario">
          <div className="am-scrolly-progress" aria-hidden="true">
            <span className="am-scrolly-progress-fill" />
          </div>
          <div className="am-scrolly-rail-btns">
            {STAGE_LABELS.map((lbl, idx) => (
              <button
                key={lbl}
                type="button"
                onClick={() => jumpToPhase(idx)}
                className={`am-rail-step ${phase === idx ? 'is-active' : ''}`}
              >
                <span className="am-rail-dot" aria-hidden="true" />
                <span className="am-rail-label">{lbl}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Scroll Cue */}
        <button
          type="button"
          onClick={() => jumpToPhase(1)}
          className="am-scrolly-scroll-cue"
        >
          <CmsText f="scrollCue" as="span" />
          <span className="am-scroll-cue-icon" aria-hidden="true">
            <ArrowDown size={15} />
          </span>
        </button>
      </div>

      {/* Mobile / Tablet Tactile Conversion Atelier right below the pinned film */}
      <div id="am-hero-atelier" className="am-atelier-mobile-wrap">
        <div className="am-container">
          <HeroRitualSelector
            products={products}
            selectedIdx={safeIdx}
            onSelect={handleSelectOption}
            onAdd={handleQuickAdd}
            cmsUrl={cmsUrl}
            money={money}
            activeProduct={activeProduct}
            activePrice={activePrice}
            activeCompare={activeCompare}
            renderCmsFields={false}
          />
        </div>
      </div>
    </div>
  );
}

function HeroRitualSelector({
  products,
  selectedIdx,
  onSelect,
  onAdd,
  cmsUrl,
  money,
  activeProduct,
  activePrice,
  activeCompare,
  renderCmsFields = true,
}: {
  products: CollectionItem[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  onAdd: () => void;
  cmsUrl: string;
  money: (n: number) => string;
  activeProduct: CollectionItem | null;
  activePrice: number;
  activeCompare: number;
  renderCmsFields?: boolean;
}) {
  return (
    <div className="am-atelier-card">
      <div className="am-atelier-head">
        {renderCmsFields ? (
          <CmsText f="ritualLabel" as="h2" className="am-atelier-title" />
        ) : (
          <h2 className="am-atelier-title">Selecciona tu presentación Alma Mineral</h2>
        )}
        <span className="am-atelier-coupon">Código ALMAMINERAL10 (-10 %)</span>
      </div>

      {products.length > 0 ? (
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
                  onClick={() => onSelect(idx)}
                  className={`am-ritual-option ${selected ? 'is-selected' : ''} ${units === 3 ? 'is-best-value' : ''}`}
                >
                  <div className="am-ritual-opt-left">
                    <span className="am-ritual-radio" aria-hidden="true" />
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        width={40}
                        height={48}
                        className="am-ritual-thumb"
                        loading="eager"
                      />
                    ) : null}
                    <div className="am-ritual-opt-text">
                      <div className="am-ritual-opt-title-row">
                        {renderCmsFields ? (
                          <CmsItemText f="title" as="strong" className="am-ritual-opt-title" />
                        ) : (
                          <strong className="am-ritual-opt-title">{String(prod.title || '')}</strong>
                        )}
                        {prod.badge ? (
                          renderCmsFields ? (
                            <CmsItemText
                              f="badge"
                              as="span"
                              className={`am-ritual-opt-badge ${units === 3 ? 'is-gold' : ''}`}
                            />
                          ) : (
                            <span className={`am-ritual-opt-badge ${units === 3 ? 'is-gold' : ''}`}>
                              {String(prod.badge)}
                            </span>
                          )
                        ) : null}
                      </div>
                      <span className="am-ritual-opt-unit am-tabular">
                        {units > 1
                          ? `${money(perUnit)} por frasco · ${units} unidades`
                          : '1 frasco spray en vidrio ámbar'}
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
      ) : null}

      <div className="am-stage-cta-stack">
        <button type="button" onClick={onAdd} className="am-btn am-btn-gold am-btn-xl am-w-full am-stage-buy-btn">
          <ShoppingBag size={18} />
          {renderCmsFields ? (
            <CmsText f="buyButtonLabel" as="span" fallback="Agregar al ritual" />
          ) : (
            <span>Agregar al ritual</span>
          )}
          <span className="am-cta-divider">·</span>
          <span className="am-tabular">{money(activePrice)}</span>
        </button>

        <div className="am-stage-secondary-row">
          {renderCmsFields ? (
            <CmsLink f="primaryCta" className="am-stage-text-link" />
          ) : (
            <Link href="/tienda" className="am-stage-text-link">
              Explorar catálogo completo
            </Link>
          )}
          {activeProduct?.slug ? (
            <Link href={`/producto/${activeProduct.slug}`} className="am-stage-text-link">
              Ver ingredientes y uso
            </Link>
          ) : null}
        </div>
      </div>

      <div className="am-hero-trust-strip">
        <div className="am-trust-strip-item">
          <Truck size={15} />
          {renderCmsFields ? (
            <CmsText f="barLeft" as="span" />
          ) : (
            <span>Botica en Valle del Cauca · Fórmula 100 % vegana</span>
          )}
        </div>
        <div className="am-trust-strip-item">
          <CreditCard size={15} />
          {renderCmsFields ? (
            <CmsText f="barRight" as="span" />
          ) : (
            <span>Envío nacional $5.000 COP · Wompi y Contraentrega</span>
          )}
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

      const h2El = sectionRef.current.querySelector<HTMLElement>('.am-pore-h2');
      const split = splitWordsForMotion(h2El);

      if (split.chips.length) {
        gsap.from(split.chips, {
          yPercent: 110,
          opacity: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }

      gsap.from('.am-pore-reveal', {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.to('.am-crystal-node', {
        y: -6,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
        ease: 'sine.inOut',
      });

      return () => split.revert();
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
        <div className="am-pore-top-bar">
          <div className="am-pore-header">
            <CmsText f="heading" as="h2" className="am-h2 am-pore-h2" />
            <CmsText f="intro" as="p" className="am-lead am-pore-reveal" />
          </div>

          <div className="am-pore-controls am-pore-reveal" role="tablist" aria-label="Mecanismo en la piel">
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
                  <stop offset="0%" stopColor="#12261A" />
                  <stop offset="100%" stopColor="#08120C" />
                </linearGradient>
                <linearGradient id="amEpidermis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#263D2E" />
                  <stop offset="100%" stopColor="#1A2C21" />
                </linearGradient>
                <linearGradient id="amDermis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15241B" />
                  <stop offset="100%" stopColor="#0D1711" />
                </linearGradient>
                <linearGradient id="amGoldCrystal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5DDA0" />
                  <stop offset="50%" stopColor="#D4AE5E" />
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

              <path d="M0 132 Q110 128 212 136" fill="none" stroke="#DFBE73" strokeWidth="2.5" strokeOpacity="0.85" />
              <path d="M308 136 Q410 128 520 132" fill="none" stroke="#DFBE73" strokeWidth="2.5" strokeOpacity="0.85" />

              <path
                d="M212 136 C226 176, 232 232, 232 276 C232 308, 288 308, 288 276 C288 232, 294 176, 308 136 Z"
                fill="#07100B"
                stroke="rgba(223, 190, 115, 0.42)"
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

              <text x="24" y="52" fill="rgba(250,248,245,0.86)" fontSize="13.5" fontWeight="500">
                Superficie antibacteriana
              </text>
              <text x="24" y="168" fill="#E8E3D9" fontSize="13.5" fontWeight="600">
                Epidermis intacta
              </text>
              <text x="24" y="242" fill="rgba(232,227,217,0.82)" fontSize="13.5">
                <tspan x="24" dy="0">Dermis profunda</tspan>
                <tspan x="24" dy="18">Glándula sudorípara</tspan>
              </text>
            </svg>

            <CmsText f="diagramCaption" as="p" className="am-pore-caption" />
          </div>

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
/* 3. HERBARIO MINERAL — Sticky Levitating Bottle + Scrolling Chapters        */
/* -------------------------------------------------------------------------- */

export function HerbarioMineral({ section: s }: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapters: Array<any> = Array.isArray(s.data.chapters) ? s.data.chapters : [];

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const h2El = rootRef.current.querySelector<HTMLElement>('.am-herb-display');
      const split = splitWordsForMotion(h2El);
      if (split.chips.length) {
        gsap.from(split.chips, {
          yPercent: 112,
          opacity: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }

      // Subtle continuous bottle rotation & scroll-linked dial rotation on the sticky column
      gsap.to('.am-herb-sticky-dial', {
        rotation: 220,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>('.am-herb-chapter', rootRef.current);
      cards.forEach((card, idx) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 56%',
          end: 'bottom 44%',
          onEnter: () => setActiveChapter(idx),
          onEnterBack: () => setActiveChapter(idx),
        });

        const photo = card.querySelector<HTMLElement>('.am-herb-photo');
        if (photo) {
          gsap.fromTo(
            photo,
            { scale: 1.09 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'bottom 30%',
                scrub: 0.6,
              },
            },
          );
        }
      });

      return () => split.revert();
    },
    { scope: rootRef },
  );

  const scrollToChapter = (idx: number) => {
    setActiveChapter(idx);
    const cards = rootRef.current?.querySelectorAll<HTMLElement>('.am-herb-chapter');
    cards?.[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div ref={rootRef} className="am-herb-field">
      <div className="am-container am-herb-sticky-layout">
        {/* Left Sticky Showcase Column */}
        <aside className="am-herb-sticky-col">
          <div className="am-herb-intro">
            <CmsText f="heading" as="h2" className="am-herb-display" />
            <CmsText f="lead" as="p" className="am-herb-lead" />
          </div>

          <div className="am-herb-pedestal-stage">
            <svg className="am-herb-sticky-dial" viewBox="0 0 320 320" fill="none" aria-hidden="true">
              <circle cx="160" cy="160" r="146" stroke="rgba(223,190,115,0.18)" strokeWidth="1" />
              <circle cx="160" cy="160" r="118" stroke="rgba(223,190,115,0.28)" strokeWidth="1" strokeDasharray="3 7" />
              <circle cx="160" cy="14" r="4" fill="#DFBE73" />
              <circle cx="160" cy="306" r="4" fill="#DFBE73" />
            </svg>

            <div className="am-herb-bottle-float">
              <CmsImage f="pinnedBottle" className="am-herb-bottle-cutout" width={240} height={400} />
            </div>
          </div>

          {chapters.length > 0 ? (
            <div className="am-herb-pills-nav" role="tablist" aria-label="Capítulos de ingredientes">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeChapter === idx}
                  onClick={() => scrollToChapter(idx)}
                  className={`am-herb-mini-pill ${activeChapter === idx ? 'is-active' : ''}`}
                >
                  <span>{String(ch?.title || '').split('(')[0].trim()}</span>
                </button>
              ))}
            </div>
          ) : null}
        </aside>

        {/* Right Scrolling Botanical Chapters Stream (directly on CmsList) */}
        <CmsList
          f="chapters"
          className="am-herb-stream"
          renderItem={(_ch, i, h) => (
            <article
              key={i}
              {...h.attrs}
              className={`am-herb-chapter ${activeChapter === i ? 'is-highlighted' : ''}`}
            >
              <div className="am-herb-photo-wrap">
                <CmsImage f="image" className="am-herb-photo" width={760} height={500} />
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
/* 4. GALERÍA RITUAL — Scroll-Linked Horizontal Filmstrip + Tactile Controls  */
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

      const mm = gsap.matchMedia();
      mm.add('(min-width: 681px)', () => {
        const inner = rootRef.current?.querySelector<HTMLElement>('.am-gallery-track-inner');
        if (inner) {
          gsap.fromTo(
            inner,
            { x: 36 },
            {
              x: -140,
              ease: 'none',
              scrollTrigger: {
                trigger: rootRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.85,
              },
            },
          );
        }
      });

      gsap.from('.am-gallery-module', {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 86%',
          once: true,
        },
      });

      return () => mm.revert();
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
/* 5. RESPALDO INTEGRATIVO — Word-by-Word Scroll-Illuminated Quote            */
/* -------------------------------------------------------------------------- */

export function RespaldoIntegrativo(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const quoteP = rootRef.current.querySelector<HTMLElement>('.am-offset-quote p');
      const split = splitWordsForMotion(quoteP);

      if (split.chips.length) {
        gsap.fromTo(
          split.chips,
          { opacity: 0.22, yPercent: 18 },
          {
            opacity: 1,
            yPercent: 0,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 76%',
              end: 'center 42%',
              scrub: 0.45,
            },
          },
        );
      }

      gsap.from('.am-quote-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 84%',
          once: true,
        },
      });

      return () => split.revert();
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
/* 6. CIERRE BOTICA — Monumental Obsidian & Gold Finale with Parallax         */
/* -------------------------------------------------------------------------- */

export function CierreBotica(_props: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const h2El = rootRef.current.querySelector<HTMLElement>('.am-closing-title');
      const split = splitWordsForMotion(h2El);

      if (split.chips.length) {
        gsap.from(split.chips, {
          yPercent: 110,
          opacity: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }

      gsap.from('.am-closing-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      gsap.fromTo(
        '.am-closing-img',
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        },
      );

      return () => split.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-closing-wrap">
      <div className="am-container">
        <div className="am-closing-card">
          <div className="am-closing-copy-panel">
            <CmsText f="heading" as="h2" className="am-closing-title" />
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
