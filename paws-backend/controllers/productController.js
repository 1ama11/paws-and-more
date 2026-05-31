const Product = require('../models/Product');

// GET /shop  — renders the shop page (products loaded client-side via /shop/api)
const getShopPage = (req, res) => {
    res.render('shop', { title: 'Shop', active: 'shop', extraCss: ['shop.css'], extraJs: ['shop.js'] });
};

// GET /shop/api  — JSON list of all products
const getProductsJson = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// GET /shop/api/:id  — JSON single product
const getSingleProductJson = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

module.exports = { getShopPage, getProductsJson, getSingleProductJson };
