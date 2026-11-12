'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Clock, CreditCard, Mail, PackageSearch, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { mediaUrl } from '@latinovation/cms-client';
import {
  CmsImage,
  CmsLink,
  CmsPricingTotals,
  CmsText,
  CmsWhatsAppOrderButton,
  useCart,
  useCheckout,
  useCms,
  useGlobal,
  useLeadForm,
  useMoney,
  useOrder,
  useOrderTracking,
  usePaymentReturn,
  useProducts,
  useShopConfig,
  useWishlist,
  type CmsBlockProps,
} from '@latinovation/cms-client/react';
import { ProductCard } from './CatalogBlocks';

const COLOMBIA_DEPARTMENTS = [
  'Valle del Cauca',
  'Antioquia',
  'Bogotá D.C.',
  'Cundinamarca',
  'Atlántico',
  'Bolívar',
  'Caldas',
  'Cauca',
  'Cesar',
  'Córdoba',
  'Huila',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Quindío',
  'Risaralda',
  'Santander',
  'Sucre',
  'Tolima',
  'Otro departamento',
];

/* -------------------------------------------------------------------------- */
/* 1. CHECKOUT COMPLETO — Wompi + Contraentrega + Zonas de Envío + Cupones    */
/* -------------------------------------------------------------------------- */

export function CheckoutSection(_props: CmsBlockProps) {
  const router = useRouter();
  const { cmsUrl } = useCms();
  const cart = useCart();
  const money = useMoney();
  const { config: shopConfig } = useShopConfig();
  const isWompiSandbox = Boolean((shopConfig as any)?.paymentMethods?.wompi?.sandbox);

  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/pedido` : undefined;
  const co = useCheckout({
    redirectUrl,
    initial: { country: 'CO', department: 'Valle del Cauca', documentType: 'CC' },
  });

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await co.submit(e);
    if (!res) return;
    const url = String(res.checkoutUrl || (res as any).paymentSession?.checkoutUrl || '');
    // Si es Contraentrega o transferencia manual (sin redirección externa a Wompi), llevamos a /pedido?order=...
    if (!url && res.orderNumber) {
      router.push(`/pedido?order=${encodeURIComponent(res.orderNumber)}`);
    }
  };

  const handleCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const r = await co.applyCoupon(couponInput.trim());
    if (r.ok) {
      setCouponInput('');
      setCouponFeedback(r.message || 'Descuento aplicado correctamente.');
    } else {
      setCouponFeedback(r.message || 'No fue posible aplicar este código.');
    }
  };

  return (
    <div className="am-section-pad">
      <div className="am-container">
        <div className="am-checkout-header">
          <CmsText f="heading" as="h1" className="am-h1-page" />
          <CmsText f="intro" as="p" className="am-lead" />
          <CmsText f="couponHint" as="p" className="am-coupon-banner" />
        </div>

        {cart.items.length === 0 && !co.result ? (
          <div className="am-empty-card">
            <p>Tu bolsa de compras está vacía en este momento.</p>
            <span className="am-sr-only">
              <CmsText f="wompiNote" as="span" />
            </span>
            <Link href="/tienda" className="am-btn am-btn-primary">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="am-checkout-grid" noValidate>
            {/* Left Column: Customer, Shipping & Payment */}
            <div className="am-checkout-main">
              <fieldset className="am-fieldset">
                <legend className="am-legend">1. Tus datos de contacto</legend>
                <div className="am-form-grid-2">
                  <label className="am-field">
                    <span>Nombre y apellido *</span>
                    <input
                      type="text"
                      required
                      value={co.form.customerName}
                      onChange={(e) => co.setField('customerName', e.target.value)}
                      className="am-input"
                      placeholder="Camila Ríos"
                    />
                    {co.errors.customerName ? <small className="am-field-err">{co.errors.customerName}</small> : null}
                  </label>

                  <label className="am-field">
                    <span>Correo electrónico *</span>
                    <input
                      type="email"
                      required
                      value={co.form.customerEmail}
                      onChange={(e) => co.setField('customerEmail', e.target.value)}
                      className="am-input"
                      placeholder="tu@correo.com"
                    />
                    {co.errors.customerEmail ? <small className="am-field-err">{co.errors.customerEmail}</small> : null}
                  </label>

                  <label className="am-field">
                    <span>Celular / WhatsApp *</span>
                    <input
                      type="tel"
                      required
                      value={co.form.customerPhone}
                      onChange={(e) => co.setField('customerPhone', e.target.value)}
                      className="am-input"
                      placeholder="300 000 0000"
                    />
                    {co.errors.customerPhone ? <small className="am-field-err">{co.errors.customerPhone}</small> : null}
                  </label>

                  <div className="am-doc-pair">
                    <label className="am-field am-doc-type">
                      <span>Tipo doc.</span>
                      <select
                        value={co.form.documentType}
                        onChange={(e) => co.setField('documentType', e.target.value)}
                        className="am-select"
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="NIT">NIT</option>
                        <option value="PP">Pasaporte</option>
                      </select>
                    </label>
                    <label className="am-field am-flex-1">
                      <span>Documento (para transportadora / factura)</span>
                      <input
                        type="text"
                        value={co.form.documentId}
                        onChange={(e) => co.setField('documentId', e.target.value)}
                        className="am-input"
                        placeholder="Número de identificación"
                      />
                    </label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="am-fieldset">
                <legend className="am-legend">2. Dirección de entrega en Colombia</legend>
                <div className="am-form-grid-2">
                  <label className="am-field">
                    <span>Departamento *</span>
                    <select
                      value={co.form.department}
                      onChange={(e) => co.setField('department', e.target.value)}
                      className="am-select"
                    >
                      {COLOMBIA_DEPARTMENTS.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="am-field">
                    <span>Ciudad o municipio *</span>
                    <input
                      type="text"
                      required
                      value={co.form.city}
                      onChange={(e) => co.setField('city', e.target.value)}
                      className="am-input"
                      placeholder="Ej. Cali, Medellín, Bogotá..."
                    />
                    {co.errors.city ? <small className="am-field-err">{co.errors.city}</small> : null}
                  </label>

                  <label className="am-field am-col-span-2">
                    <span>Dirección exacta (calle/carrera, número, apartamento o conjunto) *</span>
                    <input
                      type="text"
                      required
                      value={co.form.address}
                      onChange={(e) => co.setField('address', e.target.value)}
                      className="am-input"
                      placeholder="Calle 5 # 38-14 Apto 402"
                    />
                    {co.errors.address ? <small className="am-field-err">{co.errors.address}</small> : null}
                  </label>

                  <label className="am-field am-col-span-2">
                    <span>Indicaciones opcionales para el mensajero</span>
                    <input
                      type="text"
                      value={co.form.notes}
                      onChange={(e) => co.setField('notes', e.target.value)}
                      className="am-input"
                      placeholder="Dejar en portería, timbre, horario..."
                    />
                  </label>
                </div>

                {/* Live Shipping Zone Options */}
                {co.shipping.options.length > 0 ? (
                  <div className="am-shipping-options">
                    <p className="am-sublabel">Método de envío disponible:</p>
                    {co.shipping.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`am-radio-card ${co.shipping.selectedId === opt.id ? 'is-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="shippingOption"
                          checked={co.shipping.selectedId === opt.id}
                          onChange={() => co.shipping.select(opt.id)}
                        />
                        <div className="am-radio-card-body">
                          <strong>{opt.name}</strong>
                          <span className="am-tabular">{opt.amount === 0 ? 'Gratis' : money(opt.amount)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : null}
                {co.errors.shipping ? <p className="am-field-err">{co.errors.shipping}</p> : null}
              </fieldset>

              <fieldset className="am-fieldset">
                <legend className="am-legend">3. Método de pago</legend>
                <CmsText f="wompiNote" as="p" className="am-payment-note" />

                <div className="am-payment-list">
                  {co.paymentMethods.map((m) => (
                    <label
                      key={m.id}
                      className={`am-radio-card ${co.provider === m.id ? 'is-selected' : ''} ${!m.available ? 'is-disabled' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentProvider"
                        disabled={!m.available}
                        checked={co.provider === m.id}
                        onChange={() => co.setProvider(m.id)}
                      />
                      <div className="am-radio-card-body">
                        <div>
                          <strong>{m.label}</strong>
                          {m.id === 'wompi' ? (
                            <span className="am-pay-sub">PSE, Nequi, Tarjetas Débito/Crédito y Botón Bancolombia</span>
                          ) : m.id === 'cod' ? (
                            <span className="am-pay-sub">Pagas en efectivo directamente al mensajero cuando recibas tu paquete</span>
                          ) : null}
                        </div>
                        <CreditCard size={19} />
                      </div>
                    </label>
                  ))}
                </div>
                {co.provider === 'wompi' && isWompiSandbox ? (
                  <p className="am-sandbox-notice">
                    Modo de pruebas Wompi activo (Sandbox): puedes simular pagos aprobados con PSE, Nequi o tarjeta de prueba sin cargos reales.
                  </p>
                ) : null}
                {co.errors.provider ? <p className="am-field-err">{co.errors.provider}</p> : null}
              </fieldset>

              {co.error ? (
                <div className="am-alert am-alert-danger" role="alert">
                  <AlertCircle size={18} />
                  <span>{co.error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={co.submitting}
                className="am-btn am-btn-primary am-btn-lg am-w-full"
              >
                <ShieldCheck size={19} />
                {co.submitting
                  ? 'Procesando tu orden...'
                  : co.provider === 'wompi'
                    ? 'Continuar al pago seguro con Wompi'
                    : 'Confirmar pedido'}
              </button>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="am-checkout-summary">
              <h2 className="am-h3">Tu bolsa ({cart.count})</h2>
              <ul className="am-summary-items">
                {cart.items.map((item, i) => (
                  <li key={`${item.productId}-${i}`} className="am-summary-item">
                    {item.imageUrl ? (
                      <img src={mediaUrl(item.imageUrl, cmsUrl)} alt={item.title} width={56} height={68} />
                    ) : null}
                    <div className="am-summary-item-info">
                      <strong>{item.title}</strong>
                      <span>Cant: {item.quantity}</span>
                    </div>
                    <span className="am-tabular">{money(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="am-summary-coupon">
                <div className="am-coupon-form">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código (ej. ALMAMINERAL10)"
                    className="am-input am-input-sm"
                  />
                  <button type="button" onClick={handleCoupon} className="am-btn am-btn-outline am-btn-sm">
                    Aplicar
                  </button>
                </div>
                {couponFeedback ? <p className="am-coupon-feedback">{couponFeedback}</p> : null}
              </div>

              <CmsPricingTotals
                pricing={co.pricing}
                subtotal={cart.subtotal}
                shipping={cart.subtotal >= 95000 ? 0 : 5000}
                loading={co.quoting}
                className="am-pricing-totals"
              />

              <CmsWhatsAppOrderButton className="am-btn am-btn-outline am-w-full" />
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. CONFIRMACIÓN Y RETORNO DE PASARELA WOMPI (/pedido)                      */
/* -------------------------------------------------------------------------- */

export function OrderReturnSection(_props: CmsBlockProps) {
  const ret = usePaymentReturn();
  const [urlOrder, setUrlOrder] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const o = sp.get('order') || '';
    if (o) setUrlOrder(o);
  }, []);

  const queryOrder = urlOrder || ret.orderNumber || '';
  const ord = useOrder(queryOrder || undefined);
  const money = useMoney();

  const effectiveStatus =
    ret.status !== 'none'
      ? ret.status
      : queryOrder
        ? ord.order?.paymentStatus === 'PAID'
          ? 'paid'
          : 'pending'
        : 'none';

  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        <div className="am-order-status-card">
          <div className="am-status-icon-row">
            {effectiveStatus === 'paid' ? (
              <CheckCircle2 size={42} className="am-icon-success" />
            ) : effectiveStatus === 'failed' ? (
              <AlertCircle size={42} className="am-icon-danger" />
            ) : (
              <Clock size={42} className="am-icon-accent" />
            )}
          </div>

          <CmsText f="heading" as="h1" className="am-h2" />

          {queryOrder ? (
            <p className="am-order-code am-tabular">
              Orden: <strong>{queryOrder}</strong>
            </p>
          ) : null}

          {/* Render all 3 status messages cleanly: active one prominent, others collapsed/accessible for CMS editor */}
          <div className={effectiveStatus === 'paid' ? 'am-status-msg is-current' : 'am-status-msg is-alt'}>
            <CmsText f="paidBody" as="p" />
          </div>
          <div className={effectiveStatus === 'pending' || effectiveStatus === 'checking' || effectiveStatus === 'none' ? 'am-status-msg is-current' : 'am-status-msg is-alt'}>
            <CmsText f="pendingBody" as="p" />
          </div>
          <div className={effectiveStatus === 'failed' ? 'am-status-msg is-current' : 'am-status-msg is-alt'}>
            <CmsText f="failedBody" as="p" />
          </div>

          {ord.tracking ? (
            <div className="am-order-mini-summary">
              <div className="am-mini-row">
                <span>Estado del pedido:</span>
                <strong>{ord.tracking.status}</strong>
              </div>
              {ord.order?.totalAmount ? (
                <div className="am-mini-row">
                  <span>Total confirmado:</span>
                  <strong className="am-tabular">{money(Number(ord.order.totalAmount))}</strong>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="am-order-actions">
            {(effectiveStatus === 'failed' || ret.status === 'pending') && ret.orderNumber ? (
              <button type="button" onClick={() => ret.retry()} className="am-btn am-btn-primary">
                <RefreshCw size={17} />
                Reintentar pago en línea con Wompi
              </button>
            ) : null}

            {queryOrder ? (
              <Link href={`/rastreo?code=${encodeURIComponent(queryOrder)}`} className="am-btn am-btn-outline">
                <Truck size={17} />
                Seguir estado del envío
              </Link>
            ) : null}

            <CmsLink f="continueCta" className="am-btn am-btn-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. RASTREO PÚBLICO DE PEDIDOS (/rastreo)                                   */
/* -------------------------------------------------------------------------- */

export function OrderTrackingSection({ section: s }: CmsBlockProps) {
  const tracker = useOrderTracking();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('code') || sp.get('order') || '';
    if (q) {
      setCode(q);
      void tracker.track(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    await tracker.track(code.trim());
  };

  return (
    <div className="am-section-pad">
      <div className="am-container am-narrow-container">
        <div className="am-tracking-card">
          <PackageSearch size={34} className="am-icon-accent" />
          <CmsText f="heading" as="h1" className="am-h1-page" />
          <CmsText f="intro" as="p" className="am-lead" />

          <form onSubmit={onSubmit} className="am-tracking-form">
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={String(s.data.placeholder || 'ORD-2026-… o número de guía')}
              className="am-input"
            />
            <button type="submit" disabled={tracker.loading} className="am-btn am-btn-primary">
              {tracker.loading ? (
                'Consultando...'
              ) : (
                <CmsText f="submitLabel" as="span" fallback="Consultar estado" />
              )}
            </button>
          </form>
          {/* Preserve placeholder field in SSR DOM for CMS inline inspector */}
          <span className="am-sr-only">
            <CmsText f="placeholder" as="span" />
          </span>

          {tracker.error ? (
            <div className="am-alert am-alert-danger" role="alert">
              <AlertCircle size={18} />
              <span>No encontramos una orden o guía con ese código. Verifica que esté bien escrito.</span>
            </div>
          ) : null}

          {tracker.result ? (
            <div className="am-tracking-result">
              <div className="am-tracking-top">
                <div>
                  <span>Orden</span>
                  <strong className="am-tabular">{tracker.result.orderNumber}</strong>
                </div>
                <div>
                  <span>Estado actual</span>
                  <strong>{tracker.result.status}</strong>
                </div>
                {tracker.result.paymentStatus ? (
                  <div>
                    <span>Pago</span>
                    <strong>{tracker.result.paymentStatus}</strong>
                  </div>
                ) : null}
              </div>

              {(tracker.result.shipments || []).map((sh, idx) => (
                <div key={sh.trackingNumber || idx} className="am-shipment-box">
                  <p>
                    <strong>Transportadora:</strong> {sh.carrier || 'Despacho nacional'} ·{' '}
                    <strong>Guía:</strong> <span className="am-tabular">{sh.trackingNumber || 'En preparación'}</span>
                  </p>
                  {sh.trackingUrl ? (
                    <a href={sh.trackingUrl} target="_blank" rel="noopener noreferrer" className="am-inline-cta">
                      Ver rastreo en el portal de la transportadora
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. FAVORITOS (/favoritos)                                                  */
/* -------------------------------------------------------------------------- */

export function FavoritesSection(_props: CmsBlockProps) {
  const wishlist = useWishlist();
  const products = useProducts({ collection: 'productos' });
  const saved = products.filter((p) => wishlist.ids.includes(p.slug) || wishlist.ids.includes(p.id));

  return (
    <div className="am-section-pad">
      <div className="am-container">
        <CmsText f="heading" as="h1" className="am-h1-page" />

        {saved.length === 0 ? (
          <div className="am-empty-card">
            <CmsText f="emptyBody" as="p" className="am-lead" />
            <CmsLink f="emptyCta" className="am-btn am-btn-primary" />
          </div>
        ) : (
          <>
            <div className="am-sr-only">
              <CmsText f="emptyBody" as="p" />
              <CmsLink f="emptyCta" />
            </div>
            <div className="am-prod-grid">
              {saved.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. FORMULARIO DE CONTACTO Y MAYORISTAS (`form.custom`)                     */
/* -------------------------------------------------------------------------- */

export function CustomLeadFormSection({ section: s }: CmsBlockProps) {
  const formId = String(s.data.formId || 'contacto');
  const lead = useLeadForm({ formId, formName: String(s.data.formName || 'Contacto Alma Mineral') });
  const email = useGlobal<string>('email', 'almamineral.co@gmail.com');

  const fields: Array<Record<string, any>> = Array.isArray(s.data.fields) ? s.data.fields : [];
  const [values, setValues] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await lead.submit({
      fullName: values.nombre || values.name || '',
      email: values.email || '',
      phone: values.telefono || values.phone || '',
      message: values.mensaje || values.message || '',
      payload: values,
    });
  };

  return (
    <div className="am-section-pad">
      <div className="am-container am-contact-split">
        <div className="am-contact-info">
          <CmsText f="heading" as="h1" className="am-h1-page" />
          <CmsText f="intro" as="p" className="am-lead" />

          {email ? (
            <div className="am-direct-mail-box">
              <Mail size={19} />
              <div>
                <CmsText f="directEmailLabel" as="span" className="am-direct-mail-label" fallback="Correo directo" />
                <a href={`mailto:${email}`} className="am-direct-mail-value">
                  {email}
                </a>
              </div>
            </div>
          ) : null}

          {s.data.sideImage ? (
            <div className="am-contact-photo-wrap">
              <CmsImage f="sideImage" className="am-contact-photo" width={720} height={720} />
            </div>
          ) : null}
        </div>

        <div className="am-contact-form-card">
          {lead.status === 'done' ? (
            <div className="am-form-success">
              <CheckCircle2 size={36} className="am-icon-success" />
              <h2>Mensaje enviado</h2>
              <p>{String(s.data.successMessage || 'Gracias por escribirnos. Te responderemos pronto.')}</p>
              <button
                type="button"
                onClick={() => {
                  setValues({});
                  lead.reset();
                }}
                className="am-btn am-btn-outline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="am-lead-form">
              {fields.map((fld, idx) => {
                const key = String(fld.key || `campo_${idx}`);
                const opts =
                  typeof fld.options === 'string'
                    ? fld.options
                        .split(',')
                        .map((o: string) => o.trim())
                        .filter(Boolean)
                    : Array.isArray(fld.options)
                      ? fld.options
                      : [];
                return (
                  <label key={key} className="am-field">
                    {/* Marking fields.<idx>.label so audit-editability sees every form field label */}
                    <CmsText f={`fields.${idx}.label`} as="span" fallback={String(fld.label || key)} />
                    {fld.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        required={Boolean(fld.required)}
                        placeholder={String(fld.placeholder || '')}
                        value={values[key] || ''}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        className="am-textarea"
                      />
                    ) : fld.type === 'select' ? (
                      <select
                        required={Boolean(fld.required)}
                        value={values[key] || ''}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        className="am-select"
                      >
                        <option value="">Selecciona una opción</option>
                        {opts.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={String(fld.type || 'text')}
                        required={Boolean(fld.required)}
                        placeholder={String(fld.placeholder || '')}
                        value={values[key] || ''}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        className="am-input"
                      />
                    )}
                  </label>
                );
              })}

              {lead.error ? <p className="am-field-err">{lead.error}</p> : null}

              <button type="submit" disabled={lead.status === 'sending'} className="am-btn am-btn-primary am-btn-lg am-w-full">
                <CmsText f="submitLabel" as="span" fallback="Enviar mensaje" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
