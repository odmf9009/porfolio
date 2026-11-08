// Datos PÚBLICOS del sitio para la web en Vue: textos (en/es, con las ediciones del panel ya
// aplicadas) + proyectos publicados. Lo usan GET /api/site y la inyección en index.html.
//
// Privacidad: lista blanca de campos. No salen `metrics` (ingresos/usuarios), `_id` ni fechas.
const Project = require('../models/Project');
const { strings, translate, SUPPORTED } = require('./i18n');
const { dropBrokenDownloads } = require('./downloadAvailability');

const HEX = /^#[0-9a-f]{3,8}$/i;
const ICONS = ['radar', 'pin', 'wrench', 'bolt', 'tag', 'app'];

// Los textos del panel admiten solo <strong>, <em> y <br>. Cualquier otra etiqueta
// (o con atributos) se elimina antes de que el navegador lo pinte con v-html.
function inline(html) {
  return String(html ?? '').replace(/<(?!\/?(?:strong|em|br)\s*\/?>)[^>]*>/gi, '');
}

// Solo enlaces http(s) o rutas propias; nunca javascript: ni data:.
function safeUrl(url) {
  const u = String(url ?? '').trim();
  return /^https?:\/\//i.test(u) || u.startsWith('/') ? u : '';
}

const loc = (f) => ({ en: String(f?.en ?? ''), es: String(f?.es ?? '') });
const locList = (f) => ({ en: (f?.en ?? []).map(String), es: (f?.es ?? []).map(String) });

function toPublicProject(p) {
  return {
    slug: p.slug,
    name: p.name,
    tagline: loc(p.tagline),
    description: loc(p.description),
    statusLabel: loc(p.statusLabel),
    statusType: ['normal', 'live', 'soon'].includes(p.statusType) ? p.statusType : 'normal',
    accent: HEX.test(p.accent) ? p.accent : '#F97316',
    accent2: HEX.test(p.accent2) ? p.accent2 : '#1E3A8A',
    icon: ICONS.includes(p.icon) ? p.icon : 'app',
    features: locList(p.features),
    tech: (p.tech ?? []).map(String),
    platforms: { ios: !!p.platforms?.ios, android: !!p.platforms?.android },
    images: (p.images ?? [])
      .map((i) => ({ url: safeUrl(i.url), caption: String(i.caption ?? '') }))
      .filter((i) => i.url),
    storeLinks: {
      appStore: safeUrl(p.storeLinks?.appStore),
      playStore: safeUrl(p.storeLinks?.playStore),
    },
    // Ya filtrado: si el archivo del VPS no responde, la url llega vacía.
    directDownload: { url: safeUrl(p.directDownload?.url), label: loc(p.directDownload?.label) },
  };
}

async function getSiteData() {
  const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean();
  await dropBrokenDownloads(projects);

  const keys = new Set(Object.values(strings).flatMap((s) => Object.keys(s)));
  const texts = {};
  for (const lang of SUPPORTED) {
    texts[lang] = {};
    for (const key of keys) texts[lang][key] = inline(translate(lang, key));
  }
  return { texts, projects: projects.map(toPublicProject), year: new Date().getFullYear() };
}

module.exports = { getSiteData, inline };
