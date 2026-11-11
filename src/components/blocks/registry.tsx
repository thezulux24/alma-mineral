'use client';

import React from 'react';
import { CmsPage, defaultRegistry, type CmsRegistry } from '@latinovation/cms-client/react';
import {
  CienciaPoro,
  CierreBotica,
  GaleriaRitual,
  HerbarioMineral,
  HeroEscenario,
  RespaldoIntegrativo,
} from './HomeBlocks';
import { ProductsCatalogSection } from './CatalogBlocks';
import {
  CheckoutSection,
  CustomLeadFormSection,
  FavoritesSection,
  OrderReturnSection,
  OrderTrackingSection,
} from './StorePages';
import {
  AccountAccessSection,
  AccountAddressesSection,
  AccountOrdersSection,
  AccountResetSection,
} from './AccountBlocks';
import {
  ContentSplitBlock,
  CtaBannerBlock,
  FaqAccordionBlock,
  FeaturesAlternatingBlock,
  FeaturesGridBlock,
  GenericSection,
  RichTextSectionBlock,
  StepsProcessBlock,
} from './GenericBlocks';

export const registry: CmsRegistry = {
  ...defaultRegistry,
  // Secciones de autor de Alma Mineral
  hero_escenario: HeroEscenario,
  ciencia_poro: CienciaPoro,
  comparador_molecular: CienciaPoro,
  herbario_mineral: HerbarioMineral,
  galeria_ritual: GaleriaRitual,
  respaldo_integrativo: RespaldoIntegrativo,
  cierre_botica: CierreBotica,

  // Secciones de tienda, pagos y cuenta
  pago_checkout: CheckoutSection,
  confirmacion_pedido: OrderReturnSection,
  rastreo_pedido: OrderTrackingSection,
  lista_favoritos: FavoritesSection,
  cuenta_acceso: AccountAccessSection,
  cuenta_pedidos: AccountOrdersSection,
  cuenta_direcciones: AccountAddressesSection,
  cuenta_restablecer: AccountResetSection,

  // Tipos del catálogo estándar de WebProAI CMS (y bloques añadidos desde /portal)
  hero: HeroEscenario,
  'hero.split': HeroEscenario,
  'products.catalog': ProductsCatalogSection,
  'collection.list': ProductsCatalogSection,
  'content.split': ContentSplitBlock,
  'content.richtext': RichTextSectionBlock,
  'features.alternating': FeaturesAlternatingBlock,
  'features.grid': FeaturesGridBlock,
  'steps.process': StepsProcessBlock,
  'faq.accordion': FaqAccordionBlock,
  'cta.banner': CtaBannerBlock,
  'form.custom': CustomLeadFormSection,
  'contact.form': CustomLeadFormSection,
  'tracking.order': OrderTrackingSection,
};

export function SitePage({ pageSlug }: { pageSlug: string }) {
  return (
    <CmsPage
      pageSlug={pageSlug}
      registry={registry}
      fallback={GenericSection}
      sectionClassName={(s) => `am-sec am-sec--${s.key}`}
    />
  );
}
