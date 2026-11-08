const mongoose = require('mongoose');

// Almacena el texto editable de las secciones del sitio (clave -> valor por idioma).
// Sobrescribe los textos por defecto de src/utils/i18n.js cuando existe.
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    en: { type: String, default: '' },
    es: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
