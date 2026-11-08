require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');

const PROJECTS = [
  {
    slug: 'fixradar',
    name: 'FixRadar',
    statusType: 'live',
    accent: '#F97316',
    accent2: '#1E3A8A',
    icon: 'radar',
    order: 1,
    platforms: { ios: true, android: true },
    tech: ['Flutter', 'Node · Express', 'MongoDB', 'Socket.io', 'Firebase'],
    tagline: { en: 'Local pros, instantly', es: 'Técnicos locales, al instante' },
    statusLabel: { en: 'In App Store review', es: 'En revisión App Store' },
    description: {
      en: 'Connects clients with local technicians in real time. Post your problem with a photo, the app suggests a category with AI and nearby technicians find you instantly: quotes, chat and job tracking, all in one place.',
      es: 'Conecta a clientes con técnicos locales en tiempo real. Publica tu problema con una foto, la app sugiere categoría con IA y los técnicos cercanos te encuentran al instante: presupuestos, chat y seguimiento del trabajo, todo en un solo lugar.',
    },
    features: {
      en: [
        'Radar of nearby technicians by specialty',
        'Photo posting + AI category suggestion',
        'Quotes and chat in real time',
        'Push notifications for new jobs',
      ],
      es: [
        'Radar de técnicos cercanos por especialidad',
        'Publicación con foto + sugerencia por IA',
        'Presupuestos y chat en tiempo real',
        'Notificaciones push de nuevos trabajos',
      ],
    },
  },
  {
    slug: 'curbradar',
    name: 'CurbRadar',
    statusType: 'normal',
    accent: '#22C55E',
    accent2: '#0F766E',
    icon: 'pin',
    order: 2,
    platforms: { ios: true, android: true },
    tech: ['Flutter', 'Firebase Auth · FCM', 'REST', 'Socket.io'],
    tagline: { en: 'Free stuff near you', es: 'Objetos gratis cerca de ti' },
    statusLabel: { en: 'iOS · Android', es: 'iOS · Android' },
    description: {
      en: "A radar-map of items people leave for free on the curb. Post what you no longer use, discover treasures near you and get alerts when something new appears in your area. Reusing has never been easier.",
      es: 'Un mapa-radar de objetos que la gente deja gratis en la acera. Publica lo que ya no usas, descubre tesoros cerca de ti y recibe alertas cuando aparece algo nuevo en tu zona. Reutilizar nunca fue tan fácil.',
    },
    features: {
      en: [
        'Live map of nearby items',
        'Posting with photo and location',
        'Alerts by search radius',
        'Chat, ranking and referral program',
      ],
      es: [
        'Mapa en vivo de objetos cercanos',
        'Publicación con foto y ubicación',
        'Alertas por radio de búsqueda',
        'Chat, ranking y programa de referidos',
      ],
    },
  },
  {
    slug: 'skillfix',
    name: 'SkillFix',
    statusType: 'normal',
    accent: '#6366F1',
    accent2: '#7C3AED',
    icon: 'wrench',
    order: 3,
    platforms: { ios: true, android: true },
    tech: ['Flutter', 'YouTube API', 'Local-first'],
    tagline: { en: 'Repair and maintain your home', es: 'Repara y mantén tu hogar' },
    statusLabel: { en: 'iOS · Android', es: 'iOS · Android' },
    description: {
      en: 'Your home manual in your pocket. Video tutorials, guided fault diagnosis, calculators, maintenance reminders and emergency guides so you can fix yourself what used to require a professional.',
      es: 'Tu manual del hogar en el bolsillo. Tutoriales en video, diagnóstico guiado de averías, calculadoras, recordatorios de mantenimiento y guías de emergencia para que resuelvas tú mismo lo que antes requería un profesional.',
    },
    features: {
      en: [
        'Video tutorials by trade',
        'Step-by-step problem diagnosis',
        'Calculators and shopping lists',
        'Reminders and seasonal tasks',
      ],
      es: [
        'Tutoriales en video por oficio',
        'Diagnóstico de problemas paso a paso',
        'Calculadoras y listas de compra',
        'Recordatorios y tareas de temporada',
      ],
    },
  },
  {
    slug: 'tofast',
    name: 'ToFast',
    statusType: 'soon',
    accent: '#F43F5E',
    accent2: '#B91C1C',
    icon: 'bolt',
    order: 4,
    platforms: { ios: true, android: true },
    tech: ['Flutter'],
    tagline: { en: 'The best prices, without searching', es: 'Los mejores precios, sin buscar' },
    statusLabel: { en: 'Coming soon', es: 'Próximamente' },
    description: {
      en: "Your automatic bargain hunter. ToFast scans Revolico, Cuba's classifieds portal, to find you the best prices and alert you instantly when a new item appears within the price range you care about. Stop refreshing listings: the app searches for you.",
      es: 'Tu cazador de chollos automático. ToFast rastrea Revolico, el portal de compraventa de Cuba, para encontrarte los mejores precios y avisarte al instante cuando aparece un artículo nuevo dentro del rango de precio que te interesa. Deja de refrescar anuncios: la app busca por ti.',
    },
    features: {
      en: [
        'Finds the best prices on Revolico',
        'Real-time alerts for new items',
        'Filters by price range and category',
        'Instant push notifications',
      ],
      es: [
        'Encuentra los mejores precios en Revolico',
        'Alertas de artículos nuevos en tiempo real',
        'Filtros por rango de precio y categoría',
        'Notificaciones push al instante',
      ],
    },
  },
  {
    slug: 'promoff',
    name: 'PromOff',
    statusType: 'normal',
    accent: '#EAB308',
    accent2: '#C2410C',
    icon: 'tag',
    order: 5,
    platforms: { ios: true, android: false },
    tech: ['Flutter', 'Firebase'],
    tagline: { en: 'The best deals, in one tap', es: 'Las mejores ofertas, en un toque' },
    statusLabel: { en: 'ES · US', es: 'ES · US' },
    description: {
      en: 'All the deals, in your pocket. PromOff gathers store promotions and discounts in one place, so you discover the best offers near you and never miss one. With versions tailored for Spain and the United States.',
      es: 'Todas las ofertas, en tu bolsillo. PromOff reúne las promociones y descuentos de los comercios en un solo lugar, para que descubras las mejores ofertas cerca de ti y no te pierdas ninguna. Con versiones adaptadas para España y Estados Unidos.',
    },
    features: {
      en: [
        'Store deals and promotions',
        'Geolocated discounts near you',
        'Versions for Spain (ES) and the U.S. (US)',
        'New-promotion alerts',
      ],
      es: [
        'Ofertas y promociones de comercios',
        'Descuentos cerca de ti, geolocalizados',
        'Versiones para España (ES) y EE. UU. (US)',
        'Avisos de nuevas promociones',
      ],
    },
  },
];

(async () => {
  await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/porfolio');

  // Admin inicial
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  let admin = await User.findOne({ username });
  if (!admin) {
    admin = new User({ username, role: 'admin' });
    await admin.setPassword(password);
    await admin.save();
    console.log(`[SEED] Admin creado: ${username} / ${password}  (cámbialo tras entrar)`);
  } else {
    console.log(`[SEED] Admin ya existía: ${username}`);
  }

  // Proyectos: upsert por slug (crea o actualiza el contenido localizado sin borrar imágenes)
  for (const proj of PROJECTS) {
    await Project.updateOne({ slug: proj.slug }, { $set: proj }, { upsert: true });
  }
  console.log(`[SEED] ${PROJECTS.length} proyectos actualizados/creados (EN + ES).`);

  console.log('[SEED] Listo.');
  process.exit(0);
})().catch((err) => {
  console.error('[SEED] Error:', err);
  process.exit(1);
});
