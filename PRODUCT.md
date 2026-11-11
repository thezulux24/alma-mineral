# Alma Mineral — Documento de Producto y Arquitectura CMS

## 1. Identidad real de la marca
- **Marca**: Alma Mineral (`https://tualmamineral.com/`)
- **Origen**: Valle del Cauca, Colombia · Moneda: `COP` (`es-CO`)
- **Correo oficial**: `almamineral.co@gmail.com`
- **Redes oficiales**:
  - Instagram: `https://www.instagram.com/almamineral.co`
  - TikTok: `https://www.tiktok.com/@almamineral.co`
  - Facebook: `https://www.facebook.com/share/15jRJCEUTN/`
- **Producto insignia**: **Desodorante Natural Alma Mineral** (`SKU: AMDEO`, `$37.000 COP`), formulado en spray en frasco de vidrio ámbar con atomizador blanco.
- **Fórmula botánico-mineral real (7 ingredientes)**:
  1. **Piedra de Alumbre (`Potassium Alum`)**: sal mineral natural de molécula grande que crea un escudo antibacteriano en la superficie sin tapar el poro ni pasar al torrente sanguíneo.
  2. **Aceite Esencial de Neem**: purificante botánico de amplio espectro contra las bacterias causantes del mal olor.
  3. **Esencia de Romero**: tonificante herbal que equilibra la piel axilar.
  4. **Esencia de Menta**: frescura limpia e inmediata al aplicar, especialmente tras el deporte.
  5. **Vitamina E**: antioxidante reparador que suaviza la piel sensible o recién depilada.
  6. **Omega 6**: ácido graso esencial que protege la barrera cutánea y ayuda a recuperar el tono natural de la axila.
  7. **Cloruro de Sodio**: mineral purificado que estabiliza el pH de la fórmula.

## 2. Arquitectura en WebProAI CMS Studio (`almamineral`)
- **Slug del proyecto en producción**: `almamineral` (`https://webproai.tech/portal?project=almamineral`)
- **SDK**: `@latinovation/cms-client` v4.4.0 (`CmsProvider`, `ShopAccountProvider`, `CartProvider`, `CmsTracking`, `CmsPage`, primitivas de edición en vivo y hooks v4.4 de checkout, retorno de pasarela, rastreo, reseñas y cuenta de cliente).
- **Colección de tienda (`productos`, `isStore: true`, `routeBase: "/producto"`)**:
  - `desodorante-natural-alma-mineral` (`AMDEO` · `$37.000 COP`)
  - `duo-ritual-alma-mineral` (`AMDEO-DUO` · `$70.300 COP`, antes `$74.000 COP`)
  - `pack-ritual-alma-mineral-x3` (`AMDEO-TRIO` · `$99.900 COP`, antes `$111.000 COP` · Envío gratis)
- **Pagos y logística**:
  - **Wompi (`wompi`)**: configurado como método principal en Colombia (`PSE, Nequi, Tarjetas, Bancolombia`), con webhook listo en `https://webproai.tech/api/ecommerce/webhooks/almamineral/wompi` y página de retorno/confirmación/reintento en `/pedido` (`usePaymentReturn`). Solo requiere pegar `pub_prod_…`, `prod_integrity_…` y `prod_events_…` en `/portal` → **Tienda → Pasarelas de pago → Wompi**.
  - **Contraentrega (`cod`)**: activa para recibir pedidos de inmediato en todo el país.
  - **Tarifa de envío**: `$5.000 COP` nacional (idéntica a la tienda original en WooCommerce) y **envío gratis desde `$95.000 COP`**.
  - **Cupón activo**: `ALMAMINERAL10` (`10 %` de descuento).
