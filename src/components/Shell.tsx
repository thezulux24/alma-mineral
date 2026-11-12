'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, Minus, Plus, ShoppingBag, Trash2, User, X } from 'lucide-react';
import { mediaUrl, type DeliveryPayload } from '@latinovation/cms-client';
import {
  CartProvider,
  CmsGlobalImage,
  CmsGlobalText,
  CmsNav,
  CmsNavLink,
  CmsNavText,
  CmsPricingTotals,
  CmsProvider,
  CmsTracking,
  CmsUiText,
  CmsWhatsAppOrderButton,
  ShopAccountProvider,
  useCart,
  useCms,
  useGlobal,
  useMoney,
  useOptionalShopAccount,
  useShopConfig,
  useShopUi,
  useTrackingConsent,
  useWishlist,
} from '@latinovation/cms-client/react';
import { StoreUiProvider, useStoreUi } from './StoreUiContext';

export function SiteProviders({
  initial,
  slug,
  cmsUrl,
  allowedOrigins,
  children,
}: {
  initial: DeliveryPayload;
  slug: string;
  cmsUrl: string;
  allowedOrigins: string[];
  children: React.ReactNode;
}) {
  return (
    <CmsProvider initial={initial} slug={slug} cmsUrl={cmsUrl} allowedOrigins={allowedOrigins}>
      <ShopAccountProvider slug={slug} apiUrl={cmsUrl}>
        <CartProvider slug={slug} apiUrl={cmsUrl}>
          <StoreUiProvider>
            <CmsTracking />
            {children}
          </StoreUiProvider>
        </CartProvider>
      </ShopAccountProvider>
    </CmsProvider>
  );
}

export function SkipLink() {
  return (
    <a href="#contenido" className="am-skip">
      Saltar al contenido principal
    </a>
  );
}

export function Header() {
  const pathname = usePathname();
  const { payload } = useCms();
  const cart = useCart();
  const wishlist = useWishlist();
  const account = useOptionalShopAccount();
  const { openCart, bagPulse } = useStoreUi();
  const [mobileOpen, setMobileOpen] = useState(false);

  const announcement = useGlobal<string>('announcementText', '');
  const ctaHref = (payload.navigation as any)?.headerCtaHref || '/tienda';

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="am-header-wrap">
      {announcement ? (
        <div className="am-announce">
          <CmsGlobalText f="announcementText" as="p" className="am-announce-text" />
        </div>
      ) : null}

      <div className="am-header">
        <div className="am-header-inner">
          <Link href="/" className="am-brand" aria-label="Inicio Alma Mineral">
            <CmsGlobalImage f="logoUrl" className="am-brand-logo" width={44} height={44} />
            <CmsGlobalText f="brandName" as="span" className="am-brand-name" fallback="Alma Mineral" />
          </Link>

          <CmsNav
            list="header"
            className="am-nav-desktop"
            renderLink={(link) => (
              <CmsNavLink
                link={link}
                list="header"
                as={Link}
                className={`am-nav-link ${pathname === link.href ? 'is-active' : ''}`}
              />
            )}
          />

          <div className="am-header-actions">
            <Link href="/favoritos" className="am-icon-btn" aria-label="Favoritos">
              <Heart size={19} strokeWidth={1.75} />
              {wishlist.ids.length > 0 ? <span className="am-badge-dot">{wishlist.ids.length}</span> : null}
            </Link>

            <Link
              href="/cuenta"
              className="am-icon-btn"
              aria-label={account?.customer ? `Mi cuenta (${account.customer.name || account.customer.email})` : 'Mi cuenta'}
            >
              <User size={19} strokeWidth={1.75} />
            </Link>

            <Link href={ctaHref} className="am-header-cta">
              <CmsNavText f="headerCtaText" fallback="Pedir ahora" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              key={`bag-${bagPulse}`}
              className={`am-bag-btn ${bagPulse > 0 ? 'is-pulsing' : ''}`}
              aria-label="Abrir bolsa de compras"
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span className="am-bag-count">{cart.count}</span>
            </button>

            <button
              type="button"
              className="am-mobile-toggle"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="am-mobile-sheet">
            <CmsNav
              list="header"
              className="am-nav-mobile"
              renderLink={(link) => (
                <CmsNavLink link={link} list="header" as={Link} className="am-nav-mobile-link" />
              )}
            />
            <div className="am-mobile-footer">
              <Link href="/favoritos" className="am-btn am-btn-outline am-w-full">
                Mis favoritos
              </Link>
              <Link href="/cuenta" className="am-btn am-btn-outline am-w-full">
                Mi cuenta y pedidos
              </Link>
              <Link href={ctaHref} className="am-btn am-btn-primary am-w-full">
                <CmsNavText f="headerCtaText" fallback="Pedir ahora" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function CartDrawer() {
  const { cartOpen, closeCart, notify } = useStoreUi();
  const { cmsUrl } = useCms();
  const cart = useCart();
  const ui = useShopUi();
  const money = useMoney();
  const { config } = useShopConfig();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const freeThreshold = config?.freeShippingThreshold || 95000;
  const currentSub = cart.pricing?.subtotal ?? cart.subtotal;
  const remaining = Math.max(0, freeThreshold - currentSub);
  const pct = Math.min(100, Math.round((currentSub / freeThreshold) * 100));

  const freeMissingTpl = useGlobal<string>('cartFreeMissing', 'Agrega {monto} más para tener envío gratis');
  const freeDoneText = useGlobal<string>('cartFreeDone', 'Tu pedido ya incluye envío nacional gratis');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    const res = await cart.applyCoupon(couponInput.trim());
    setApplying(false);
    if (res.ok) {
      setCouponInput('');
      setCouponMsg(res.message || 'Cupón aplicado a tu bolsa.');
      notify('Cupón aplicado');
    } else {
      setCouponMsg(res.message || ui.couponInvalid);
    }
  };

  return (
    <>
      <div
        className={`am-drawer-backdrop ${cartOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden={!cartOpen}
      />
      <aside
        className={`am-drawer ${cartOpen ? 'is-open' : ''}`}
        aria-label="Bolsa de compras"
        aria-hidden={!cartOpen}
      >
        <div className="am-drawer-head">
          <h2 className="am-drawer-title">
            <CmsUiText k="cart" fallback="Tu bolsa mineral" />
          </h2>
          <button type="button" onClick={closeCart} className="am-icon-btn" aria-label="Cerrar bolsa">
            <X size={20} />
          </button>
        </div>

        <div className="am-shipping-meter">
          <p className="am-shipping-meter-label">
            {remaining > 0 ? freeMissingTpl.replace('{monto}', money(remaining)) : freeDoneText}
          </p>
          <div className="am-shipping-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span className="am-shipping-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="am-drawer-empty">
            <p>
              <CmsUiText k="emptyCart" fallback="Tu bolsa aún está vacía." />
            </p>
            <Link href="/tienda" onClick={closeCart} className="am-btn am-btn-primary">
              <CmsUiText k="continueShopping" fallback="Explorar rituales" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="am-cart-list">
              {cart.items.map((item, idx) => (
                <li key={`${item.productId}-${item.variant || ''}-${idx}`} className="am-cart-item">
                  {item.imageUrl ? (
                    <img
                      src={mediaUrl(item.imageUrl, cmsUrl)}
                      alt={item.title}
                      className="am-cart-thumb"
                      width={72}
                      height={88}
                    />
                  ) : (
                    <div className="am-cart-thumb am-cart-thumb-placeholder" />
                  )}
                  <div className="am-cart-info">
                    <div className="am-cart-row-top">
                      <strong className="am-cart-item-title">{item.title}</strong>
                      <button
                        type="button"
                        onClick={() => cart.remove(idx)}
                        className="am-cart-remove"
                        aria-label={`Quitar ${item.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {item.variant ? <span className="am-cart-variant">{item.variant}</span> : null}
                    <div className="am-cart-row-bottom">
                      <div className="am-qty-control">
                        <button
                          type="button"
                          onClick={() =>
                            item.quantity > 1 ? cart.setQuantity(idx, item.quantity - 1) : cart.remove(idx)
                          }
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="am-tabular">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(idx, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="am-cart-price am-tabular">{money(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="am-drawer-foot">
              <form onSubmit={handleApplyCoupon} className="am-coupon-form">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={ui.couponPlaceholder || 'Código promocional'}
                  className="am-input am-input-sm"
                />
                <button type="submit" disabled={applying} className="am-btn am-btn-outline am-btn-sm">
                  {applying ? '...' : ui.couponApply || 'Aplicar'}
                </button>
              </form>

              {cart.couponCodes.length > 0 ? (
                <div className="am-coupon-tags">
                  {cart.couponCodes.map((code) => (
                    <span key={code} className="am-coupon-chip">
                      {code}
                      <button type="button" onClick={() => cart.removeCoupon(code)} aria-label={`Quitar ${code}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              {couponMsg ? <p className="am-coupon-feedback">{couponMsg}</p> : null}

              <CmsPricingTotals
                pricing={cart.pricing}
                subtotal={cart.subtotal}
                shipping={currentSub >= freeThreshold ? 0 : config?.flatShippingRate ?? 5000}
                loading={cart.loading}
                className="am-pricing-totals"
              />

              <div className="am-drawer-cta-stack">
                <Link href="/checkout" onClick={closeCart} className="am-btn am-btn-primary am-w-full">
                  <CmsUiText k="checkout" fallback="Finalizar compra" />
                </Link>
                <CmsWhatsAppOrderButton className="am-btn am-btn-outline am-w-full" />
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function ToastBanner() {
  const { toast, cartOpen } = useStoreUi();
  if (!toast || cartOpen) return null;
  return (
    <div className="am-toast" role="status" aria-live="polite">
      {toast}
    </div>
  );
}

export function CookieConsentBanner() {
  const { payload } = useCms();
  const consent = useTrackingConsent();
  const g = (payload.global || {}) as Record<string, any>;
  const hasPixels = Boolean(g.gtmId || g.ga4Id || g.metaPixelId || g.tiktokPixelId);
  if (!hasPixels || !consent.visible) return null;
  return (
    <div className="am-cookie-bar" role="region" aria-label="Preferencias de cookies">
      <p className="am-cookie-text">{consent.banner.text}</p>
      <div className="am-cookie-actions">
        <button type="button" onClick={consent.reject} className="am-btn am-btn-outline am-btn-sm">
          {consent.banner.rejectLabel || 'Solo esenciales'}
        </button>
        <button type="button" onClick={consent.accept} className="am-btn am-btn-primary am-btn-sm">
          {consent.banner.acceptLabel || 'Aceptar'}
        </button>
      </div>
    </div>
  );
}

/**
 * Pie dividido (Split Footer): mitad izquierda fotográfica a sangre; mitad derecha con navegación tipográfica grande,
 * datos reales de la botica en Colombia y enlaces legales.
 */
export function Footer() {
  const social = useGlobal<Array<{ network: string; label?: string; url: string }>>('social', []);
  const email = useGlobal<string>('email', '');

  return (
    <footer className="am-footer">
      <div className="am-footer-photo-half">
        <CmsGlobalImage
          f="footerPhotoUrl"
          className="am-footer-photo"
          width={960}
          height={1080}
        />
      </div>

      <div className="am-footer-menu-half">
        <div className="am-footer-brand-row">
          <Link href="/" className="am-footer-wordmark">
            <CmsGlobalImage f="logoUrl" className="am-footer-logo" width={38} height={38} />
            <CmsGlobalText f="brandName" as="span" fallback="Alma Mineral" />
          </Link>
          <CmsGlobalText f="tagline" as="p" className="am-footer-tagline" multiline />
        </div>

        <div className="am-footer-nav-wrap">
          <CmsGlobalText f="footerNavHeading" as="p" className="am-footer-col-title" />
          <CmsNav
            list="footer"
            className="am-footer-big-nav"
            renderLink={(link) => (
              <CmsNavLink link={link} list="footer" as={Link} className="am-footer-big-link" />
            )}
          />
        </div>

        <div className="am-footer-meta-grid">
          <div className="am-footer-meta-block">
            <CmsGlobalText f="footerContactHeading" as="h3" className="am-footer-col-title" />
            <CmsGlobalText f="city" as="p" className="am-footer-meta-line" />
            <CmsGlobalText f="dispatchNote" as="p" className="am-footer-meta-line" />
            {email ? (
              <a href={`mailto:${email}`} className="am-footer-mail-link">
                <CmsGlobalText f="email" as="span" />
              </a>
            ) : null}
          </div>

          <div className="am-footer-meta-block">
            <CmsGlobalText f="footerSocialHeading" as="h3" className="am-footer-col-title" />
            <ul className="am-footer-social-list">
              {(Array.isArray(social) ? social : []).map((s, i) =>
                s?.url ? (
                  <li key={`${s.network}-${i}`}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="am-footer-social-link">
                      {s.label || s.network}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>

        <div className="am-footer-legal-row">
          <CmsGlobalText f="legalNote" as="p" className="am-footer-legal" />
        </div>
      </div>
    </footer>
  );
}
