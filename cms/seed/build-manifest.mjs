#!/usr/bin/env node
/**
 * Modelo de contenido de Alma Mineral como código (proyecto `almamineral` en WebProAI CMS Studio).
 *
 *   npm run cms:pull     # 1. descarga el estado actual del CMS (incluye productos)
 *   npm run cms:build    # 2. genera páginas, globales, design system v2, navegación y SEO
 *   npm run cms:diff     # 3. previsualiza cambios sin escribir
 *   npm run cms:push     # 4. sincroniza y publica (--skip-collections preserva productos/stock)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const snapshotPath = path.join(root, 'cms', 'almamineral.snapshot.json');
if (!fs.existsSync(snapshotPath)) {
  console.error('Falta cms/almamineral.snapshot.json. Ejecuta primero: npm run cms:pull');
  process.exit(1);
}
const snap = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
const mediaMap = JSON.parse(fs.readFileSync(path.join(here, 'media-map.json'), 'utf8'));

const catalogPath = path.resolve(root, '..', 'cms-landings', 'shared', 'blocks.catalog.json');
const catalog = fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, 'utf8')) : { blocks: [] };
const blocks = new Map((catalog.blocks || []).map((b) => [b.type, b]));
const catalogFields = (type) => {
  const b = blocks.get(type);
  return b ? JSON.parse(JSON.stringify(b.fields)) : [];
};

const t = (key, label, extra = {}) => ({ key, type: 'text', label, ...extra });
const ta = (key, label, extra = {}) => ({ key, type: 'textarea', label, ...extra });
const rt = (key, label) => ({ key, type: 'richtext', label });
const img = (key, label) => ({ key, type: 'image', label });
const link = (key, label) => ({ key, type: 'link', label });
const arr = (key, label, fields) => ({ key, type: 'array', label, fields });
const sel = (key, label, options) => ({
  key,
  type: 'select',
  label,
  options: options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
});
const bool = (key, label) => ({ key, type: 'boolean', label });

const block = (type, key, name, data, extraSchema = [], style = {}) => {
  const base = catalogFields(type);
  return {
    key,
    name,
    description: '',
    isVisible: true,
    schema: [...base, ...extraSchema.filter((f) => !base.some((c) => c.key === f.key))],
    data: { _block: type, ...data, ...(Object.keys(style).length ? { _style: style } : {}) },
  };
};

const custom = (key, name, schema, data, style = {}) => ({
  key,
  name,
  description: '',
  isVisible: true,
  schema,
  data: { ...data, ...(Object.keys(style).length ? { _style: style } : {}) },
});

const U = (k) => mediaMap[k]?.url || '';
const A = (k) => mediaMap[k]?.alt || '';

// ───────────── Secciones reutilizables / interactivas ─────────────

const poreVisualizerSection = (key = 'ciencia_poro') =>
  custom(
    key,
    'Comparador molecular del poro',
    [
      t('heading', 'Titular principal (máx. 2 líneas)'),
      ta('intro', 'Introducción científica clara'),
      t('alumTabLabel', 'Botón modo Piedra de Alumbre'),
      t('alumTitle', 'Alumbre: título de acción'),
      ta('alumSummary', 'Alumbre: explicación molecular'),
      arr('alumPoints', 'Alumbre: beneficios fisiológicos', [t('text', 'Beneficio')]),
      t('alumMoleculeLabel', 'Etiqueta diagrama: molécula mineral'),
      t('synthTabLabel', 'Botón modo Antitranspirante comercial'),
      t('synthTitle', 'Comercial: título de acción'),
      ta('synthSummary', 'Comercial: explicación del tapón sintético'),
      arr('synthPoints', 'Comercial: efectos sobre el poro y la ropa', [t('text', 'Efecto')]),
      t('synthMoleculeLabel', 'Etiqueta diagrama: clorhidrato sintético'),
      t('diagramCaption', 'Nota al pie del diagrama interactivo'),
      link('cta', 'Enlace de profundización'),
    ],
    {
      heading: 'Proteger sin tapar poros.',
      intro:
        'El sudor sano regula tu temperatura y casi no tiene olor. El mal olor aparece cuando las bacterias de la superficie lo descomponen. Cambia entre ambos mecanismos para ver qué ocurre dentro del poro.',
      alumTabLabel: 'Piedra de Alumbre · Poro libre',
      alumTitle: 'Escudo mineral en superficie',
      alumSummary:
        'El Potassium Alum tiene una estructura cristalina de gran peso molecular que permanece sobre la epidermis. Neutraliza las bacterias del mal olor mientras el conducto sudoríparo respira con libertad.',
      alumPoints: [
        { text: 'No atraviesa la barrera cutánea ni bloquea los ganglios axilares.' },
        { text: 'Fórmula transparente: cero manchas amarillas en camisas blancas ni marcas en ropa negra.' },
        { text: 'Con Vitamina E y Omega 6 que calman y unifican el tono natural de la piel.' },
      ],
      alumMoleculeLabel: 'Cristal Potassium Alum · Acción superficial',
      synthTabLabel: 'Antitranspirante · Conducto tapado',
      synthTitle: 'Tapón químico dentro del conducto',
      synthSummary:
        'Las sales sintéticas como el clorhidrato de aluminio reaccionan con la humedad formando un gel que obstruye físicamente la salida natural del sudor.',
      synthPoints: [
        { text: 'Altera el equilibrio de la microbiota axilar y puede sensibilizar la piel tras el afeitado.' },
        { text: 'Sus residuos reaccionan con las fibras textiles dejando aureolas rígidas difíciles de lavar.' },
        { text: 'Al suspenderlo, el cuerpo suele requerir algunos días para liberar los poros obstruidos.' },
      ],
      synthMoleculeLabel: 'Clorhidrato de aluminio · Gel oclusivo',
      diagramCaption: 'Diagrama interactivo de acción epidérmica: selecciona cada modo para observar el poro.',
      cta: { label: 'Leer la guía completa de transición', href: '/ciencia-mineral' },
    },
  );

// ───────────── 1. Portada (/) ─────────────

const home = {
  title: 'Inicio',
  slug: '/',
  description: 'Escenario principal de la botica Alma Mineral',
  seoTitle: 'Alma Mineral · Desodorante Natural de Piedra de Alumbre y Aceites Esenciales',
  seoDescription:
    'Desodorante natural en spray elaborado en Colombia con Piedra de Alumbre, Neem, Romero, Menta, Vitamina E y Omega 6. Sin clorhidrato de aluminio. Envíos a todo el país.',
  seoImage: U('trioWarmStudio'),
  sections: [
    custom(
      'hero_escenario',
      'Escenario partido: carta de botica y fotografía fija',
      [
        t('headline', 'Titular principal (máx. 2 líneas)'),
        ta('subheadline', 'Descripción de la fórmula'),
        t('ritualLabel', 'Rótulo del selector de ritual'),
        link('primaryCta', 'Botón secundario a la tienda'),
        t('buyButtonLabel', 'Texto del botón de agregar ritual'),
        img('bottleCutout', 'Frasco recortado con paralaje'),
        t('bottleCutoutAlt', 'Texto alternativo del frasco recortado'),
        arr('stageSlides', 'Fotografías del escenario fijo (fundido cruzado)', [
          img('image', 'Fotografía'),
          t('imageAlt', 'Texto alternativo'),
          t('caption', 'Pie breve de atmósfera'),
        ]),
        t('barLeft', 'Barra inferior de la foto: origen'),
        t('barRight', 'Barra inferior de la foto: envíos y pagos'),
      ],
      {
        headline: 'Tu piel respira libre.',
        subheadline:
          'Desodorante natural en vidrio ámbar con Piedra de Alumbre, Neem, Romero, Menta, Vitamina E y Omega 6. Neutraliza el mal olor todo el día sin clorhidrato de aluminio ni manchas en tu ropa.',
        ritualLabel: 'Elige tu presentación para agregar al carrito',
        buyButtonLabel: 'Agregar al ritual',
        primaryCta: { label: 'Ver detalles en la tienda', href: '/tienda' },
        bottleCutout: U('bottleCutout'),
        bottleCutoutAlt: A('bottleCutout'),
        stageSlides: [
          {
            image: U('trioWarmStudio'),
            imageAlt: A('trioWarmStudio'),
            caption: 'Vidrio ámbar que protege los extractos botánicos de la luz',
          },
          {
            image: U('vanitySlate'),
            imageAlt: A('vanitySlate'),
            caption: 'Textura acuosa limpia sobre piel recién duchada',
          },
          {
            image: U('sportDroplets'),
            imageAlt: A('sportDroplets'),
            caption: 'Protección real en días de entrenamiento y calor intenso',
          },
          {
            image: U('vanityTravertine'),
            imageAlt: A('vanityTravertine'),
            caption: 'Elaborado en el Valle del Cauca, Colombia',
          },
        ],
        barLeft: 'Botica en Valle del Cauca · Fórmula 100 % vegana',
        barRight: 'Envío nacional $5.000 COP · Pagos Wompi o Contraentrega',
      },
    ),

    poreVisualizerSection('ciencia_poro'),

    custom(
      'herbario_mineral',
      'Herbario fijo: los 7 ingredientes de la fórmula',
      [
        t('heading', 'Titular fijo izquierdo (2 a 4 palabras)'),
        ta('lead', 'Bajada bajo el titular fijo'),
        img('pinnedBottle', 'Imagen del frasco en la columna fija'),
        t('pinnedBottleAlt', 'Texto alternativo del frasco fijo'),
        arr('chapters', 'Capítulos botánicos y minerales que desfilan', [
          t('title', 'Ingrediente o par activo'),
          t('role', 'Función en la piel'),
          img('image', 'Fotografía 3:4'),
          t('imageAlt', 'Texto alternativo'),
          arr('notes', 'Notas de botica (3 a 4 líneas)', [t('line', 'Nota')]),
        ]),
      ],
      {
        heading: 'Siete activos puros.',
        lead: 'Cada gota combina un cristal mineral antibacteriano con aceites esenciales y lípidos reparadores. Sin rellenos sintéticos, alcohol irritante ni parabenos.',
        pinnedBottle: U('bottleCutout'),
        pinnedBottleAlt: A('bottleCutout'),
        chapters: [
          {
            title: 'Piedra de Alumbre (Potassium Alum)',
            role: 'Escudo mineral antibacteriano de superficie',
            image: U('vanityTravertine'),
            imageAlt: A('vanityTravertine'),
            notes: [
              { line: 'Sal mineral natural que frena la proliferación bacteriana causante del olor.' },
              { line: 'Su tamaño molecular impide que penetre en el poro o pase a la sangre.' },
              { line: 'Mantiene la transpiración saludable sin sensación pegajosa.' },
            ],
          },
          {
            title: 'Aceite Esencial de Neem',
            role: 'Purificación botánica de larga duración',
            image: U('vanitySlate'),
            imageAlt: A('vanitySlate'),
            notes: [
              { line: 'Reconocido en fitoterapia tradicional por su acción purificante natural.' },
              { line: 'Refuerza la protección en jornadas largas y climas húmedos.' },
              { line: 'Cuida la barrera cutánea sin resecar la zona axilar.' },
            ],
          },
          {
            title: 'Esencias de Romero y Menta',
            role: 'Frescura limpia y tonificación herbal',
            image: U('sportDroplets'),
            imageAlt: A('sportDroplets'),
            notes: [
              { line: 'Sensación fresca inmediata al atomizar después del baño o del deporte.' },
              { line: 'Aroma herbal sutil y unisex que no compite con tu perfume diario.' },
              { line: 'El romero aporta antioxidantes naturales que revitalizan la piel.' },
            ],
          },
          {
            title: 'Vitamina E y Omega 6',
            role: 'Calma posdepilación, tono uniforme y pH equilibrado',
            image: U('skinCare'),
            imageAlt: A('skinCare'),
            notes: [
              { line: 'La Vitamina E y el Omega 6 nutren y suavizan la piel sensible o recién afeitada.' },
              { line: 'Ayudan gradualmente a recuperar el tono claro y parejo de las axilas.' },
              { line: 'El cloruro de sodio purificado estabiliza el pH fisiológico de la fórmula.' },
            ],
          },
        ],
      },
    ),

    block(
      'products.catalog',
      'rituales_catalogo',
      'Presentaciones y packs rituales',
      {
        heading: 'Elige tu reserva mineral.',
        intro:
          'Una única fórmula honesta en tres presentaciones: frasco individual para empezar, dúo para compartir o llevar al gimnasio, y pack de tres con envío gratis a toda Colombia.',
        source: 'productos',
        showFilters: false,
        columns: '3',
        featuredOnly: false,
        moreLink: { label: 'Explorar toda la tienda', href: '/tienda' },
        tone: 'default',
      },
      [link('moreLink', 'Enlace hacia la tienda completa')],
    ),

    custom(
      'galeria_ritual',
      'Galería deslizable de escenas reales',
      [
        t('heading', 'Título breve sobre la galería'),
        t('countSuffix', 'Texto junto al conteo de fotografías'),
        arr('frames', 'Módulos fotográficos (tall, pair o wide)', [
          sel('kind', 'Formato del módulo', ['tall', 'wide']),
          img('image', 'Fotografía principal'),
          t('imageAlt', 'Texto alternativo'),
        ]),
      ],
      {
        heading: 'En tu rutina real.',
        countSuffix: 'escenas de uso diario',
        frames: [
          { kind: 'tall', image: U('morningRobe'), imageAlt: A('morningRobe') },
          { kind: 'wide', image: U('vanityMarble'), imageAlt: A('vanityMarble') },
          { kind: 'tall', image: U('sportDroplets'), imageAlt: A('sportDroplets') },
          { kind: 'wide', image: U('ceramicSink'), imageAlt: A('ceramicSink') },
          { kind: 'tall', image: U('vanitySlate'), imageAlt: A('vanitySlate') },
          { kind: 'tall', image: U('trioBotanical'), imageAlt: A('trioBotanical') },
        ],
      },
    ),

    custom(
      'respaldo_integrativo',
      'Retrato y cita desplazada: visión integrativa',
      [
        img('portrait', 'Retrato principal (3:4)'),
        t('portraitAlt', 'Texto alternativo del retrato'),
        ta('quote', 'Cita editorial de bienestar integrativo'),
        t('authorName', 'Atribución o enfoque'),
        t('authorRole', 'Especialidad o lugar'),
        img('detailImage', 'Fotografía secundaria (1:1)'),
        t('detailImageAlt', 'Texto alternativo de la foto secundaria'),
      ],
      {
        portrait: U('doctorEndorsement'),
        portraitAlt: A('doctorEndorsement'),
        quote:
          'Cuidar la piel axilar empieza por dejar que respire: controlar las bacterias en superficie sin obstruir los poros devuelve su calma y pH natural.',
        authorName: 'Filosofía de Cuidado Integrativo',
        authorRole: 'Formulación botánico-mineral · Alma Mineral Colombia',
        detailImage: U('bottleSquareCutout'),
        detailImageAlt: A('bottleSquareCutout'),
      },
    ),

    block('faq.accordion', 'preguntas', 'Preguntas frecuentes', {
      heading: 'Preguntas frecuentes del ritual.',
      intro: 'Todo sobre la aplicación, el periodo de adaptación, los envíos en Colombia y los pagos con Wompi o contraentrega.',
      items: [
        {
          question: '¿Cuál es la diferencia entre Alma Mineral y un antitranspirante comercial?',
          answer:
            'Los antitranspirantes comerciales usan clorhidrato de aluminio sintético para taponar los conductos del sudor. Alma Mineral usa **Piedra de Alumbre natural (`Potassium Alum`)**, cuya molécula permanece en la superficie neutralizando las bacterias del mal olor mientras deja respirar tus poros.',
        },
        {
          question: '¿Necesito un periodo de transición al dejar mi antitranspirante anterior?',
          answer:
            'Algunas personas notan de 3 a 7 días de ajuste mientras sus poros liberan residuos acumulados de antitranspirantes sintéticos. Durante esos días puedes reaplicar Alma Mineral al mediodía; luego una sola aplicación tras la ducha protege toda la jornada.',
        },
        {
          question: '¿Mancha las camisas blancas o la ropa deportiva oscura?',
          answer:
            'No. Su fórmula líquida transparente no contiene ceras, talcos ni clorhidrato de aluminio, por lo que no deja marcas blancas al vestirte ni manchas amarillas con los lavados.',
        },
        {
          question: '¿Sirve para piel sensible, adolescentes o después de depilarse?',
          answer:
            'Sí. Al no contener alcohol irritante ni parabenos e incorporar **Vitamina E** y **Omega 6**, calma la piel recién depilada y es seguro como primer desodorante desde la adolescencia.',
        },
        {
          question: '¿Cuánto cuesta el envío y cuánto tarda en llegar?',
          answer:
            'Despachamos desde el Valle del Cauca a toda Colombia por **$5.000 COP** (1 a 3 días hábiles en Cali y Valle; 2 a 5 días hábiles en el resto del país). En compras desde **$95.000 COP**, como el Pack Ritual x3, el envío es **gratis**.',
        },
        {
          question: '¿Qué medios de pago reciben?',
          answer:
            'Recibimos pagos en línea seguros gestionados por **Wompi** (PSE, Nequi, tarjetas débito y crédito, Bancolombia) y también **Pago contraentrega** en efectivo al recibir tu paquete.',
        },
      ],
      tone: 'default',
    }),

    custom(
      'cierre_botica',
      'Fotografía final a sangre con llamado al ritual',
      [
        img('image', 'Fotografía panorámica final'),
        t('imageAlt', 'Texto alternativo'),
        t('heading', 'Frase de cierre (3 a 6 palabras)'),
        ta('body', 'Párrafo corto de cierre'),
        link('cta', 'Botón de acción'),
      ],
      {
        image: U('vanitySlate'),
        imageAlt: A('vanitySlate'),
        heading: 'Empieza hoy tu ritual mineral.',
        body: 'Pide tu frasco individual por $37.000 COP o lleva el Pack Ritual x3 con envío gratis a cualquier ciudad de Colombia.',
        cta: { label: 'Pedir Alma Mineral', href: '/tienda' },
      },
    ),
  ],
};

// ───────────── 2. Tienda (/tienda) ─────────────

const tienda = {
  title: 'Tienda',
  slug: '/tienda',
  description: 'Catálogo completo de Desodorante Natural Alma Mineral y packs rituales',
  seoTitle: 'Tienda · Desodorante Natural Alma Mineral y Packs Rituales',
  seoDescription:
    'Compra en línea el Desodorante Natural Alma Mineral ($37.000 COP) o ahorra con nuestros packs rituales. Pago con Wompi o contraentrega y envío nacional por $5.000 COP.',
  seoImage: U('trioCleanPack'),
  sections: [
    block('products.catalog', 'catalogo_tienda', 'Catálogo de la tienda', {
      heading: 'La botica en línea.',
      intro:
        'Todas nuestras presentaciones se despachan recién elaboradas en frasco de vidrio ámbar. Usa el código ALMAMINERAL10 para recibir 10 % de bienvenida en tu primer pedido.',
      source: 'productos',
      showFilters: true,
      columns: '3',
      featuredOnly: false,
      tone: 'default',
    }),
    block('features.grid', 'promesa_envio', 'Condiciones claras de compra', {
      heading: 'Directo de nuestra botica a tu puerta.',
      intro: 'Sin costos ocultos al llegar al pago.',
      columns: '3',
      items: [
        {
          icon: 'truck',
          title: 'Envío nacional $5.000 COP',
          body: 'Tarifa única en toda Colombia y envío gratis automático en pedidos desde $95.000 COP.',
        },
        {
          icon: 'shield',
          title: 'Wompi y Contraentrega',
          body: 'Paga con PSE, Nequi, tarjetas o Bancolombia mediante Wompi, o paga en efectivo al recibir.',
        },
        {
          icon: 'leaf',
          title: 'Fórmula fresca garantizada',
          body: 'Si tu frasco sufre algún percance en el transporte, lo reponemos sin costo escribiéndonos con tu número de pedido.',
        },
      ],
      tone: 'default',
    }),
  ],
};

// ───────────── 3. Nuestra Historia (/nuestra-historia) ─────────────

const historia = {
  title: 'Nuestra historia',
  slug: '/nuestra-historia',
  description: 'El origen de Alma Mineral en el Valle del Cauca y nuestra filosofía de botica limpia',
  seoTitle: 'Nuestra Historia · Alma Mineral Colombia',
  seoDescription:
    'Conoce cómo nació Alma Mineral en el Valle del Cauca: un desodorante natural de Piedra de Alumbre y aceites esenciales creado para proteger sin agredir tu cuerpo.',
  seoImage: U('vanityTravertine'),
  sections: [
    block('content.split', 'origen_hero', 'El origen de Alma Mineral', {
      heading: 'Nació para cuidar la piel sin silenciarla.',
      body: [
        '**Alma Mineral** nació en el Valle del Cauca a partir de una pregunta sencilla: ¿por qué seguimos aplicando sales sintéticas oclusivas en una de las zonas más delicadas y vascularizadas del cuerpo?',
        '',
        'Decidimos volver a lo esencial con rigor contemporáneo: tomar la **Piedra de Alumbre natural (`Potassium Alum`)**, empleada durante siglos como purificante mineral, y equilibrarla con extractos botánicos nobles y lípidos reparadores en una bruma ligera y cómoda de usar todos los días.',
      ].join('\n'),
      cta: { label: 'Conocer la ciencia del poro libre', href: '/ciencia-mineral' },
      image: U('vanityTravertine'),
      imageAlt: A('vanityTravertine'),
      imageSide: 'right',
      tone: 'default',
    }),
    block('features.alternating', 'filosofia_botica', 'Tres decisiones de oficio', {
      heading: 'Lo que nunca negociamos.',
      items: [
        {
          title: 'Siete ingredientes con propósito real',
          body: 'Cada componente cumple una función clara: Piedra de Alumbre y Neem para neutralizar bacterias; Romero y Menta para refrescar; Vitamina E y Omega 6 para reparar la piel; Cloruro de Sodio para estabilizar el pH.',
          image: U('trioBotanical'),
          imageAlt: A('trioBotanical'),
          link: { label: 'Ver el producto insignia', href: '/producto/desodorante-natural-alma-mineral' },
        },
        {
          title: 'Vidrio ámbar en lugar de plástico desechable',
          body: 'Envasamos en vidrio ámbar porque filtra la radiación ultravioleta y mantiene intactas las propiedades de los aceites esenciales hasta la última atomización.',
          image: U('trioWarmStudio'),
          imageAlt: A('trioWarmStudio'),
          link: { label: 'Ver packs rituales', href: '/tienda' },
        },
        {
          title: 'Apto para el calor y el movimiento en Colombia',
          body: 'Probado en rutinas reales de trabajo, deporte y clima cálido: protege con eficacia sin dejar residuos en tus prendas.',
          image: U('sportDroplets'),
          imageAlt: A('sportDroplets'),
          link: { label: 'Comprar ahora', href: '/tienda' },
        },
      ],
    }),
    block('cta.banner', 'origen_cierre', 'Llamado a la tienda', {
      headline: 'Pásate al cuidado mineral.',
      body: 'Recibe tu pedido en cualquier ciudad de Colombia con respaldo directo de nuestra marca.',
      primaryCta: { label: 'Ir a la tienda', href: '/tienda' },
      secondaryCta: { label: 'Escribirnos', href: '/contacto' },
      tone: 'inverse',
    }),
  ],
};

// ───────────── 4. Ciencia Mineral (/ciencia-mineral) ─────────────

const ciencia = {
  title: 'Ciencia mineral',
  slug: '/ciencia-mineral',
  description: 'Diferencia científica entre el desodorante mineral de alumbre y el antitranspirante sintético',
  seoTitle: 'Desodorante Natural vs. Antitranspirante · Ciencia de Alma Mineral',
  seoDescription:
    'Descubre por qué el Potassium Alum de Alma Mineral neutraliza el mal olor sin tapar los poros ni manchar la ropa, a diferencia del clorhidrato de aluminio.',
  seoImage: U('doctorEndorsement'),
  sections: [
    block('content.split', 'ciencia_intro', 'Transpirar es salud', {
      heading: 'Sudar es natural. El mal olor es opcional.',
      body: [
        'Transpirar regula la temperatura corporal y acompaña los procesos naturales de eliminación de la piel. El sudor recién producido es prácticamente inodoro: el olor aparece solo cuando determinadas bacterias axilares lo metabolizan.',
        '',
        'Por eso **Alma Mineral** no busca bloquear tus glándulas sudoríparas, sino crear un entorno mineral limpio donde esas bacterias no pueden proliferar.',
      ].join('\n'),
      cta: { label: 'Probar Alma Mineral', href: '/producto/desodorante-natural-alma-mineral' },
      image: U('doctorEndorsement'),
      imageAlt: A('doctorEndorsement'),
      imageSide: 'left',
      tone: 'default',
    }),
    poreVisualizerSection('comparador_molecular'),
    block('steps.process', 'guia_transicion', 'Cómo hacer el cambio en tres pasos', {
      heading: 'Cómo hacer tu transición mineral.',
      intro: 'Si vienes de años usando antitranspirantes en barra o aerosol, sigue este ritual sencillo durante la primera semana.',
      items: [
        {
          title: 'Limpia sobre piel seca',
          body: 'Lava tus axilas con un jabón suave en la ducha y sécalas por completo antes de aplicar.',
        },
        {
          title: 'Atomiza de 3 a 4 veces',
          body: 'Cubre toda la zona axilar con una bruma uniforme y espera unos segundos a que seque antes de vestirte.',
        },
        {
          title: 'Acompaña los primeros días',
          body: 'Durante los primeros 3 a 5 días tus poros liberan residuos antiguos; si hace mucho calor, puedes reaplicar una vez al día.',
        },
      ],
      tone: 'default',
    }),
  ],
};

// ───────────── 5. Contacto (/contacto) ─────────────

const contacto = {
  title: 'Contacto',
  slug: '/contacto',
  description: 'Atención al cliente, dudas sobre pedidos y alianzas mayoristas de Alma Mineral',
  seoTitle: 'Contacto y Distribución · Alma Mineral',
  seoDescription:
    'Escríbenos para resolver dudas sobre tu pedido, recibir asesoría sobre la transición al desodorante natural o consultar compras para tiendas y consultorios.',
  seoImage: U('ceramicSink'),
  sections: [
    block(
      'form.custom',
      'contacto_formulario',
      'Formulario de contacto y alianzas',
      {
        formId: 'contacto',
        formName: 'Contacto Alma Mineral',
        heading: 'Hablemos de tu ritual o tu pedido.',
        intro:
          'Respondemos cada mensaje desde el Valle del Cauca. También atendemos consultorios integrativos, tiendas saludables y gimnasios interesados en distribuir Alma Mineral.',
        submitLabel: 'Enviar mensaje',
        successMessage: 'Gracias por escribirnos. Recibimos tu mensaje y te responderemos muy pronto a tu correo.',
        layout: 'split',
        fields: [
          { key: 'nombre', label: 'Tu nombre completo', type: 'text', required: true, placeholder: 'Ej. Camila Ríos' },
          { key: 'email', label: 'Correo electrónico', type: 'email', required: true, placeholder: 'tu@correo.com' },
          { key: 'telefono', label: 'Celular o WhatsApp', type: 'tel', required: false, placeholder: '300 000 0000' },
          {
            key: 'motivo',
            label: '¿En qué podemos ayudarte?',
            type: 'select',
            required: true,
            options: 'Consulta sobre el producto, Estado de mi pedido, Distribución o compra mayorista, Otro motivo',
          },
          { key: 'mensaje', label: 'Mensaje', type: 'textarea', required: true, placeholder: 'Cuéntanos cómo podemos ayudarte' },
        ],
      },
      [
        img('sideImage', 'Fotografía de acompañamiento'),
        t('sideImageAlt', 'Texto alternativo'),
        t('directEmailLabel', 'Rótulo de correo directo'),
      ],
    ),
  ],
};
contacto.sections[0].data.sideImage = U('ceramicSink');
contacto.sections[0].data.sideImageAlt = A('ceramicSink');
contacto.sections[0].data.directEmailLabel = 'Correo directo de atención';

// ───────────── 6. Rastreo (/rastreo) ─────────────

const rastreo = {
  title: 'Rastrear pedido',
  slug: '/rastreo',
  description: 'Consulta pública en tiempo real del estado de tu pedido y guía de transporte',
  seoTitle: 'Rastrear Pedido · Alma Mineral',
  seoDescription: 'Ingresa tu número de orden o guía para consultar el estado de despacho de tu pedido Alma Mineral.',
  sections: [
    block('tracking.order', 'rastreo_pedido', 'Rastreo de pedido', {
      heading: 'Sigue el camino de tu pedido.',
      intro: 'Ingresa el código de tu orden (por ejemplo ORD-2026-…) o el número de guía que recibiste en tu correo.',
      placeholder: 'ORD-2026-… o número de guía',
      submitLabel: 'Consultar estado',
      tone: 'default',
    }),
  ],
};

// ───────────── 7. Checkout, Confirmación y Favoritos ─────────────

const checkout = {
  title: 'Finalizar compra',
  slug: '/checkout',
  description: 'Pago seguro con Wompi o contraentrega',
  seoTitle: 'Finalizar Compra · Alma Mineral',
  sections: [
    custom(
      'pago_checkout',
      'Checkout de la tienda',
      [
        t('heading', 'Título del checkout'),
        ta('intro', 'Nota de respaldo y seguridad'),
        t('couponHint', 'Sugerencia de cupón'),
        t('wompiNote', 'Nota informativa de pagos seguros'),
      ],
      {
        heading: 'Completa tu pedido.',
        intro: 'Tus datos viajan cifrados. El envío nacional cuesta $5.000 COP y es gratuito en compras desde $95.000 COP.',
        couponHint: '¿Primera compra? Usa el código ALMAMINERAL10 para obtener 10 % de descuento.',
        wompiNote: 'Pagos en línea procesados por Wompi (PSE, Nequi, Tarjetas, Bancolombia) y modalidad Contraentrega.',
      },
    ),
  ],
};

const pedido = {
  title: 'Estado de tu pedido',
  slug: '/pedido',
  description: 'Confirmación de compra y retorno de pasarela Wompi',
  seoTitle: 'Confirmación de Pedido · Alma Mineral',
  sections: [
    custom(
      'confirmacion_pedido',
      'Confirmación y estado del pago',
      [
        t('heading', 'Título de confirmación'),
        ta('paidBody', 'Mensaje cuando el pago fue aprobado'),
        ta('pendingBody', 'Mensaje cuando el pedido queda confirmado contraentrega o en validación'),
        ta('failedBody', 'Mensaje cuando el pago fue rechazado o cancelado'),
        link('continueCta', 'Botón para volver a la tienda'),
      ],
      {
        heading: 'Resumen de tu orden.',
        paidBody: 'Recibimos tu pago correctamente. Estamos preparando tu ritual en vidrio ámbar y te enviaremos la guía apenas salga de nuestra botica.',
        pendingBody: 'Tu orden quedó registrada. Si elegiste contraentrega, ten listo el valor exacto al recibir; si tu pago en línea sigue validándose, se actualizará en segundos.',
        failedBody: 'La transacción no se completó en la pasarela. Puedes reintentar el pago en línea ahora mismo sin volver a llenar tus datos.',
        continueCta: { label: 'Seguir explorando la tienda', href: '/tienda' },
      },
    ),
  ],
};

const favoritos = {
  title: 'Favoritos',
  slug: '/favoritos',
  description: 'Presentaciones guardadas por el visitante',
  seoTitle: 'Tus Favoritos · Alma Mineral',
  sections: [
    custom(
      'lista_favoritos',
      'Presentaciones guardadas',
      [
        t('heading', 'Título de favoritos'),
        ta('emptyBody', 'Texto cuando aún no hay favoritos guardados'),
        link('emptyCta', 'Botón hacia la tienda'),
      ],
      {
        heading: 'Tus presentaciones guardadas.',
        emptyBody: 'Aún no has guardado rituales en esta lista. Explora nuestras presentaciones individuales y packs con ahorro.',
        emptyCta: { label: 'Ver presentaciones', href: '/tienda' },
      },
    ),
  ],
};

// ───────────── 8. Cuenta de Cliente (/cuenta, /cuenta/pedidos, /cuenta/direcciones, /cuenta/restablecer) ─────────────

const cuenta = {
  title: 'Mi cuenta',
  slug: '/cuenta',
  description: 'Acceso, registro y perfil de cliente',
  seoTitle: 'Mi Cuenta · Alma Mineral',
  sections: [
    custom(
      'cuenta_acceso',
      'Acceso y resumen de cuenta',
      [
        t('heading', 'Título de la sección'),
        ta('intro', 'Descripción de beneficios de crear cuenta'),
      ],
      {
        heading: 'Tu espacio en Alma Mineral.',
        intro: 'Consulta el historial de tus pedidos, descarga comprobantes, guarda tus direcciones frecuentes y repite tu reserva mineral en segundos.',
      },
    ),
  ],
};

const cuentaPedidos = {
  title: 'Mis pedidos',
  slug: '/cuenta/pedidos',
  description: 'Historial de órdenes, rastreo y devoluciones del cliente',
  seoTitle: 'Mis Pedidos · Alma Mineral',
  sections: [
    custom(
      'cuenta_pedidos',
      'Historial de pedidos del cliente',
      [
        t('heading', 'Título de mis pedidos'),
        ta('intro', 'Texto de ayuda sobre seguimiento y cambios'),
      ],
      {
        heading: 'Historial de tus pedidos.',
        intro: 'Revisa el estado de pago, sigue el número de guía en vivo o reintenta un pago pendiente en Wompi.',
      },
    ),
  ],
};

const cuentaDirecciones = {
  title: 'Mis direcciones',
  slug: '/cuenta/direcciones',
  description: 'Libreta de direcciones de entrega en Colombia',
  seoTitle: 'Mis Direcciones · Alma Mineral',
  sections: [
    custom(
      'cuenta_direcciones',
      'Direcciones guardadas',
      [
        t('heading', 'Título de direcciones'),
        ta('intro', 'Descripción breve'),
      ],
      {
        heading: 'Tus direcciones de entrega.',
        intro: 'Guarda tu dirección en casa u oficina para agilizar tus próximas compras.',
      },
    ),
  ],
};

const cuentaRestablecer = {
  title: 'Restablecer contraseña',
  slug: '/cuenta/restablecer',
  description: 'Recuperación segura de contraseña de cliente',
  seoTitle: 'Restablecer Contraseña · Alma Mineral',
  sections: [
    custom(
      'cuenta_restablecer',
      'Cambio de contraseña con enlace seguro',
      [
        t('heading', 'Título'),
        ta('intro', 'Instrucción para elegir nueva contraseña'),
      ],
      {
        heading: 'Crea una nueva contraseña.',
        intro: 'Escribe una clave segura de al menos 8 caracteres para recuperar el acceso a tu cuenta.',
      },
    ),
  ],
};

// ───────────── 9. Privacidad, Envío y Devoluciones (/privacidad) ─────────────

const privacidad = {
  title: 'Privacidad, envíos y cambios',
  slug: '/privacidad',
  description: 'Política de tratamiento de datos personales (Ley 1581 de 2012), envíos y garantías en Colombia',
  seoTitle: 'Política de Privacidad, Envíos y Garantías · Alma Mineral Colombia',
  sections: [
    block(
      'content.richtext',
      'politica_texto',
      'Políticas legales y al consumidor',
      {
        body: [
          '## Transparencia, datos personales y garantías.',
          '',
        '### 1. Responsable del tratamiento de datos (Ley 1581 de 2012)',
        '**Alma Mineral**, con operación en el Valle del Cauca, Colombia, y correo oficial de contacto **almamineral.co@gmail.com**, es responsable del tratamiento de los datos personales recolectados a través de esta tienda en línea.',
        '',
        '### 2. Finalidad de la información recolectada',
        'Los datos suministrados al comprar, crear una cuenta o escribirnos se utilizan exclusivamente para procesar tus pedidos, coordinar la entrega con transportadoras nacionales, gestionar pagos seguros a través de **Wompi** o modalidad contraentrega, enviarte notificaciones del estado de tu orden y, únicamente si lo autorizas, compartir novedades de la marca.',
        '',
        '### 3. Derechos de los titulares (Habeas Data)',
        'En cualquier momento puedes conocer, actualizar, rectificar o solicitar la supresión de tus datos personales escribiendo a **almamineral.co@gmail.com** o desde la sección **Mi cuenta**.',
        '',
        '### 4. Envíos en Colombia',
        '- **Cali y Valle del Cauca**: entrega estimada de 1 a 3 días hábiles tras la confirmación del pedido.',
        '- **Resto del país**: entrega estimada de 2 a 5 días hábiles según ciudad o municipio.',
        '- **Tarifa nacional**: $5.000 COP. Envío gratuito automático en compras iguales o superiores a $95.000 COP.',
        '',
        '### 5. Garantía de calidad y reposición por transporte',
        'Por tratarse de un producto de higiene y uso personal, los cambios aplican sobre unidades sin abrir dentro de los 5 días hábiles legales de retracto (Estatuto del Consumidor, Ley 1480 de 2011) o de manera inmediata y sin costo para el comprador si el frasco de vidrio ámbar presenta rotura, filtración o defecto en el atomizador al momento de recibir el paquete. Para activarla, escríbenos a **almamineral.co@gmail.com** indicando tu número de orden.',
      ].join('\n'),
      tone: 'default',
    }),
  ],
};

const pages = [
  home,
  tienda,
  historia,
  ciencia,
  contacto,
  rastreo,
  checkout,
  pedido,
  favoritos,
  cuenta,
  cuentaPedidos,
  cuentaDirecciones,
  cuentaRestablecer,
  privacidad,
].map((p, i) => ({
  order: i,
  ...p,
  sections: p.sections.map((s, j) => ({ order: j, ...s })),
}));

// ───────────── Globales y Design System v2 ─────────────

const g = (key, type, label) => ({ key, type, label });
const globalSchema = [
  g('brandName', 'text', 'Nombre de la marca'),
  g('tagline', 'textarea', ' Manifiesto corto (pie de página)'),
  g('announcementText', 'text', 'Barra superior de anuncio'),
  g('logoUrl', 'image', 'Logo principal (transparente)'),
  g('faviconUrl', 'image', 'Ícono de pestaña (favicon cristal)'),
  g('footerPhotoUrl', 'image', 'Fotografía de cierre en el pie dividido'),
  g('email', 'text', 'Correo de atención'),
  g('whatsappNumber', 'text', 'WhatsApp con indicativo (ej. 573001234567, opcional)'),
  g('whatsappPrefill', 'text', 'Mensaje inicial de WhatsApp'),
  g('city', 'text', 'Origen / Región'),
  g('dispatchNote', 'text', 'Nota de despacho nacional'),
  {
    key: 'social',
    type: 'array',
    label: 'Redes sociales oficiales',
    fields: [
      {
        key: 'network',
        type: 'select',
        label: 'Red',
        options: ['instagram', 'tiktok', 'facebook', 'youtube'].map((v) => ({ value: v, label: v })),
      },
      { key: 'label', type: 'text', label: 'Nombre visible' },
      { key: 'url', type: 'text', label: 'Enlace completo' },
    ],
  },
  g('legalNote', 'text', 'Línea de derechos reservados'),
  g('cartFreeMissing', 'text', 'Carrito: texto cuando falta para envío gratis ({monto})'),
  g('cartFreeDone', 'text', 'Carrito: texto cuando ya tiene envío gratis'),
  g('footerNavHeading', 'text', 'Pie: título de navegación'),
  g('footerContactHeading', 'text', 'Pie: título de contacto'),
  g('footerSocialHeading', 'text', 'Pie: título de redes'),
];

const globalData = {
  ...(snap.globalData || {}),
  brandName: 'Alma Mineral',
  tagline: 'Desodorante natural de Piedra de Alumbre y siete activos botánicos en vidrio ámbar. Hecho en Colombia.',
  announcementText: 'Envío nacional $5.000 COP · Gratis desde $95.000 COP · Código ALMAMINERAL10 (-10 %)',
  logoUrl: U('logo'),
  faviconUrl: U('favicon'),
  footerPhotoUrl: U('trioWarmStudio'),
  email: 'almamineral.co@gmail.com',
  whatsappNumber: '',
  whatsappPrefill: 'Hola Alma Mineral, quiero hacer una consulta sobre el desodorante natural.',
  city: 'Valle del Cauca, Colombia',
  dispatchNote: 'Despachos a toda Colombia · Wompi y Contraentrega',
  social: [
    { network: 'instagram', label: 'Instagram @almamineral.co', url: 'https://www.instagram.com/almamineral.co' },
    { network: 'tiktok', label: 'TikTok @almamineral.co', url: 'https://www.tiktok.com/@almamineral.co' },
    { network: 'facebook', label: 'Facebook Alma Mineral', url: 'https://www.facebook.com/share/15jRJCEUTN/' },
  ],
  legalNote: '© 2026 Alma Mineral Colombia. Todos los derechos reservados.',
  cartFreeMissing: 'Agrega {monto} más para tener envío gratis en Colombia',
  cartFreeDone: 'Tu pedido ya incluye envío nacional gratis',
  footerNavHeading: 'Recorrido',
  footerContactHeading: 'Botica y atención',
  footerSocialHeading: 'Comunidad',
  ui: {
    ...((snap.globalData || {}).ui || {}),
    addToCart: 'Agregar al ritual',
    addedToCart: 'En tu bolsa',
    outOfStock: 'Agotado temporalmente',
    cartTitle: 'Tu bolsa mineral',
    emptyCart: 'Tu bolsa aún está vacía. Elige tu presentación individual o un pack con ahorro.',
    continueShopping: 'Seguir viendo rituales',
    goToCheckout: 'Finalizar compra',
    couponPlaceholder: 'Código (ej. ALMAMINERAL10)',
    applyCoupon: 'Aplicar',
  },
  site: {
    ...((snap.globalData || {}).site || {}),
    cookieBanner: {
      enabled: true,
      text: 'Usamos cookies esenciales para tu bolsa de compras y medición anónima de pedidos.',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Solo esenciales',
    },
    whatsappOrders: {
      enabled: false,
      cart: false,
    },
    notFound: {
      title: 'Esta página no hace parte de la botica.',
      body: 'Es posible que el enlace haya cambiado tras el rediseño. Vuelve al inicio o explora nuestras presentaciones.',
      ctaLabel: 'Ir a la tienda',
      ctaHref: '/tienda',
    },
  },
  designSystem: {
    version: 2,
    name: 'Atelier Botánico de Lujo · Alma Mineral',
    themeMode: 'light',
    colors: {
      background: '#F2F4F1',
      surface: '#FFFFFF',
      surfaceAlt: '#E6EAE4',
      text: '#121814',
      muted: '#4A544D',
      border: '#D6DDD4',
      primary: '#14261B',
      primaryText: '#FAF8F5',
      secondary: '#6B4226',
      secondaryText: '#FAF8F5',
      accent: '#6E5015',
      success: '#1B6B3E',
      danger: '#A62B22',
      custom: [
        { name: 'Oro Ámbar Cepillado', value: '#E5C478' },
        { name: 'Obsidiana Botánica', value: '#0D1912' },
        { name: 'Piedra Caliza', value: '#EAE8E2' },
      ],
    },
    typography: {
      headingFont: { family: 'Cormorant Garamond', source: 'google', weights: [500, 600, 700], category: 'serif' },
      bodyFont: { family: 'Plus Jakarta Sans', source: 'google', weights: [400, 500, 600, 700], category: 'sans-serif' },
      baseSize: 16,
      scaleRatio: 1.28,
      headingWeight: 600,
      bodyWeight: 400,
      headingCase: 'none',
      headingTracking: -0.02,
      bodyLineHeight: 1.6,
    },
    shape: { radiusSm: 8, radiusMd: 14, radiusLg: 22, radiusFull: 999, borderWidth: 1 },
    shadow: {
      sm: '0 2px 8px -2px rgb(18 24 20 / 0.05)',
      md: '0 16px 36px -14px rgb(18 24 20 / 0.12)',
      lg: '0 28px 64px -20px rgb(18 24 20 / 0.22)',
    },
    spacing: { sectionY: 104, sectionYMobile: 64, gutter: 24, maxWidth: 1360 },
    buttons: { style: 'solid', shape: 'rounded', case: 'none', weight: 600, paddingY: 15, paddingX: 26 },
    motion: { level: 'expressive', durationMs: 280 },
    header: { variant: 'simple', sticky: true, transparentOnHero: false, showSearch: false, showCart: true },
    footer: { variant: 'split', showNewsletter: false },
    globalCss: '',
  },
};
if (globalData.designSystem.flat) delete globalData.designSystem.flat;

const navigationConfig = {
  headerLinks: [
    { id: 'nav-tienda', label: 'Tienda', href: '/tienda', isVisible: true },
    { id: 'nav-ciencia', label: 'Ciencia mineral', href: '/ciencia-mineral', isVisible: true },
    { id: 'nav-historia', label: 'Nuestra historia', href: '/nuestra-historia', isVisible: true },
    { id: 'nav-rastreo', label: 'Rastrear pedido', href: '/rastreo', isVisible: true },
    { id: 'nav-contacto', label: 'Contacto', href: '/contacto', isVisible: true },
  ],
  headerCtaText: 'Pedir ahora',
  headerCtaHref: '/tienda',
  footerLinks: [
    { id: 'ft-tienda', label: 'Tienda y packs', href: '/tienda', isVisible: true },
    { id: 'ft-ciencia', label: 'El poro libre', href: '/ciencia-mineral', isVisible: true },
    { id: 'ft-historia', label: 'Nuestra historia', href: '/nuestra-historia', isVisible: true },
    { id: 'ft-rastreo', label: 'Rastrear pedido', href: '/rastreo', isVisible: true },
    { id: 'ft-cuenta', label: 'Mi cuenta', href: '/cuenta', isVisible: true },
    { id: 'ft-contacto', label: 'Contacto y mayoristas', href: '/contacto', isVisible: true },
    { id: 'ft-privacidad', label: 'Privacidad y garantías', href: '/privacidad', isVisible: true },
  ],
};

const seoConfig = {
  metaTitle: 'Alma Mineral · Desodorante Natural de Piedra de Alumbre en Colombia',
  metaDescription:
    'Desodorante natural en spray con Piedra de Alumbre, Neem, Romero, Menta, Vitamina E y Omega 6. Libre de clorhidrato de aluminio. Envíos a toda Colombia, pagos Wompi y contraentrega.',
  ogImage: U('trioWarmStudio'),
  robotsIndex: true,
};

const redirects = [
  { from: '/catalogo', to: '/tienda', permanent: true },
  { from: '/shop', to: '/tienda', permanent: true },
  { from: '/product/desodorante-natural-alma-mineral', to: '/producto/desodorante-natural-alma-mineral', permanent: true },
  { from: '/privacy-policy', to: '/privacidad', permanent: true },
  { from: '/refund_returns', to: '/privacidad', permanent: true },
  { from: '/delivery', to: '/privacidad', permanent: true },
  { from: '/faq', to: '/#cms-section-preguntas', permanent: true },
  { from: '/our-difference', to: '/ciencia-mineral', permanent: true },
];

const out = {
  ...snap,
  globalSchema,
  globalData,
  seoConfig,
  navigationConfig,
  redirects,
  pages,
};

fs.writeFileSync(snapshotPath, JSON.stringify(out, null, 2) + '\n');
console.log(
  `Manifiesto escrito en ${path.relative(root, snapshotPath)}: ${pages.length} páginas, ${pages.reduce((n, p) => n + p.sections.length, 0)} secciones.`,
);
