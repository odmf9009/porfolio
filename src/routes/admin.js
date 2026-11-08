const express = require('express');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const User = require('../models/User');
const Content = require('../models/Content');
const icons = require('../utils/icons');
const contentGroups = require('../utils/contentFields');
const siteContent = require('../utils/siteContent');
const { strings } = require('../utils/i18n');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload, UPLOAD_DIR } = require('../middleware/upload');

const router = express.Router();

// Todo lo de aquí requiere sesión
router.use(requireAuth);

// ── Utilidades ────────────────────────────────────────────────────────────────
function lines(str) {
  return String(str || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD') // separa letra base + tilde; la tilde no es [a-z0-9] y se elimina abajo
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function projectFromBody(body) {
  return {
    name: String(body.name || '').trim(),
    tagline: { en: String(body.tagline_en || '').trim(), es: String(body.tagline_es || '').trim() },
    description: {
      en: String(body.description_en || '').trim(),
      es: String(body.description_es || '').trim(),
    },
    statusLabel: {
      en: String(body.statusLabel_en || '').trim(),
      es: String(body.statusLabel_es || '').trim(),
    },
    statusType: ['normal', 'live', 'soon'].includes(body.statusType) ? body.statusType : 'normal',
    accent: String(body.accent || '#F97316'),
    accent2: String(body.accent2 || '#1E3A8A'),
    icon: ['radar', 'pin', 'wrench', 'bolt', 'tag', 'app'].includes(body.icon) ? body.icon : 'app',
    features: { en: lines(body.features_en), es: lines(body.features_es) },
    tech: lines(body.tech),
    platforms: { ios: !!body.ios, android: !!body.android },
    order: Number(body.order) || 0,
    published: !!body.published,
    storeLinks: {
      appStore: String(body.appStoreUrl || '').trim(),
      playStore: String(body.playStoreUrl || '').trim(),
    },
    directDownload: {
      url: String(body.ddUrl || '').trim(),
      label: { en: String(body.ddLabelEn || '').trim(), es: String(body.ddLabelEs || '').trim() },
    },
  };
}

// ── Dashboard ───────────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const [projects, usersCount] = await Promise.all([
      Project.find().sort({ order: 1, createdAt: 1 }).lean(),
      User.countDocuments(),
    ]);
    res.render('admin/dashboard', {
      title: 'Panel',
      projects,
      usersCount,
      icons,
    });
  } catch (err) {
    next(err);
  }
});

// ── Nuevo proyecto ───────────────────────────────────────────────────────────
router.get('/projects/new', (req, res) => {
  res.render('admin/project-form', {
    title: 'Nuevo proyecto',
    project: null,
    icons,
    error: null,
  });
});

router.post('/projects', async (req, res, next) => {
  try {
    const data = projectFromBody(req.body);
    if (!data.name) {
      return res.status(400).render('admin/project-form', {
        title: 'Nuevo proyecto',
        project: req.body,
        icons,
        error: 'El nombre es obligatorio.',
      });
    }
    let slug = slugify(req.body.slug || data.name);
    if (await Project.exists({ slug })) slug = `${slug}-${Date.now().toString(36)}`;
    await Project.create({ ...data, slug });
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

// ── Editar proyecto ──────────────────────────────────────────────────────────
router.get('/projects/:id/edit', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.redirect('/admin');
    res.render('admin/project-form', { title: `Editar ${project.name}`, project, icons, error: null });
  } catch (err) {
    next(err);
  }
});

router.post('/projects/:id', async (req, res, next) => {
  try {
    const data = projectFromBody(req.body);
    if (req.body.slug) data.slug = slugify(req.body.slug);
    await Project.findByIdAndUpdate(req.params.id, data, { runValidators: true });
    res.redirect(`/admin/projects/${req.params.id}/edit`);
  } catch (err) {
    next(err);
  }
});

// ── Eliminar proyecto (borra también sus imágenes del disco) ─────────────────
router.post('/projects/:id/delete', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      for (const img of project.images) removeUpload(img.url);
      await project.deleteOne();
    }
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

// ── Imágenes: subir ──────────────────────────────────────────────────────────
router.post('/projects/:id/images', upload.array('images', 10), async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.redirect('/admin');
    for (const file of req.files || []) {
      project.images.push({ url: `/uploads/${file.filename}`, caption: '' });
    }
    await project.save();
    res.redirect(`/admin/projects/${req.params.id}/edit`);
  } catch (err) {
    next(err);
  }
});

// ── Imágenes: eliminar ───────────────────────────────────────────────────────
router.post('/projects/:id/images/:imageId/delete', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      const img = project.images.id(req.params.imageId);
      if (img) {
        removeUpload(img.url);
        img.deleteOne();
        await project.save();
      }
    }
    res.redirect(`/admin/projects/${req.params.id}/edit`);
  } catch (err) {
    next(err);
  }
});

function removeUpload(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const file = path.join(UPLOAD_DIR, path.basename(url));
  fs.promises.unlink(file).catch(() => {});
}

// ── Contenido del sitio (textos de las secciones) ────────────────────────────
router.get('/content', async (req, res, next) => {
  try {
    const docs = await Content.find().lean();
    const map = {};
    docs.forEach((d) => {
      map[d.key] = { en: d.en, es: d.es };
    });
    res.render('admin/content', {
      title: 'Contenido',
      groups: contentGroups,
      values: map,
      strings,
      saved: req.query.saved === '1',
    });
  } catch (err) {
    next(err);
  }
});

router.post('/content', async (req, res, next) => {
  try {
    const ops = [];
    for (const g of contentGroups) {
      for (const f of g.fields) {
        const en = String(req.body[`en__${f.key}`] ?? '').trim();
        const es = String(req.body[`es__${f.key}`] ?? '').trim();
        ops.push({
          updateOne: { filter: { key: f.key }, update: { $set: { en, es } }, upsert: true },
        });
      }
    }
    if (ops.length) await Content.bulkWrite(ops);
    await siteContent.refresh(); // recarga la caché: los cambios se ven al instante en la web
    res.redirect('/admin/content?saved=1');
  } catch (err) {
    next(err);
  }
});

// ── Usuarios (solo admin) ────────────────────────────────────────────────────
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: 1 }).lean();
    res.render('admin/users', { title: 'Usuarios', users, error: null });
  } catch (err) {
    next(err);
  }
});

router.post('/users', requireAdmin, async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const role = ['admin', 'editor'].includes(req.body.role) ? req.body.role : 'editor';
    const users = await User.find().sort({ createdAt: 1 }).lean();
    if (!username || password.length < 6) {
      return res.status(400).render('admin/users', {
        title: 'Usuarios',
        users,
        error: 'Usuario requerido y contraseña de al menos 6 caracteres.',
      });
    }
    if (await User.exists({ username })) {
      return res.status(400).render('admin/users', {
        title: 'Usuarios',
        users,
        error: 'Ese usuario ya existe.',
      });
    }
    const user = new User({ username, role });
    await user.setPassword(password);
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

// Cambiar contraseña de un usuario
router.post('/users/:id/password', requireAdmin, async (req, res, next) => {
  try {
    const password = String(req.body.password || '');
    const user = await User.findById(req.params.id);
    if (user && password.length >= 6) {
      await user.setPassword(password);
      await user.save();
    }
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

// Eliminar usuario (no puedes eliminarte a ti mismo ni el último admin)
router.post('/users/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.redirect('/admin/users');
    const target = await User.findById(req.params.id);
    if (target && target.role === 'admin') {
      const admins = await User.countDocuments({ role: 'admin' });
      if (admins <= 1) return res.redirect('/admin/users');
    }
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
