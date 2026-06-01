const express = require('express');
const router  = express.Router();
const { getShopPage, getProductsJson, getSingleProductJson } = require('../controllers/productController');

router.get('/',       getShopPage);
router.get('/api',    getProductsJson);
router.get('/api/:id', getSingleProductJson);

module.exports = router;
