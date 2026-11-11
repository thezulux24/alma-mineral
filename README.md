# Alma Mineral · Storefront Headless sobre WebProAI CMS Studio

Tienda en línea rediseñada para **Alma Mineral** (`almamineral`), construida con **Next.js 15 (App Router, `output: 'standalone'`)**, **`@latinovation/cms-client` v4.4.0**, animaciones con **GSAP + ScrollTrigger** e integración nativa de pedidos, envíos, cupones y pagos con **Wompi** y **Contraentrega**.

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:3025
```

## Flujo con WebProAI CMS Studio

```bash
npm run cms:pull  # Descarga snapshot y tipos desde el CMS
npm run cms:build # Regenera el manifiesto local (cms/seed/build-manifest.mjs)
npm run cms:diff  # Previsualiza cambios sin sobrescribir
npm run cms:push  # Sincroniza páginas, globales, navegación y Design System (--skip-collections)
npm run cms:audit # Audita cobertura de editabilidad en vivo (>= 95 %)
```

## Activación de Wompi en producción

1. Ingresa al portal del CMS en `/portal?project=almamineral` → **Tienda → Pasarelas de pago → Wompi**.
2. Pega tus llaves de producción (`pub_prod_…`, `prod_integrity_…`, `prod_events_…`) y desactiva el modo pruebas (`sandbox`).
3. En el panel de comercios de Wompi configura la URL de eventos:
   `https://webproai.tech/api/ecommerce/webhooks/almamineral/wompi`
4. El selector del checkout mostrará automáticamente **Wompi (PSE, Nequi, Tarjetas, Bancolombia)** como primera opción junto a **Pago contraentrega**.
