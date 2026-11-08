const fs = require('fs');
const path = require('path');
const express = require('express');
const Project = require('../models/Project');
const icons = require('../utils/icons');
const { dropBrokenDownloads } = require('../utils/downloadAvailability');
const { SUPPORTED, DEFAULT, translate } = require('../utils/i18n');
const { getSiteData } = require('../utils/siteData');

const router = express.Router();

// Web pública en Vue (client/dist, generada con `cd client && npm run build`).
// Si todavía no se ha compilado, se sirve la versión anterior en EJS para no dejar el sitio caído.
const INDEX = path.join(__dirname, '..', '..', 'client', 'dist', 'index.html');
const SITE_URL = (process.env.SITE_URL || 'https://krbusinessventures.org').replace(/\/+$/, '');

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Cambiar de idioma (enlaces antiguos y sin JS): guarda cookie y vuelve a la página anterior.
router.get('/lang/:lang', (req, res) => {
  const lang = SUPPORTED.includes(req.params.lang) ? req.params.lang : DEFAULT;
  res.cookie('lang', lang, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
  });
  const back = req.get('referer') || '/';
  res.redirect(back);
});

// Portfolio público
router.get('/', async (req, res, next) => {
  try {
    if (fs.existsSync(INDEX)) {
      // Los datos viajan dentro del HTML (bloque JSON, no se ejecuta, compatible con la CSP):
      // la página pinta al instante sin esperar a una segunda petición.
      const data = await getSiteData();
      const lang = res.locals.lang;
      const json = JSON.stringify(data).replace(/</g, '\\u003c');
      const html = fs
        .readFileSync(INDEX, 'utf8')
        .replace('<html lang="en">', () => `<html lang="${lang}">`)
        .replace(/<title>[^<]*<\/title>/, () => `<title>${escAttr(translate(lang, 'metaTitle'))}</title>`)
        .replace(
          /<meta name="description" content="[^"]*"/,
          () => `<meta name="description" content="${escAttr(translate(lang, 'metaDesc'))}"`
        )
        .replace(/<meta property="og:title" content="[^"]*"/, () => `<meta property="og:title" content="${escAttr(translate(lang, 'metaTitle'))}"`)
        .replace(/<meta property="og:description" content="[^"]*"/, () => `<meta property="og:description" content="${escAttr(translate(lang, 'metaDesc'))}"`)
        .replace(/https:\/\/krbusinessventures\.org\//g, () => `${SITE_URL}/`)
        .replace('<script id="site-data" type="application/json">null</script>', () => `<script id="site-data" type="application/json">${json}</script>`);
      res.set('Cache-Control', 'no-cache').type('html').send(html);
      return;
    }

    // Versión anterior (EJS)
    const projects = await Project.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean();
    await dropBrokenDownloads(projects); // sin APK subido en el VPS no se muestra el boton
    res.render('public/index', { projects, icons, year: new Date().getFullYear() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
