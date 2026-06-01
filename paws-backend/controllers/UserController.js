const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET /user/signup
exports.getSignup = (req, res) => res.render('signup', { title: 'Sign Up', error: null });

// POST /user/signup
exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, phone, address, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !address || !password)
      return res.render('signup', { title: 'Sign Up', error: 'All fields are required.' });
    if (password !== confirmPassword)
      return res.render('signup', { title: 'Sign Up', error: 'Passwords do not match.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.render('signup', { title: 'Sign Up', error: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, phone, address, password: hashed });

    req.session.user = { _id: user._id, name: user.name, email: user.email, type: user.type };
    res.redirect('/user/profile');
  } catch (err) { next(err); }
};

// GET /user/login
exports.getLogin = (req, res) => res.render('login', { title: 'Login', error: null });

// POST /user/login
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render('login', { title: 'Login', error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('login', { title: 'Login', error: 'Invalid credentials.' });

    req.session.user = { _id: user._id, name: user.name, email: user.email, type: user.type };
    res.redirect(user.type === 'admin' ? '/admin' : '/user/profile');
  } catch (err) { next(err); }
};

// GET /user/logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

// GET /user/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('profile', { title: 'My Profile', userDoc: user, message: null });
  } catch (err) { next(err); }
};

// POST /user/profile  (update own profile)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.session.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    req.session.user.name = updated.name;
    res.render('profile', { title: 'My Profile', userDoc: updated, message: 'Profile updated.' });
  } catch (err) { next(err); }
};