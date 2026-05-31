const express = require('express');
const router = express.Router();
const { showForm, submitForm } = require('../controllers/applicationController');
const { requireAuth } = require('../middleware/auth');

router.get('/', showForm);
router.post('/', requireAuth, submitForm);

module.exports = router;