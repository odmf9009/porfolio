// Define qué textos del sitio son editables desde el panel, agrupados por sección.
// `key` coincide con las claves de i18n.js. `ml` = campo multilínea (textarea).
// `html` = admite etiquetas simples como <strong> / <em> (solo informativo).
module.exports = [
  {
    group: 'Navegación',
    fields: [
      { key: 'navApps', label: 'Menú: Apps' },
      { key: 'navTech', label: 'Menú: Tecnología' },
      { key: 'navAbout', label: 'Menú: Sobre nosotros' },
      { key: 'navContact', label: 'Menú: Contacto' },
    ],
  },
  {
    group: 'SEO (etiquetas de la página)',
    fields: [
      { key: 'metaTitle', label: 'Título de la pestaña' },
      { key: 'metaDesc', label: 'Descripción SEO', ml: true },
    ],
  },
  {
    group: 'Hero (portada)',
    fields: [
      { key: 'heroBadge', label: 'Etiqueta superior' },
      { key: 'heroTitleLead', label: 'Título — parte 1' },
      { key: 'heroTitleGrad', label: 'Título — parte 2 (degradado)' },
      { key: 'heroTitleRest', label: 'Título — parte 3' },
      { key: 'heroSub', label: 'Subtítulo', ml: true, html: true },
      { key: 'heroCtaPrimary', label: 'Botón principal' },
      { key: 'heroCtaGhost', label: 'Botón secundario' },
      { key: 'statAppsLabel', label: 'Stat: etiqueta "apps"' },
      { key: 'statMultiNum', label: 'Stat 2: valor' },
      { key: 'statMultiLabel', label: 'Stat 2: etiqueta' },
      { key: 'statRtNum', label: 'Stat 3: valor' },
      { key: 'statRtLabel', label: 'Stat 3: etiqueta' },
    ],
  },
  {
    group: 'Sección Aplicaciones',
    fields: [
      { key: 'appsTitle', label: 'Título' },
      { key: 'appsDesc', label: 'Descripción', ml: true },
      { key: 'storeSoonPlay', label: 'Aviso si la app no está en Google Play' },
      { key: 'storeSoonApple', label: 'Aviso si la app no está en la App Store' },
      { key: 'storeSoonBoth', label: 'Aviso si no está en ninguna tienda' },
      { key: 'apkLabel', label: 'Botón de descarga propia (APK), si el proyecto no define el suyo' },
    ],
  },
  {
    group: 'Qué hacemos (servicios)',
    fields: [
      { key: 'stackTitle', label: 'Título' },
      { key: 'stackDesc', label: 'Descripción', ml: true },
      { key: 'stackFrontTitle', label: 'Tarjeta 1: título' },
      { key: 'stackFrontBody', label: 'Tarjeta 1: texto', ml: true, html: true },
      { key: 'stackBackTitle', label: 'Tarjeta 2: título' },
      { key: 'stackBackBody', label: 'Tarjeta 2: texto', ml: true, html: true },
      { key: 'stackAiTitle', label: 'Tarjeta 3: título' },
      { key: 'stackAiBody', label: 'Tarjeta 3: texto', ml: true, html: true },
      { key: 'stackPlatTitle', label: 'Tarjeta 4: título' },
      { key: 'stackPlatBody', label: 'Tarjeta 4: texto', ml: true, html: true },
    ],
  },
  {
    group: 'Sobre el estudio',
    fields: [
      { key: 'aboutTitle', label: 'Título' },
      { key: 'aboutP1', label: 'Párrafo 1', ml: true, html: true },
      { key: 'aboutP2', label: 'Párrafo 2', ml: true, html: true },
      { key: 'aboutList1', label: 'Lista: punto 1' },
      { key: 'aboutList2', label: 'Lista: punto 2' },
      { key: 'aboutList3', label: 'Lista: punto 3' },
      { key: 'aboutList4', label: 'Lista: punto 4' },
    ],
  },
  {
    group: 'Contacto',
    fields: [
      { key: 'ctaTitle', label: 'Título' },
      { key: 'ctaText', label: 'Texto' },
      { key: 'ctaBtn', label: 'Botón' },
      { key: 'contactEmail', label: 'Email de contacto' },
    ],
  },
];
