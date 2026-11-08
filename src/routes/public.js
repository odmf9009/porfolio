const express = require('express');
const Project = require('../models/Project');
const icons = require('../utils/icons');
const { dropBrokenDownloads } = require('../utils/downloadAvailability');
const { SUPPORTED, DEFAULT } = require('../utils/i18n');

const router = express.Router();

// Cambiar de idioma: guarda cookie y vuelve a la página anterior.
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
    const projects = await Project.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    await dropBrokenDownloads(projects); // sin APK subido en el VPS no se muestra el boton
    res.render('public/index', {
      projects,
      icons,
      year: new Date().getFullYear(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
