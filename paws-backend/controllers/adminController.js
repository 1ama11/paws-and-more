const Pet         = require('../models/Pet');
const Application = require('../models/Application');
const Product     = require('../models/Product');
const Order       = require('../models/Order');
const User        = require('../models/User');
const multer = require('multer');
const path = require('path');

// multer setup - saves images to public/images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk  = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Dashboard
const getDashboard = async (req, res, next) => {
    try {
        const totalPets = await Pet.countDocuments();
        const availablePets = await Pet.countDocuments({ isAvailable: true });
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });
        const totalProducts   = await Product.countDocuments();
        const totalOrders     = await Order.countDocuments();
        const totalUsers      = await User.countDocuments();
        const totalCustomers  = await User.countDocuments({ type: 'customer' });

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            totalPets,
            availablePets,
            totalApplications,
            pendingApplications,
            totalProducts,
            totalOrders,
            totalUsers,
            totalCustomers
        });
    } catch (err) {
        next(err);
    }
};

// Pets
const getAllPets = async (req, res, next) => {
    try {
        const pets = await Pet.find();
        res.render('admin/pets', { title: 'Manage Pets', pets });
    } catch (err) {
        next(err);
    }
};

const getAddPet = (req, res) => {
    res.render('admin/add-pet', { title: 'Add Pet', error: null });
};

const addPet = async (req, res, next) => {
    try {
        const { name, breed, age, desc, type } = req.body;
        const imageUrl = req.file ? req.file.filename : 'default.jpg';
        await Pet.create({ name, breed, age, desc, type, imageUrl });
        res.redirect('/admin/pets');
    } catch (err) {
        const msg = err.code === 11000 ? 'A pet with that name already exists.' : err.message;
        res.render('admin/add-pet', { title: 'Add Pet', error: msg });
    }
};

const getEditPet = async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).render('error', { message: 'Pet not found', status: 404, title: 'Error' });
        res.render('admin/edit-pet', { title: 'Edit Pet', pet, error: null });
    } catch (err) {
        next(err);
    }
};

const editPet = async (req, res, next) => {
    try {
        const { name, breed, age, desc, type } = req.body;
        const imageUrl = req.file ? req.file.filename : req.body.oldImage;
        await Pet.findByIdAndUpdate(req.params.id, { name, breed, age, desc, type, imageUrl });
        res.redirect('/admin/pets');
    } catch (err) {
        const pet = await Pet.findById(req.params.id).catch(() => null);
        if (!pet) return next(err);
        const msg = err.code === 11000 ? 'A pet with that name already exists.' : err.message;
        res.render('admin/edit-pet', { title: 'Edit Pet', pet, error: msg });
    }
};

const deletePet = async (req, res, next) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.redirect('/admin/pets');
    } catch (err) {
        next(err);
    }
};

// Applications
const getApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ status: 'pending' });
        res.render('admin/applications', { title: 'Applications', applications });
    } catch (err) {
        next(err);
    }
};

const updateApplicationStatus = async (req, res, next) => {
    try {
        const VALID_STATUSES = ['pending', 'approved', 'rejected'];
        if (!VALID_STATUSES.includes(req.body.status)) {
            return res.redirect('/admin/applications');
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!application) return res.redirect('/admin/applications');

        // if rejected, make the pet available again
        if (req.body.status === 'rejected') {
            await Pet.findOneAndUpdate({ name: application.petName }, { isAvailable: true });
        }

        res.redirect('/admin/applications');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    upload,
    getDashboard,
    getAllPets,
    getAddPet,
    addPet,
    getEditPet,
    editPet,
    deletePet,
    getApplications,
    updateApplicationStatus
};