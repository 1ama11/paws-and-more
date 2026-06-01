const express = require('express');
const router = express.Router();

router.get('/',              (req, res) => res.render('index',   { title: 'Home',    active: 'home' }));
router.get('/about',         (req, res) => res.render('about',   { title: 'About',   active: 'about' }));
router.get('/contact',       (req, res) => res.render('contact', { title: 'Contact', active: 'contact' }));
router.get('/policy',        (req, res) => res.render('policy',  { title: 'Policy',  active: 'policy' }));
router.get('/adoption',      (req, res) => res.redirect('/pets'));
router.get('/adoption/list', (req, res) => res.redirect('/pets'));

module.exports = router;