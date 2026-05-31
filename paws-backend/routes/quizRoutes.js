const express = require('express');
const router = express.Router();
const { showQuiz, showResults } = require('../controllers/quizController');

router.get('/', showQuiz);
router.post('/results', showResults);

module.exports = router;
