# Alma Mineral — Dirección de Arte y Sistema de Diseño (`DESIGN.md`)

## 1. Concepto rector: *Atelier Botánico de Lujo (High-Converting Clean-Beauty D2C)*
> «Inspirado en la arquitectura de conversión de marcas D2C líderes de cuidado botánico (*Salt & Stone, Corpus Naturals, AKT London, Aesop*), el storefront de Alma Mineral combina editorial de perfumería botánica en vidrio ámbar con claridad comercial inmediata: jerarquía tipográfica de alto contraste, encuadres fotográficos curados sin recortes y merchandising de rituales por paquete».

## 2. Sistema cromático (Design System v2 del CMS · contraste WCAG AA/AAA)
Todos los tokens viven en `globalData.designSystem` de WebProAI CMS Studio y se inyectan como variables `--cms-*`:
- **Alabastro mineral (`--cms-color-bg`)**: `#F8F6F2`
- **Porcelana pura (`--cms-color-surface`)**: `#FFFFFF`
- **Piedra suave (`--cms-color-surface-alt`)**: `#EFECE5`
- **Tinta bosque profundo (`--cms-color-text`)**: `#121814` (contraste `> 15:1`)
- **Salvia mineral (`--cms-color-muted`)**: `#525B54` (contraste `> 6.2:1`)
- **Veta cálida (`--cms-color-border`)**: `#E2DDD3`
- **Verde esmeralda de botica (`--cms-color-primary`)**: `#14261B` con texto `#FAF8F5` (`> 14:1`)
- **Ámbar tostado (`--cms-color-secondary`)**: `#6B4226` con texto `#FAF8F5`
- **Oro cristal de alumbre (`--cms-color-accent`)**: `#B68B3A` / `#C8A252`

## 3. Tipografía y jerarquía editorial + D2C
- **Titulares y citas editoriales (`--cms-font-heading`)**: `Cormorant Garamond` (`500, 600, 700` + `italic`), `letter-spacing: -0.02em`, `line-height: 0.96–1.05`.
- **Interfaz, lectura, precios y CTAs (`--cms-font-body`)**: `Plus Jakarta Sans` (`400, 500, 600, 700`), `font-variant-numeric: tabular-nums` en todos los precios, ahorros por frasco, contadores y totales de checkout.
- **Encuadres fotográficos**: control explícito de `object-position` (`center 14%` en retratos clínicos, `center 22%–32%` en frascos y bodegones) y tarjetas de cierre divididas (*Split Luxury Banner*) para que ningún texto se superponga sobre la etiqueta del frasco.

## 4. Coreografía GSAP + Micro-interacciones
1. **Escenario D2C (`hero_escenario`)**: entrada escalonada con `useGSAP`, selector interactivo de presentaciones con miniatura, precio por unidad y ahorro destacado, más escenario fotográfico con fundido cruzado atmosférico, controles de diapositiva y tarjeta flotante *glassmorphic* para el frasco recortado.
2. **Visualizador bio-óptico del poro (`ciencia_poro`)**: corte transversal dérmico sobre lienzo oscuro (`#102117` → `#0B160F`) animado con GSAP (malla cristalina dorada de *Potassium Alum* en suspensión y micro-esferas de transpiración libre vs. gel oclusivo sintético).
3. **Herbario Bento 2×2 (`herbario_mineral`)**: pedestal interactivo del frasco ámbar con selector rápido de capítulos (`01`–`04`) y cuadrícula Bento 2×2 con revelación `ScrollTrigger`.
4. ** SEO E-Commerce Colombia**: grafo JSON-LD `@graph` completo (`Organization`, `OnlineStore` con políticas de envío nacional `$5.000 COP` / gratis desde `$95.000 COP` y devoluciones `CO`, `WebSite`, `ItemList`, `Product`, `FAQPage` alimentado desde el CMS y `BreadcrumbList`).
