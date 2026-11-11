# Alma Mineral — Dirección de Arte y Sistema de Diseño (`DESIGN.md`)

## 1. Concepto rector: *El Escenario Mineral (The Split Stage)*
> «En Alma Mineral, el frasco de vidrio ámbar y el cristal de Piedra de Alumbre se convierten en el escenario fijo de la botica: una mitad de la pantalla sostiene la materia mineral y su luz cálida, mientras la otra despliega con calma editorial la ciencia del poro libre, los siete extractos botánicos y el ritual de compra».

## 2. Sistema cromático (extraído del frasco físico + contraste WCAG AA/AAA)
Todos los colores viven en `globalData.designSystem` (Design System v2 del CMS) y se consumen mediante variables `--cms-*`:
- **Fondo piedra alumbre (`--cms-color-bg`)**: `#ECE6DA`
- **Pliego alabastro (`--cms-color-surface`)**: `#F6F2EA`
- **Travertino seco (`--cms-color-surface-alt`)**: `#DFD8C8`
- **Tinta ámbar profunda (`--cms-color-text`)**: `#231914` (contraste `12.8:1` sobre fondo)
- **Corteza mineral (`--cms-color-muted`)**: `#5E4F45` (contraste `6.1:1` sobre fondo)
- **Veta de piedra (`--cms-color-border`)**: `#CEC5B4`
- **Verde botánico de etiqueta (`--cms-color-primary`)**: `#1F381E` con texto `#F6F2EA` (`11.6:1`)
- **Ámbar de botica (`--cms-color-secondary`)**: `#6B3612` con texto `#F6F2EA` (`8.4:1`)
- **Oro cristal de alumbre (`--cms-color-accent`)**: `#8A6A26`

## 3. Tipografía y jerarquía
- **Titulares (`--cms-font-heading`)**: `Young Serif` (`400`), `letter-spacing: -0.02em`, `line-height: 0.98`, siempre en minúsculas de oración (*sentence case*) y máximo dos líneas en escritorio. Cero *eyebrows* o píldoras sobre titulares.
- **Lectura e interfaz (`--cms-font-body`)**: `Source Serif 4` (`400, 500, 600, italic`), `line-height: 1.55`, con `font-variant-numeric: tabular-nums` en todos los precios, contadores, unidades y totales del carrito/checkout.
- **Cinco escalas tipográficas estrictas**:
  - `--step-small`: `clamp(0.8438rem, 0.81rem + 0.12vw, 0.9rem)` (mínimo `13.5px`)
  - `--step-ui`: `0.95rem` (`15.2px`)
  - `--step-body`: `clamp(1.0625rem, 1.01rem + 0.25vw, 1.1875rem)` (`17–19px`)
  - `--step-lead`: `clamp(1.25rem, 1.1rem + 0.65vw, 1.55rem)`
  - `--step-head`: `clamp(2.1rem, 1.45rem + 2.8vw, 3.55rem)`

## 4. Coreografía GSAP + Micro-interacciones (Emil Kowalski)
1. **Escenario partido (`hero_escenario`)**: panel derecho `sticky` a altura de ventana con fundido cruzado atmosférico de `1.6s` entre escenas reales de Alma Mineral (pausado en `document.hidden` y desactivado en `prefers-reduced-motion`) + paralaje sutil con `ScrollTrigger` del frasco ámbar recortado.
2. **Pieza interactiva en vivo (`ciencia_poro`)**: comparador molecular en vivo del poro axilar (**Piedra de Alumbre · Poro libre** vs. **Clorhidrato de Aluminio · Conducto tapado**), animado con GSAP sobre diagrama anatómico SVG y textos 100 % editables desde `/portal`.
3. **Herbario fijo (`herbario_mineral`)**: bloque verde botánico a sangre con titular y frasco fijos a la izquierda (`ScrollTrigger`) mientras desfilan a la derecha los 7 ingredientes reales alternando retrato y notas de botica.
4. **Tacto de controles**: respuesta inmediata `:active` `scale(0.97)` en `160ms`, cajón de carrito lateral con curva `cubic-bezier(0.32, 0.72, 0, 1)`, barra de progreso hacia envío gratis y estados hover exclusivos para `@media (hover: hover) and (pointer: fine)`.
