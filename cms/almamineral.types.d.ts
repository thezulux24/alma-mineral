/**
 * Generado por ltn v5.0.0 (ltn pull). No editar a mano.
 * Proyecto: Alma Mineral (almamineral) · 2026-11-12T01:02:10.073Z
 * Tipos base del payload: import type { DeliveryPayload } from "@latinovation/cms-client"
 */

export interface CmsSectionMeta {
  _block?: string;
  _style?: Record<string, unknown>;
  _elementStyles?: Record<string, Record<string, unknown>>;
  _customCss?: string;
  _customHtml?: string;
  widgets?: Array<Record<string, unknown>>;
}

/** Escenario cinemático con tipografía en movimiento y aparición del frasco (/) */
export interface HeroEscenarioSection extends CmsSectionMeta {
  headline?: string;
  subheadline?: string;
  scrollCue?: string;
  manifestoLine1?: string;
  manifestoLine2?: string;
  manifestoLine3?: string;
  callouts?: Array<{ title?: string; detail?: string }>;
  ritualLabel?: string;
  primaryCta?: string | { href: string; label?: string };
  buyButtonLabel?: string;
  bottleCutout?: string;
  bottleCutoutAlt?: string;
  stageSlides?: Array<{ image?: string; imageAlt?: string; caption?: string }>;
  barLeft?: string;
  barRight?: string;
}

/** Presentaciones y packs rituales · bloque products.catalog (/) */
export interface RitualesCatalogoSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  source?: string;
  showFilters?: boolean;
  columns?: "2" | "3" | "4";
  featuredOnly?: boolean;
  paginate?: boolean;
  pageSize?: number;
  showSort?: boolean;
  showSearch?: boolean;
  whatsappOrder?: boolean;
  showRatings?: boolean;
  showWishlist?: boolean;
  moreLink?: string | { href: string; label?: string };
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Comparador molecular del poro (/) */
export interface CienciaPoroSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  alumTabLabel?: string;
  alumTitle?: string;
  alumSummary?: string;
  alumPoints?: Array<{ text?: string }>;
  alumMoleculeLabel?: string;
  synthTabLabel?: string;
  synthTitle?: string;
  synthSummary?: string;
  synthPoints?: Array<{ text?: string }>;
  synthMoleculeLabel?: string;
  diagramCaption?: string;
  cta?: string | { href: string; label?: string };
}

/** Herbario fijo: los 7 ingredientes de la fórmula (/) */
export interface HerbarioMineralSection extends CmsSectionMeta {
  heading?: string;
  lead?: string;
  pinnedBottle?: string;
  pinnedBottleAlt?: string;
  chapters?: Array<{ title?: string; role?: string; image?: string; imageAlt?: string; notes?: Array<{ line?: string }> }>;
}

/** Galería deslizable de escenas reales (/) */
export interface GaleriaRitualSection extends CmsSectionMeta {
  heading?: string;
  countSuffix?: string;
  frames?: Array<{ kind?: "tall" | "wide"; image?: string; imageAlt?: string }>;
}

/** Retrato y cita desplazada: visión integrativa (/) */
export interface RespaldoIntegrativoSection extends CmsSectionMeta {
  portrait?: string;
  portraitAlt?: string;
  quote?: string;
  authorName?: string;
  authorRole?: string;
  detailImage?: string;
  detailImageAlt?: string;
}

/** Preguntas frecuentes · bloque faq.accordion (/) */
export interface PreguntasSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  items?: Array<{ question?: string; answer?: string }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Fotografía final a sangre con llamado al ritual (/) */
export interface CierreBoticaSection extends CmsSectionMeta {
  image?: string;
  imageAlt?: string;
  heading?: string;
  body?: string;
  cta?: string | { href: string; label?: string };
}

/** Catálogo de la tienda · bloque products.catalog (/tienda) */
export interface CatalogoTiendaSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  source?: string;
  showFilters?: boolean;
  columns?: "2" | "3" | "4";
  featuredOnly?: boolean;
  paginate?: boolean;
  pageSize?: number;
  showSort?: boolean;
  showSearch?: boolean;
  whatsappOrder?: boolean;
  showRatings?: boolean;
  showWishlist?: boolean;
  moreLink?: string | { href: string; label?: string };
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Condiciones claras de compra · bloque features.grid (/tienda) */
export interface PromesaEnvioSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  columns?: "2" | "3" | "4";
  items?: Array<{ icon?: "none" | "check" | "shield" | "clock" | "truck" | "heart" | "leaf" | "map-pin" | "phone" | "users" | "award" | "wrench" | "calendar" | "credit-card" | "book" | "home" | "chart" | "message" | "globe" | "zap" | "camera" | "star" | "coffee" | "stethoscope" | "graduation" | "briefcase" | "lock" | "code"; title?: string; body?: string; link?: string | { href: string; label?: string } }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** El origen de Alma Mineral · bloque content.split (/nuestra-historia) */
export interface OrigenHeroSection extends CmsSectionMeta {
  heading?: string;
  body?: string;
  cta?: string | { href: string; label?: string };
  image?: string;
  imageAlt?: string;
  imageSide?: "right" | "left";
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Tres decisiones de oficio · bloque features.alternating (/nuestra-historia) */
export interface FilosofiaBoticaSection extends CmsSectionMeta {
  heading?: string;
  items?: Array<{ title?: string; body?: string; image?: string; imageAlt?: string; link?: string | { href: string; label?: string } }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Llamado a la tienda · bloque cta.banner (/nuestra-historia) */
export interface OrigenCierreSection extends CmsSectionMeta {
  headline?: string;
  body?: string;
  primaryCta?: string | { href: string; label?: string };
  secondaryCta?: string | { href: string; label?: string };
  image?: string;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Transpirar es salud · bloque content.split (/ciencia-mineral) */
export interface CienciaIntroSection extends CmsSectionMeta {
  heading?: string;
  body?: string;
  cta?: string | { href: string; label?: string };
  image?: string;
  imageAlt?: string;
  imageSide?: "right" | "left";
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Comparador molecular del poro (/ciencia-mineral) */
export interface ComparadorMolecularSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  alumTabLabel?: string;
  alumTitle?: string;
  alumSummary?: string;
  alumPoints?: Array<{ text?: string }>;
  alumMoleculeLabel?: string;
  synthTabLabel?: string;
  synthTitle?: string;
  synthSummary?: string;
  synthPoints?: Array<{ text?: string }>;
  synthMoleculeLabel?: string;
  diagramCaption?: string;
  cta?: string | { href: string; label?: string };
}

/** Cómo hacer el cambio en tres pasos · bloque steps.process (/ciencia-mineral) */
export interface GuiaTransicionSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  items?: Array<{ title?: string; body?: string }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Formulario de contacto y alianzas · bloque form.custom (/contacto) */
export interface ContactoFormularioSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  formId?: string;
  fields?: Array<{ key?: string; label?: string; type?: "text" | "email" | "tel" | "textarea" | "select" | "radio" | "checkbox" | "date" | "number" | "file"; required?: boolean; options?: string; placeholder?: string; help?: string; width?: "full" | "half" }>;
  submitLabel?: string;
  successMessage?: string;
  redirectTo?: string;
  notifyEmails?: string;
  webhookUrl?: string;
  layout?: "stacked" | "split";
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
  sideImage?: string;
  sideImageAlt?: string;
  directEmailLabel?: string;
}

/** Rastreo de pedido · bloque tracking.order (/rastreo) */
export interface RastreoPedidoSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Checkout de la tienda (/checkout) */
export interface PagoCheckoutSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  couponHint?: string;
  wompiNote?: string;
}

/** Confirmación y estado del pago (/pedido) */
export interface ConfirmacionPedidoSection extends CmsSectionMeta {
  heading?: string;
  paidBody?: string;
  pendingBody?: string;
  failedBody?: string;
  continueCta?: string | { href: string; label?: string };
}

/** Presentaciones guardadas (/favoritos) */
export interface ListaFavoritosSection extends CmsSectionMeta {
  heading?: string;
  emptyBody?: string;
  emptyCta?: string | { href: string; label?: string };
}

/** Acceso y resumen de cuenta (/cuenta) */
export interface CuentaAccesoSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
}

/** Historial de pedidos del cliente (/cuenta/pedidos) */
export interface CuentaPedidosSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
}

/** Direcciones guardadas (/cuenta/direcciones) */
export interface CuentaDireccionesSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
}

/** Cambio de contraseña con enlace seguro (/cuenta/restablecer) */
export interface CuentaRestablecerSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
}

/** Políticas legales y al consumidor · bloque content.richtext (/privacidad) */
export interface PoliticaTextoSection extends CmsSectionMeta {
  body?: string;
  width?: "narrow" | "wide";
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

export interface CmsSectionsByKey {
  "hero_escenario": HeroEscenarioSection;
  "rituales_catalogo": RitualesCatalogoSection;
  "ciencia_poro": CienciaPoroSection;
  "herbario_mineral": HerbarioMineralSection;
  "galeria_ritual": GaleriaRitualSection;
  "respaldo_integrativo": RespaldoIntegrativoSection;
  "preguntas": PreguntasSection;
  "cierre_botica": CierreBoticaSection;
  "catalogo_tienda": CatalogoTiendaSection;
  "promesa_envio": PromesaEnvioSection;
  "origen_hero": OrigenHeroSection;
  "filosofia_botica": FilosofiaBoticaSection;
  "origen_cierre": OrigenCierreSection;
  "ciencia_intro": CienciaIntroSection;
  "comparador_molecular": ComparadorMolecularSection;
  "guia_transicion": GuiaTransicionSection;
  "contacto_formulario": ContactoFormularioSection;
  "rastreo_pedido": RastreoPedidoSection;
  "pago_checkout": PagoCheckoutSection;
  "confirmacion_pedido": ConfirmacionPedidoSection;
  "lista_favoritos": ListaFavoritosSection;
  "cuenta_acceso": CuentaAccesoSection;
  "cuenta_pedidos": CuentaPedidosSection;
  "cuenta_direcciones": CuentaDireccionesSection;
  "cuenta_restablecer": CuentaRestablecerSection;
  "politica_texto": PoliticaTextoSection;
}

/** Colección Productos (productos) */
export interface ProductosItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  badge?: string;
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  stock?: number;
  unitsCount?: number;
  volume?: string;
  category?: "Desodorante Individual" | "Packs Rituales";
  imageUrl?: string;
  gallery?: string[];
  summary?: string;
  description?: string;
  ingredientsList?: string;
  howToUse?: string;
  skinType?: string;
  aroma?: string;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  brand?: string;
  gtin?: string;
  related?: string;
  isDigital?: boolean;
  variants?: Array<{ label?: string; price?: number; stock?: number; sku?: string; weightKg?: number }>;
}
