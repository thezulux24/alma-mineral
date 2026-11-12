'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  Check,
  Droplets,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { editAttrs, galleryField, markdownToHtml, mediaUrl, type CollectionItem } from '@latinovation/cms-client';
import {
  CmsAddItem,
  CmsBackInStockForm,
  CmsItem,
  CmsItemImage,
  CmsItemText,
  CmsLink,
  CmsText,
  CmsUiText,
  useCart,
  useCms,
  useMoney,
  useProduct,
  useProducts,
  useRelatedProducts,
  useReviews,
  useShopConfig,
  useWishlist,
  type CmsBlockProps,
} from '@latinovation/cms-client/react';
import { useStoreUi } from '../StoreUiContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProductCard({ item }: { item: CollectionItem }) {
  const cart = useCart();
  const money = useMoney();
  const wishlist = useWishlist();
  const { openCart, notify, triggerBagPulse } = useStoreUi();

  const pid = item.slug || item.id;
  const liked = wishlist.ids.includes(pid) || wishlist.ids.includes(item.id);
  const price = Number(item.price ?? 37000);
  const compare = Number(item.compareAtPrice ?? 0);
  const units = Number(item.unitsCount ?? 1);
  const perUnit = Math.round(price / Math.max(1, units));
  const stock = item.stock === undefined || item.stock === null ? 99 : Number(item.stock);
  const inStock = stock > 0 && item.inStock !== false;
  const isBestBundle = units === 3;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    cart.add(
      {
        productId: pid,
        title: String(item.title || 'Desodorante Natural Alma Mineral'),
        unitPrice: price,
        imageUrl: String(item.imageUrl || ''),
        sku: String(item.sku || ''),
      },
      1,
    );
    triggerBagPulse();
    notify(`${item.title} agregado a tu bolsa`);
    openCart();
  };

  return (
    <CmsItem collection="productos" item={item}>
      <article className={`am-prod-card ${isBestBundle ? 'is-featured-bundle' : ''}`}>
        <div className="am-prod-media-wrap">
          <Link href={`/producto/${item.slug}`} className="am-prod-media-link" aria-label={String(item.title)}>
            <CmsItemImage f="imageUrl" className="am-prod-img" width={720} height={820} />
          </Link>

          {item.badge ? (
            <CmsItemText
              f="badge"
              as="span"
              className={`am-prod-badge ${isBestBundle ? 'is-gold' : ''}`}
            />
          ) : null}

          <button
            type="button"
            onClick={() => wishlist.toggle(pid)}
            aria-label={liked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            aria-pressed={liked}
            className={`am-wish-btn ${liked ? 'is-liked' : ''}`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="am-prod-body">
          <Link href={`/producto/${item.slug}`} className="am-prod-title-link">
            <CmsItemText f="title" as="h3" className="am-prod-title" />
          </Link>

          <div className="am-prod-rating-row">
            <span className="am-stars-gold" aria-label="Calificación 4.9 de 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={13} fill="currentColor" />
              ))}
            </span>
            <span className="am-prod-rating-num am-tabular">4.9</span>
            <span className="am-proof-sep">·</span>
            {item.category ? <CmsItemText f="category" as="span" className="am-prod-cat" /> : null}
            {item.brand ? <CmsItemText f="brand" as="span" className="am-sr-only" /> : null}
            {item.volume ? <CmsItemText f="volume" as="span" className="am-sr-only" /> : null}
          </div>

          {item.subtitle ? <CmsItemText f="subtitle" as="p" className="am-prod-subtitle" /> : null}
          {item.summary ? <CmsItemText f="summary" as="p" className="am-prod-summary" /> : null}
          {item.ingredientsList ? <CmsItemText f="ingredientsList" as="span" className="am-sr-only" /> : null}
          {item.howToUse ? <CmsItemText f="howToUse" as="span" className="am-sr-only" /> : null}

          <div className="am-prod-foot">
            <div className="am-prod-price-row am-tabular">
              <div className="am-prod-prices">
                <strong className="am-prod-price">{money(price)}</strong>
                {compare > price ? <s className="am-prod-compare">{money(compare)}</s> : null}
              </div>
              {units > 1 ? (
                <span className="am-prod-unit-pill">{money(perUnit)} / ud.</span>
              ) : (
                <span className="am-prod-unit-muted">Vidrio ámbar</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!inStock}
              className={`am-btn ${isBestBundle ? 'am-btn-primary' : 'am-btn-dark-outline'} am-w-full`}
            >
              <ShoppingBag size={17} />
              {inStock ? (
                <>
                  <CmsUiText k="addToCart" fallback="Agregar al ritual" />
                  <span className="am-cta-divider">·</span>
                  <span className="am-tabular">{money(price)}</span>
                </>
              ) : (
                <CmsUiText k="soldOut" fallback="Agotado" />
              )}
            </button>
          </div>
        </div>
      </article>
    </CmsItem>
  );
}

/* -------------------------------------------------------------------------- */
/* SECCIÓN DE CATÁLOGO (Home y /tienda)                                       */
/* -------------------------------------------------------------------------- */

export function ProductsCatalogSection({ section: s }: CmsBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const collectionSlug = String(s.data.collection || 'productos');
  const allItems = useProducts({ collection: collectionSlug });
  const showFilters = Boolean(s.data.showFilters);
  const featuredOnly = Boolean(s.data.featuredOnly);

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc'>('price-asc');

  const categories = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => {
      if (i.category) set.add(String(i.category));
    });
    return Array.from(set);
  }, [allItems]);

  const filtered = useMemo(() => {
    let list = featuredOnly ? allItems.filter((i) => i.isFeatured !== false) : [...allItems];
    if (selectedCat !== 'all') {
      list = list.filter((i) => String(i.category || '') === selectedCat);
    }
    list.sort((a, b) => {
      const pa = Number(a.price || 0);
      const pb = Number(b.price || 0);
      return sortBy === 'price-asc' ? pa - pb : pb - pa;
    });
    return list;
  }, [allItems, featuredOnly, selectedCat, sortBy]);

  useGSAP(
    () => {
      if (!rootRef.current || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cards = gsap.utils.toArray<HTMLElement>('.am-prod-card', rootRef.current);
      if (cards.length) {
        gsap.from(cards, {
          y: 22,
          opacity: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="am-section-pad am-catalog-section">
      <div className="am-container">
        <div className="am-catalog-header">
          <div className="am-catalog-head-copy">
            <CmsText f="heading" as="h2" className="am-h2" />
            <CmsText f="intro" as="p" className="am-lead" />
          </div>
          {s.data.moreLink ? <CmsLink f="moreLink" className="am-btn am-btn-outline" /> : null}
        </div>

        {showFilters && categories.length > 0 ? (
          <div className="am-filter-bar">
            <div className="am-filter-pills" role="tablist" aria-label="Filtrar por presentación">
              <button
                type="button"
                role="tab"
                aria-selected={selectedCat === 'all'}
                onClick={() => setSelectedCat('all')}
                className={`am-filter-pill ${selectedCat === 'all' ? 'is-active' : ''}`}
              >
                Todas ({allItems.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCat === cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`am-filter-pill ${selectedCat === cat ? 'is-active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <label className="am-sort-select-wrap">
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc')}
                className="am-select"
              >
                <option value="price-asc">Menor a mayor valor</option>
                <option value="price-desc">Packs de mayor ahorro</option>
              </select>
            </label>
          </div>
        ) : null}

        <div className="am-prod-grid">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        <div className="am-builder-add-wrap">
          <CmsAddItem collection={collectionSlug} label="Agregar presentación" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FICHA DE PRODUCTO (/producto/[slug])                                       */
/* -------------------------------------------------------------------------- */

export function ProductDetailView({ slug }: { slug: string }) {
  const router = useRouter();
  const { cmsUrl } = useCms();
  const product = useProduct(slug, 'productos');
  const allProducts = useProducts({ collection: 'productos' });
  const related = useRelatedProducts(product || null, { collection: 'productos', count: 3 });
  const cart = useCart();
  const money = useMoney();
  const wishlist = useWishlist();
  const { config } = useShopConfig();
  const { openCart, notify, triggerBagPulse } = useStoreUi();

  const pdpRef = useRef<HTMLDivElement>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useGSAP(
    () => {
      if (!product || typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('.am-pdp-gallery, .am-pdp-sheet > *', {
        y: 18,
        opacity: 0,
        duration: 0.58,
        stagger: 0.045,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    },
    { scope: pdpRef, dependencies: [product?.slug] },
  );

  if (!product) {
    return (
      <section className="am-section-pad am-container">
        <h1 className="am-h2">Presentación no encontrada</h1>
        <p className="am-lead">Es posible que esta referencia haya cambiado de enlace.</p>
        <Link href="/tienda" className="am-btn am-btn-primary">
          Volver a la tienda
        </Link>
      </section>
    );
  }

  const pid = product.slug || product.id;
  const price = Number(product.price ?? 37000);
  const compare = Number(product.compareAtPrice ?? 0);
  const stock = product.stock === undefined || product.stock === null ? 99 : Number(product.stock);
  const inStock = stock > 0 && product.inStock !== false;
  const liked = wishlist.ids.includes(pid) || wishlist.ids.includes(product.id);
  const freeThreshold = config?.freeShippingThreshold || 95000;
  const qualifiesFree = price * qty >= freeThreshold;

  const photos = useMemo(() => {
    const gal = galleryField(product.gallery);
    const main = product.imageUrl ? [{ url: String(product.imageUrl), alt: String(product.title || '') }] : [];
    const merged = [...main, ...gal];
    const seen = new Set<string>();
    return merged.filter((p) => {
      if (!p.url || seen.has(p.url)) return false;
      seen.add(p.url);
      return true;
    });
  }, [product]);

  const currentPhoto = photos[activePhotoIdx] || photos[0] || null;

  const handleAdd = (goCheckout = false) => {
    if (!inStock) return;
    cart.add(
      {
        productId: pid,
        title: String(product.title || 'Desodorante Natural Alma Mineral'),
        unitPrice: price,
        imageUrl: String(product.imageUrl || ''),
        sku: String(product.sku || ''),
      },
      qty,
    );
    triggerBagPulse();
    if (goCheckout) {
      router.push('/checkout');
    } else {
      notify(`${product.title} (${qty}) agregado a tu bolsa`);
      openCart();
    }
  };

  const otherRituals = related.length
    ? allProducts.filter((p) => related.some((r) => r.id === p.id || r.slug === p.slug))
    : allProducts.filter((p) => p.slug !== product.slug);

  return (
    <CmsItem collection="productos" item={product}>
      <div className="am-pdp" ref={pdpRef}>
        <div className="am-container">
          <nav className="am-breadcrumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/tienda">Tienda</Link>
            <span>/</span>
            <span>{product.title}</span>
          </nav>

          <div className="am-pdp-split">
            {/* Left Sticky Gallery */}
            <div className="am-pdp-gallery">
              <div className="am-pdp-main-frame">
                {activePhotoIdx === 0 ? (
                  <CmsItemImage f="imageUrl" className="am-pdp-main-img" width={1000} height={1160} />
                ) : currentPhoto ? (
                  <img
                    src={mediaUrl(currentPhoto.url, cmsUrl)}
                    alt={currentPhoto.alt || product.title}
                    className="am-pdp-main-img"
                    width={1000}
                    height={1160}
                  />
                ) : null}

                {product.badge ? <CmsItemText f="badge" as="span" className="am-prod-badge" /> : null}
              </div>

              {photos.length > 1 ? (
                <div className="am-pdp-thumbs" role="tablist" aria-label="Galería de fotos">
                  {photos.map((ph, idx) => (
                    <button
                      key={ph.url}
                      type="button"
                      role="tab"
                      aria-selected={idx === activePhotoIdx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`am-pdp-thumb-btn ${idx === activePhotoIdx ? 'is-active' : ''}`}
                    >
                      <img
                        src={mediaUrl(ph.url, cmsUrl)}
                        alt={ph.alt || `${product.title} ${idx + 1}`}
                        width={88}
                        height={104}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Right Apothecary Detail Sheet */}
            <div className="am-pdp-sheet">
              <CmsItemText f="title" as="h1" className="am-pdp-h1" />

              <div className="am-pdp-rating-strip">
                <span className="am-stars-gold" aria-label="4.9 de 5 estrellas">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} fill="currentColor" />
                  ))}
                </span>
                <strong className="am-tabular">4.9/5</strong>
                <span className="am-proof-sep">·</span>
                <span>Fórmula 100 % vegana y libre de aluminio sintético</span>
              </div>

              {product.subtitle ? <CmsItemText f="subtitle" as="p" className="am-pdp-subtitle" /> : null}

              <div className="am-pdp-meta-row">
                {product.brand ? <CmsItemText f="brand" as="span" className="am-prod-cat" /> : null}
                {product.category ? <CmsItemText f="category" as="span" className="am-prod-cat" /> : null}
                {product.volume ? <CmsItemText f="volume" as="span" className="am-prod-vol" /> : null}
              </div>

              <div className="am-pdp-price-block am-tabular">
                <strong className="am-pdp-price">{money(price)}</strong>
                {compare > price ? <s className="am-pdp-compare">{money(compare)}</s> : null}
                {qualifiesFree ? (
                  <span className="am-free-pill">Incluye envío gratis</span>
                ) : (
                  <span className="am-ship-note">Envío nacional $5.000 COP</span>
                )}
              </div>

              {product.summary ? <CmsItemText f="summary" as="p" className="am-pdp-summary" multiline /> : null}

              {/* Olfactory & Botanical Note Chips */}
              <div className="am-pdp-notes-row" aria-label="Perfil sensorial">
                <span className="am-note-chip">
                  <Sparkles size={14} /> Piedra de Alumbre pura
                </span>
                <span className="am-note-chip">
                  <Leaf size={14} /> Romero y Menta fresca
                </span>
                <span className="am-note-chip">
                  <Droplets size={14} /> Vitamina E + Omega 6
                </span>
              </div>

              {/* Presentation switcher across all 3 real SKUs */}
              {allProducts.length > 1 ? (
                <div className="am-pdp-pack-switcher">
                  <p className="am-pdp-label">Elige presentación y ahorra:</p>
                  <div className="am-pdp-pack-pills">
                    {allProducts.map((p) => {
                      const active = p.slug === product.slug;
                      const pUnits = Number(p.unitsCount || 1);
                      return (
                        <Link
                          key={p.id}
                          href={`/producto/${p.slug}`}
                          className={`am-pack-pill ${active ? 'is-active' : ''}`}
                        >
                          <span className="am-pack-pill-top">
                            {pUnits === 3 ? 'Pack x3 · Envío gratis' : pUnits === 2 ? 'Dúo x2 · -5 %' : 'Individual'}
                          </span>
                          <strong className="am-tabular">{money(Number(p.price || 37000))}</strong>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {inStock ? (
                <div className="am-pdp-buy-box">
                  <div className="am-pdp-qty-row">
                    <div className="am-qty-control am-qty-lg">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="am-tabular">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => q + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(false)}
                      className="am-btn am-btn-primary am-btn-xl am-flex-1"
                    >
                      <ShoppingBag size={18} />
                      <CmsUiText k="addToCart" fallback="Agregar al ritual" /> ·{' '}
                      <span className="am-tabular">{money(price * qty)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => wishlist.toggle(pid)}
                      aria-pressed={liked}
                      aria-label="Guardar en favoritos"
                      className={`am-icon-btn am-icon-btn-bordered ${liked ? 'is-liked' : ''}`}
                    >
                      <Heart size={19} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <button type="button" onClick={() => handleAdd(true)} className="am-btn am-btn-outline am-w-full">
                    Comprar ahora con Wompi o Pago Contraentrega
                  </button>
                </div>
              ) : (
                <div className="am-out-of-stock-box">
                  <p className="am-out-label">
                    Agotado temporalmente. Déjanos tu correo para avisarte cuando salga el nuevo lote:
                  </p>
                  <CmsBackInStockForm productId={pid} className="am-bis-form" />
                </div>
              )}

              <ul className="am-pdp-trust-list">
                <li>
                  <ShieldCheck size={18} />
                  <span>Pagos seguros con Wompi (PSE, Nequi, Tarjetas) o Pago contraentrega en casa</span>
                </li>
                <li>
                  <Truck size={18} />
                  <span>Despacho rápido a toda Colombia ($5.000 COP · Gratis desde $95.000 COP)</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>No mancha camisas blancas ni ropa negra y cuida la piel recién depilada</span>
                </li>
              </ul>

              {/* Rich Apothecary Specs — all marked with item editAttrs for 100% editability */}
              <div className="am-pdp-specs">
                {product.ingredientsList ? (
                  <div className="am-spec-block">
                    <h3>Siete ingredientes activos</h3>
                    <CmsItemText f="ingredientsList" as="p" multiline />
                  </div>
                ) : null}

                {product.howToUse ? (
                  <div className="am-spec-block">
                    <h3>Ritual de aplicación en 3 segundos</h3>
                    <CmsItemText f="howToUse" as="p" multiline />
                  </div>
                ) : null}

                {product.skinType || product.aroma ? (
                  <div className="am-spec-grid-two">
                    {product.skinType ? (
                      <div className="am-spec-block">
                        <h3>Tipo de piel</h3>
                        <CmsItemText f="skinType" as="p" />
                      </div>
                    ) : null}
                    {product.aroma ? (
                      <div className="am-spec-block">
                        <h3>Perfil aromático</h3>
                        <CmsItemText f="aroma" as="p" />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {product.description ? (
                  <div
                    className="am-spec-block am-richtext"
                    {...editAttrs({
                      item: { collection: 'productos', id: product.id },
                      field: 'description',
                      type: 'richtext',
                    })}
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(String(product.description)) }}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Verified Reviews */}
          <div className="am-pdp-reviews-wrap">
            <div className="am-reviews-header">
              <div>
                <span className="am-kicker">Comunidad Alma Mineral</span>
                <h2 className="am-h2">Experiencias verificadas</h2>
              </div>
              <div className="am-reviews-score-pill">
                <span className="am-stars-gold">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={15} fill="currentColor" />
                  ))}
                </span>
                <strong className="am-tabular">4.9 / 5.0</strong>
              </div>
            </div>
            <ApothecaryReviews productId={pid} />
          </div>

          {/* Related Presentations */}
          {otherRituals.length > 0 ? (
            <div className="am-pdp-related">
              <span className="am-kicker">Ahorra en packs</span>
              <h2 className="am-h2 am-mb-md">Otras presentaciones del ritual</h2>
              <div className="am-prod-grid">
                {otherRituals.slice(0, 2).map((it) => (
                  <ProductCard key={it.id} item={it} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </CmsItem>
  );
}

function ApothecaryReviews({ productId }: { productId: string }) {
  const rev = useReviews(productId);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await rev.submit({
        rating,
        name: name.trim(),
        email: email.trim() || undefined,
        title: title.trim() || undefined,
        body: body.trim(),
      });
      setStatusMsg(res.message || 'Gracias. Publicaremos tu opinión después de revisarla.');
      setName('');
      setEmail('');
      setTitle('');
      setBody('');
    } catch {
      setStatusMsg('No pudimos registrar tu opinión en este momento. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="am-reviews-widget">
      {rev.items.length > 0 ? (
        <ul className="am-reviews-list">
          {rev.items.map((r) => (
            <li key={r.id} className="am-review-card">
              <div className="am-review-top">
                <div className="am-review-stars" aria-label={`${r.rating} de 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={15} fill={n <= r.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <strong>{r.name}</strong>
                {r.verifiedPurchase ? <span className="am-verified-tag">Compra verificada</span> : null}
              </div>
              {r.title ? <h3 className="am-review-title">{r.title}</h3> : null}
              <p className="am-review-body">{r.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="am-review-empty">Sé la primera persona en compartir cómo te fue con este ritual mineral.</p>
      )}

      <form onSubmit={handleSubmit} className="am-review-form">
        <div className="am-rating-picker" role="radiogroup" aria-label="Calificación">
          <span className="am-pdp-label">Califica tu experiencia:</span>
          <div className="am-rating-btns">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} de 5`}
                onClick={() => setRating(n)}
                className={`am-star-btn ${n <= rating ? 'is-lit' : ''}`}
              >
                <Star size={18} fill={n <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <div className="am-form-grid-2">
          <input
            type="text"
            required
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Tu correo (no se publica)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Título breve (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows={3}
          required
          placeholder="Cuéntanos cómo se sintió en tu piel y en tu rutina diaria"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {statusMsg ? <p className="am-coupon-feedback">{statusMsg}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Publicar opinión'}
        </button>
      </form>
    </div>
  );
}
