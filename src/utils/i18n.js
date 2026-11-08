// Internacionalización del portfolio. Idioma por defecto: inglés.
const SUPPORTED = ['en', 'es'];
const DEFAULT = 'en';

const strings = {
  en: {
    metaTitle: 'Ventures FL Studio — App Portfolio',
    metaDesc:
      'Portfolio of Ventures FL Studio: FixRadar, CurbRadar, SkillFix and CardAlert. Mobile apps built with Flutter.',
    navApps: 'Apps',
    navTech: 'Technology',
    navAbout: 'About',
    navContact: 'Contact',
    heroBadge: 'Mobile app studio · Flutter',
    heroTitleLead: 'We build',
    heroTitleGrad: 'apps that solve',
    heroTitleRest: "real people's problems.",
    heroSub:
      'We are <strong>Ventures FL Studio</strong>. We design and develop mobile applications end to end: product, real-time backend, and publishing on the App Store and Google Play.',
    heroCtaPrimary: 'See our apps',
    heroCtaGhost: 'Work with us',
    statAppsLabel: 'apps',
    statMultiNum: 'iOS + Android',
    statMultiLabel: 'multiplatform',
    statRtNum: 'Real-time',
    statRtLabel: 'Socket.io · FCM',
    storeSoonPlay: 'Coming soon to Google Play',
    storeSoonApple: 'Coming soon to the App Store',
    storeSoonBoth: 'Coming soon to the App Store and Google Play',
    apkLabel: 'Download APK',
    appsTitle: 'Our applications',
    appsDesc: 'Every product with the same focus: careful experience and solid technology.',
    stackTitle: 'What we do',
    stackDesc:
      'From mobile and web to AI, hosting and long-term maintenance — we cover the whole lifecycle of your product.',
    stackFrontTitle: 'Frontend (mobile & web)',
    stackFrontBody:
      'Cross-platform native apps with <strong>Flutter</strong> and modern web with <strong>Vue.js</strong> and <strong>HTML5</strong>: polished UI and smooth performance on every device.',
    stackBackTitle: 'Backend & real-time',
    stackBackBody:
      'REST APIs with <strong>Node.js / Express</strong> and <strong>PHP</strong>, <strong>MongoDB</strong> databases (with 2dsphere geolocation) and live communication via <strong>Socket.io</strong>.',
    stackAiTitle: 'AI integration',
    stackAiBody:
      'We integrate <strong>AI</strong> into our products —from image recognition to smart suggestions— to make apps faster and more useful.',
    stackPlatTitle: 'Hosting, delivery & maintenance',
    stackPlatBody:
      'We publish on the <strong>App Store</strong> and <strong>Google Play</strong>, and we manage <strong>hosting</strong> and <strong>ongoing maintenance</strong> so your app keeps running and improving over time.',
    aboutTitle: 'About the studio',
    aboutP1:
      'At <strong>Ventures FL Studio</strong> we turn ideas into real mobile products. We handle the whole cycle: discovery, product design, frontend and backend development, service integration and the full publishing process on the stores.',
    aboutP2:
      'Our common thread are the <em>"radar"</em> apps —FixRadar and CurbRadar— that put real-time geolocation at people\'s service, plus useful everyday tools like SkillFix and CardAlert.',
    aboutList1: 'End-to-end product',
    aboutList2: 'Geolocation and real-time',
    aboutList3: 'Published on iOS and Android',
    aboutList4: 'Multi-language (ES / EN)',
    ctaTitle: 'Have an app idea?',
    ctaText: "Tell us what you want to build and we'll make it happen.",
    ctaBtn: 'Get in touch',
    contactEmail: 'contact@krbusinessventures.org',
  },
  es: {
    metaTitle: 'Ventures FL Studio — Portfolio de Apps',
    metaDesc:
      'Portfolio de Ventures FL Studio: FixRadar, CurbRadar, SkillFix y CardAlert. Apps móviles construidas con Flutter.',
    navApps: 'Apps',
    navTech: 'Tecnología',
    navAbout: 'Sobre nosotros',
    navContact: 'Contacto',
    heroBadge: 'Estudio de apps móviles · Flutter',
    heroTitleLead: 'Construimos',
    heroTitleGrad: 'apps que resuelven',
    heroTitleRest: 'problemas reales de personas.',
    heroSub:
      'Somos <strong>Ventures FL Studio</strong>. Diseñamos y desarrollamos aplicaciones móviles de principio a fin: producto, backend en tiempo real, y publicación en la App Store y Google Play.',
    heroCtaPrimary: 'Ver nuestras apps',
    heroCtaGhost: 'Trabaja con nosotros',
    statAppsLabel: 'apps',
    statMultiNum: 'iOS + Android',
    statMultiLabel: 'multiplataforma',
    statRtNum: 'Tiempo real',
    statRtLabel: 'Socket.io · FCM',
    storeSoonPlay: 'Muy pronto en Google Play',
    storeSoonApple: 'Muy pronto en la App Store',
    storeSoonBoth: 'Muy pronto en la App Store y Google Play',
    apkLabel: 'Descargar APK',
    appsTitle: 'Nuestras aplicaciones',
    appsDesc: 'Cada producto con un mismo enfoque: experiencia cuidada y tecnología sólida.',
    stackTitle: 'Qué hacemos',
    stackDesc:
      'De móvil y web a IA, hosting y mantenimiento a largo plazo: cubrimos todo el ciclo de vida de tu producto.',
    stackFrontTitle: 'Frontend (móvil y web)',
    stackFrontBody:
      'Apps nativas multiplataforma con <strong>Flutter</strong> y web moderna con <strong>Vue.js</strong> y <strong>HTML5</strong>: UI cuidada y rendimiento fluido en todos los dispositivos.',
    stackBackTitle: 'Backend & tiempo real',
    stackBackBody:
      'APIs REST con <strong>Node.js / Express</strong> y <strong>PHP</strong>, bases de datos <strong>MongoDB</strong> (con geolocalización 2dsphere) y comunicación en vivo con <strong>Socket.io</strong>.',
    stackAiTitle: 'Integración de IA',
    stackAiBody:
      'Integramos <strong>IA</strong> en nuestros productos —desde reconocimiento de imágenes hasta sugerencias inteligentes— para que las apps sean más rápidas y útiles.',
    stackPlatTitle: 'Hosting, publicación y mantenimiento',
    stackPlatBody:
      'Publicamos en la <strong>App Store</strong> y <strong>Google Play</strong>, y gestionamos el <strong>hosting</strong> y el <strong>mantenimiento continuo</strong> para que tu app siga funcionando y mejorando con el tiempo.',
    aboutTitle: 'Sobre el estudio',
    aboutP1:
      'En <strong>Ventures FL Studio</strong> convertimos ideas en productos móviles reales. Nos ocupamos de todo el ciclo: descubrimiento, diseño de producto, desarrollo del frontend y el backend, integración de servicios y el proceso completo de publicación en las tiendas.',
    aboutP2:
      'Nuestro hilo conductor son las apps <em>"radar"</em> —FixRadar y CurbRadar— que ponen la geolocalización en tiempo real al servicio de las personas, sumadas a herramientas útiles del día a día como SkillFix y CardAlert.',
    aboutList1: 'Producto de principio a fin',
    aboutList2: 'Geolocalización y tiempo real',
    aboutList3: 'Publicación en iOS y Android',
    aboutList4: 'Multi-idioma (ES / EN)',
    ctaTitle: '¿Tienes una idea de app?',
    ctaText: 'Cuéntanos qué quieres construir y la hacemos realidad.',
    ctaBtn: 'Escríbenos',
    contactEmail: 'contact@krbusinessventures.org',
  },
};

// Devuelve el valor localizado de un campo {en, es} con fallback; deja pasar valores planos.
function pick(field, lang) {
  if (field == null) return field;
  if (typeof field === 'object' && !Array.isArray(field) && ('en' in field || 'es' in field)) {
    const val = field[lang];
    if (val != null && !(Array.isArray(val) && val.length === 0) && val !== '') return val;
    return field.en != null && field.en !== '' ? field.en : field.es;
  }
  return field;
}

// Sobrescrituras editables desde el panel: { key: { en, es } }. Se cargan de la BD.
let overrides = {};
function applyOverrides(map) {
  overrides = map || {};
}

// Resuelve un texto: override de la BD > texto por defecto del idioma > inglés > la propia clave.
function translate(lang, key) {
  const o = overrides[key];
  if (o && o[lang]) return o[lang];
  const s = strings[lang] && strings[lang][key];
  if (s != null) return s;
  const d = strings[DEFAULT][key];
  return d != null ? d : key;
}

// Middleware: fija lang (query > cookie > default) y expone t() y loc() a las vistas.
function middleware(req, res, next) {
  let lang = (req.query.lang || (req.cookies && req.cookies.lang) || DEFAULT).toLowerCase();
  if (!SUPPORTED.includes(lang)) lang = DEFAULT;
  res.locals.lang = lang;
  res.locals.t = (key) => translate(lang, key);
  res.locals.loc = (field) => pick(field, lang);
  next();
}

module.exports = { SUPPORTED, DEFAULT, strings, pick, middleware, applyOverrides, translate };
