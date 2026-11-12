# Alma Mineral — Dirección de Arte y Sistema de Diseño (`DESIGN.md`)

## 1. Concepto rector: *Nocturne Botanical Cinema & Atelier D2C*
> «Inspirado en el scrollytelling cinematográfico de perfumería y botánica de autor (*Aesop, Salt & Stone, Corpus Naturals, Apple Product Stage*), el storefront de Alma Mineral abre sobre un escenario nocturno en obsidiana botánica (`#07110C`) donde el desplazamiento ensambla tipografía cinética palabra por palabra, hace emerger el frasco ámbar recortado con sus activos fitoterapéuticos y culmina en un selector de rituales de alta conversión antes de desplegar la tienda luminosa en alabastro mineral».

## 2. Sistema cromático (Design System v2 del CMS · contraste WCAG AA/AAA)
Todos los tokens viven en `globalData.designSystem` de WebProAI CMS Studio y se inyectan como variables `--cms-*`:
- **Obsidiana botánica de escenario (`hero_escenario` + header)**: `#07110C` / `#0F2117` con acentos champaña `#E5C478`
- **Alabastro mineral (`--cms-color-bg`)**: `#F2F4F1`
- **Porcelana pura (`--cms-color-surface`)**: `#FFFFFF`
- **Piedra salvia (`--cms-color-surface-alt`)**: `#E6EAE4`
- **Tinta bosque profundo (`--cms-color-text`)**: `#121814` (contraste `> 15:1`)
- **Salvia mineral (`--cms-color-muted`)**: `#4A544D` (contraste `> 6.2:1`)
- **Verde esmeralda de botica (`--cms-color-primary`)**: `#14261B` con texto `#FAF8F5` (`> 14:1`)
- **Ámbar tostado (`--cms-color-secondary`)**: `#6B4226` con texto `#FAF8F5`
- **Oro cristal de alumbre (`--gold` / `--cms-color-accent`)**: `#E5C478` / `#6E5015`

## 3. Tipografía y jerarquía editorial + D2C
- **Titulares y manifiesto cinético (`--cms-font-heading`)**: `Cormorant Garamond` (`500, 600, 700` + `italic`), `letter-spacing: -0.025em`, `line-height: 0.94–1.05`.
- **Interfaz, lectura, precios y CTAs (`--cms-font-body`)**: `Plus Jakarta Sans` (`400, 500, 600, 700`), escala disciplinada de 5 niveles (`>= 14px`) y `font-variant-numeric: tabular-nums` en todos los precios, ahorros, contadores y totales de checkout.
- **Encuadres fotográficos**: recorte alfa en estudio del frasco ámbar (`bottleCutout`, `828×1390` RGBA) como escultura central y control explícito de `object-position` en retratos clínicos y bodegones.

## 4. Coreografía GSAP + ScrollTrigger (100 % editable en CMS)
1. **Escenario Pinned Scrollytelling de 4 tiempos (`hero_escenario`)**:
   - **Tiempo 1 (Apertura)**: titular monumental con máscaras de palabras, prueba social `4.9/5` y CTA champaña inmediato.
   - **Tiempo 2 (Manifiesto cinético)**: al bajar, las frases editables (`manifestoLine1..3`) se van colocando palabra por palabra sobre el halo ámbar y el anillo astrolabio rotatorio.
   - **Tiempo 3 (Revelación del producto)**: las letras abren paso al frasco en vidrio ámbar a escala completa flanqueado en dos columnas simétricas por sus 4 activos (`callouts`).
   - **Tiempo 4 (Atelier de conversión)**: el frasco se desliza al pedestal izquierdo y emerge el selector interactivo de presentaciones (1, 2 y 3 frascos) con compra rápida.
2. **Visualizador bio-óptico del poro (`ciencia_poro`)**: corte transversal dérmico animado con GSAP (malla cristalina de *Potassium Alum* vs. tapón oclusivo sintético).
3. **Herbario Mineral con frasco levitante sticky (`herbario_mineral`)**: columna izquierda fija con el frasco ámbar flotante y dial astrolabio acoplado al scroll mientras desfilan los 4 capítulos fitoterapéuticos en la columna derecha.
4. **Galería acoplada al scroll (`galeria_ritual`) y Cita iluminada (`respaldo_integrativo`)**: cinta horizontal con paralaje `scrub` y cita médica cuyas palabras se iluminan progresivamente al hacer scroll.
5. **Pagos Wompi (Sandbox / Producción) + Contraentrega + SEO Colombia**: pasarela Wompi gestionada desde WebProAI CMS (`Tienda → Pagos → Wompi`, compatible con llaves `pub_test_...` y `pub_prod_...` sin tocar código) y grafo JSON-LD `@graph` completo (`Organization`, `OnlineStore`, `WebSite`, `ItemList`, `Product`, `FAQPage`, `BreadcrumbList`).
