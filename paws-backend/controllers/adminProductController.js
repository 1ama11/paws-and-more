const Product = require('../models/Product');
const multer  = require('multer');
const path    = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif/;
    const extOk  = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = /image\//.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /admin/products
const listProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/products', { title: 'Manage Products', products });
    } catch (err) {
        next(err);
    }
};

// GET /admin/products/add
const getAddProduct = (req, res) => {
    res.render('admin/add-product', { title: 'Add Product', error: null });
};

// POST /admin/products/add
const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const image = req.file ? req.file.filename : '';
        await Product.create({ name, description, price: Number(price), stock: Number(stock), category, image });
        res.redirect('/admin/products');
    } catch (err) {
        res.render('admin/add-product', { title: 'Add Product', error: err.message });
    }
};

// GET /admin/products/edit/:id
const getEditProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).render('error', { message: 'Product not found', status: 404, title: 'Error' });
        res.render('admin/edit-product', { title: 'Edit Product', product, error: null });
    } catch (err) {
        next(err);
    }
};

// POST /admin/products/edit/:id
const editProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const image = req.file ? req.file.filename : req.body.oldImage;
        await Product.findByIdAndUpdate(req.params.id, {
            name, description, price: Number(price), stock: Number(stock), category, image
        });
        res.redirect('/admin/products');
    } catch (err) {
        const product = await Product.findById(req.params.id).catch(() => null);
        if (!product) return next(err);
        res.render('admin/edit-product', { title: 'Edit Product', product, error: err.message });
    }
};

// POST /admin/products/delete/:id
const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};

module.exports = { upload, listProducts, getAddProduct, addProduct, getEditProduct, editProduct, deleteProduct };
