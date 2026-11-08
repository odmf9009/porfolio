require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const connectDB = require('./src/config/db');
const i18n = require('./src/utils/i18n');
const siteContent = require('./src/utils/siteContent');
const publicRoutes = require('./src/routes/public');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');

const app = express();
// Detrás de nginx: confía en el proxy para que req.secure/cookies seguras funcionen con HTTPS.
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/porfolio';

// Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Seguridad. CSP permite estilos inline (variables --accent), Google Fonts e imágenes propias/data.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Parsers y estáticos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Idioma (query > cookie > inglés por defecto). Expone t() y loc() a las vistas.
app.use(i18n.middleware);

// Sesiones (almacenadas en MongoDB → escalable a varios procesos)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-cambiame',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI, ttl: 60 * 60 * 24 * 7 }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Rutas
app.use('/', publicRoutes);
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('No encontrado');
});

// Errores
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).send('Error del servidor');
});

connectDB(MONGODB_URI)
  .then(async () => {
    await siteContent.refresh(); // carga los textos editables del sitio desde la BD
    app.listen(PORT, () => console.log(`[SERVER] Portfolio en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[DB] No se pudo conectar:', err.message);
    process.exit(1);
  });
