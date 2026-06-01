const Order   = require('../models/Order');
const Product = require('../models/Product');

// POST /orders  — place an order (requires login)
const createOrder = async (req, res, next) => {
    try {
        const { fullName, address, items, total, donated } = req.body;

        const errors = [];
        if (!fullName || fullName.trim().length < 2) errors.push('Full name must be at least 2 characters');
        if (!address  || address.trim().length  < 5) errors.push('Address must be at least 5 characters');
        if (!items    || items.length === 0)         errors.push('Cart is empty');
        if (!total    || total <= 0)                 errors.push('Invalid total amount');

        if (errors.length > 0)
            return res.status(400).json({ message: errors.join(', ') });

        // Decrement stock for each item
        for (const item of items) {
            const itemId = item._id || item.id;
            if (itemId) {
                await Product.findByIdAndUpdate(itemId, { $inc: { stock: -item.qty } });
            }
        }

        const userId = req.session.user ? req.session.user._id : null;
        const order  = await Order.create({ userId, fullName, address, items, total, donated });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        next(err);
    }
};

// GET /orders/my-orders  — logged-in user's orders (EJS)
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.session.user._id }).sort({ createdAt: -1 });
        res.render('my-orders', { title: 'My Orders', orders });
    } catch (err) {
        next(err);
    }
};

// GET /admin/orders  — all orders (EJS, admin only)
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('admin/orders', { title: 'All Orders', orders });
    } catch (err) {
        next(err);
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders };
