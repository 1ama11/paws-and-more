const express = require('express');
const router = express.Router();
const { requireAuth, requireGuest } = require('../middleware/auth');
const c = require('../controllers/userController');

router.get('/signup',  requireGuest, c.getSignup);
router.post('/signup', requireGuest, c.postSignup);
router.get('/login',   requireGuest, c.getLogin);
router.post('/login',  requireGuest, c.postLogin);
router.get('/logout',  c.logout);
router.get('/profile', requireAuth, c.getProfile);
router.post('/profile', requireAuth, c.updateProfile);

module.exports = router;