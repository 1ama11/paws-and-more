const User = require('../models/User');

// GET /admin/users
exports.listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const q = req.query.q || '';

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = q ? { $or: [
      { name:  { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } }
    ]} : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render('admin/users', {
      title: 'Manage Users', users, q,
      page, totalPages: Math.ceil(total / perPage), total
    });
  } catch (err) { next(err); }
};

// GET /admin/users/:id
exports.viewUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).render('error', { message: 'User not found', status: 404, title: 'Not Found' });
    res.render('admin/view-user', { title: user.name, userDoc: user });
  } catch (err) { next(err); }
};

// POST /admin/users/:id/role  (toggle customer ↔ admin)
exports.toggleRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect('/admin/users');
    user.type = user.type === 'admin' ? 'customer' : 'admin';
    await user.save();
    if (req.session.user._id.toString() === user._id.toString()) {
      req.session.user.type = user.type;
    }
    res.redirect('/admin/users');
  } catch (err) { next(err); }
};

// POST /admin/users/:id/delete
exports.deleteUser = async (req, res, next) => {
  try {
    // safety: don't let admin delete themselves
    if (req.session.user._id.toString() === req.params.id) {
      return res.redirect('/admin/users');
    }
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (err) { next(err); }
};