const express = require('express');
const { getSiteData } = require('../utils/siteData');

const router = express.Router();

// Datos públicos del sitio (textos en/es + proyectos publicados). Solo lectura.
router.get('/site', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-cache');
    res.json(await getSiteData());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
