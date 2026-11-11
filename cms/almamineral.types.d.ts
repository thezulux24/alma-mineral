/**
 * Generado por ltn v5.0.0 (ltn pull). No editar a mano.
 * Proyecto: Alma Mineral (almamineral) · 2026-11-11T20:40:58.993Z
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

/** Portada · bloque hero.split (/) */
export interface HeroSection extends CmsSectionMeta {
  headline?: string;
  subheadline?: string;
  primaryCta?: string | { href: string; label?: string };
  secondaryCta?: string | { href: string; label?: string };
  image?: string;
  imageAlt?: string;
  imageSide?: "right" | "left";
  highlights?: Array<{ text?: string }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Más vendidos · bloque products.catalog (/) */
export interface DestacadosSection extends CmsSectionMeta {
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

/** Envíos y pagos · bloque features.grid (/) */
export interface EnviosSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  columns?: "2" | "3" | "4";
  items?: Array<{ icon?: "none" | "check" | "shield" | "clock" | "truck" | "heart" | "leaf" | "map-pin" | "phone" | "users" | "award" | "wrench" | "calendar" | "credit-card" | "book" | "home" | "chart" | "message" | "globe" | "zap" | "camera" | "star" | "coffee" | "stethoscope" | "graduation" | "briefcase" | "lock" | "code"; title?: string; body?: string; link?: string | { href: string; label?: string } }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Quiénes somos · bloque content.split (/) */
export interface NosotrosSection extends CmsSectionMeta {
  heading?: string;
  body?: string;
  cta?: string | { href: string; label?: string };
  image?: string;
  imageAlt?: string;
  imageSide?: "right" | "left";
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Catálogo · bloque products.catalog (/) */
export interface CatalogoSection extends CmsSectionMeta {
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

/** Preguntas frecuentes · bloque faq.accordion (/) */
export interface PreguntasSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  items?: Array<{ question?: string; answer?: string }>;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Boletín · bloque newsletter.signup (/) */
export interface BoletinSection extends CmsSectionMeta {
  heading?: string;
  body?: string;
  placeholder?: string;
  submitLabel?: string;
  successMessage?: string;
  formName?: string;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

/** Catálogo completo · bloque products.catalog (/catalogo) */
export interface CatalogoCompletoSection extends CmsSectionMeta {
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

/** Rastreo · bloque tracking.order (/rastreo) */
export interface RastreoSection extends CmsSectionMeta {
  heading?: string;
  intro?: string;
  tone?: "default" | "alt" | "inverse" | "accent";
  anchor?: string;
}

export interface CmsSectionsByKey {
  "hero": HeroSection;
  "destacados": DestacadosSection;
  "envios": EnviosSection;
  "nosotros": NosotrosSection;
  "catalogo": CatalogoSection;
  "preguntas": PreguntasSection;
  "boletin": BoletinSection;
  "catalogo_completo": CatalogoCompletoSection;
  "rastreo": RastreoSection;
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
