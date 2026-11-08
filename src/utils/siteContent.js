const Content = require('../models/Content');
const { applyOverrides } = require('./i18n');

// Carga todos los textos editables de la BD y los aplica como sobrescrituras de i18n.
async function refresh() {
  const docs = await Content.find().lean();
  const map = {};
  docs.forEach((d) => {
    map[d.key] = { en: d.en, es: d.es };
  });
  applyOverrides(map);
  return map;
}

module.exports = { refresh };
