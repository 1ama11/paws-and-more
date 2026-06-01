// ===============================================
//  Shared auth middleware — used by all teammates
// ===============================================

// requireAuth: user must be logged in
exports.requireAuth = (req, res, next) => {
  if (req.session.user) return next();
  const wantsJson = req.xhr
      || (req.headers.accept && req.headers.accept.includes('json'))
      || (req.headers['content-type'] && req.headers['content-type'].includes('json'));
  if (wantsJson) {
      return res.status(401).json({ error: 'login_required' });
  }
  res.status(401).render('error', {
    message: 'You must be logged in to access this page.',
    status: 401,
    title: 'Unauthorized'
  });
};

// requireAdmin: user must be logged in AND have type === 'admin'
exports.requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.type === 'admin') return next();
  res.status(403).render('error', {
    message: 'Admins only.',
    status: 403,
    title: 'Forbidden'
  });
};

// requireGuest: user must NOT be logged in (useful for /login, /signup pages)
exports.requireGuest = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect('/');
};
