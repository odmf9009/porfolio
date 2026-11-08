const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // ruta pública, p.ej. /uploads/xxx.jpg
    caption: { type: String, default: '' },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    // Campos localizados (en / es)
    tagline: { en: { type: String, default: '' }, es: { type: String, default: '' } },
    description: { en: { type: String, default: '' }, es: { type: String, default: '' } },

    // Estado mostrado en la tarjeta (localizado)
    statusLabel: { en: { type: String, default: '' }, es: { type: String, default: '' } },
    statusType: { type: String, enum: ['normal', 'live', 'soon'], default: 'normal' },

    // Colores de acento de la tarjeta
    accent: { type: String, default: '#F97316' },
    accent2: { type: String, default: '#1E3A8A' },

    // Icono (clave de un set incorporado; ver src/utils/icons.js)
    icon: { type: String, enum: ['radar', 'pin', 'wrench', 'bolt', 'tag', 'app'], default: 'app' },

    features: { en: { type: [String], default: [] }, es: { type: [String], default: [] } },
    tech: { type: [String], default: [] }, // no se traduce (nombres de tecnologías)

    platforms: {
      ios: { type: Boolean, default: true },
      android: { type: Boolean, default: true },
    },

    images: { type: [imageSchema], default: [] },

    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },

    // --- Escalabilidad futura (métricas / monetización). No se usa aún. ---
    metrics: {
      activeUsers: { type: Number, default: 0 },
      monthlyRevenue: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    storeLinks: {
      appStore: { type: String, default: '' },
      playStore: { type: String, default: '' },
    },

    // Descarga directa fuera de las tiendas (ej. APK mientras se espera la
    // aprobacion de Google Play). "url" normalmente apunta a una URL
    // publica y estable de cuadro_mando (/downloads/<id>.apk) que siempre
    // sirve la ultima version subida ahi -> no hace falta tocar esto cada
    // vez que se sube un archivo nuevo, solo la primera vez que se activa.
    directDownload: {
      url: { type: String, default: '' },
      label: { en: { type: String, default: '' }, es: { type: String, default: '' } },
    },
  },
  { timestamps: true }
);

projectSchema.index({ order: 1 });

module.exports = mongoose.model('Project', projectSchema);
