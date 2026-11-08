const User = require('../models/User');

// Exige sesión iniciada; si no, redirige al login.
async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/admin/login');
  }
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      req.session.destroy(() => {});
      return res.redirect('/admin/login');
    }
    req.user = user;
    res.locals.currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
}

// Exige rol admin (para gestionar usuarios).
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('admin/error', {
      title: 'Sin permiso',
      message: 'Necesitas rol de administrador para esta sección.',
    });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
