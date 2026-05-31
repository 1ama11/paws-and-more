const express = require('express');
const router = express.Router();
const { getAllPets, getPetDetails } = require('../controllers/petController');

router.get('/', getAllPets);
router.get('/:name', getPetDetails);

module.exports = router;