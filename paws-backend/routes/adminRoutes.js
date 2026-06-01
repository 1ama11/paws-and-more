const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

const {
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
} = require('../controllers/adminController');

router.use(requireAdmin);

// dashboard
router.get('/', getDashboard);

// pets
router.get('/pets', getAllPets);
router.get('/pets/add', getAddPet);
router.post('/pets/add', upload.single('image'), addPet);
router.get('/pets/edit/:id', getEditPet);
router.post('/pets/edit/:id', upload.single('image'), editPet);
router.post('/pets/delete/:id', deletePet);

// applications
router.get('/applications', getApplications);
router.post('/applications/:id', updateApplicationStatus);

const adminUser = require('../controllers/adminUserController');
router.get('/users',                adminUser.listUsers);
router.get('/users/:id',            adminUser.viewUser);
router.post('/users/:id/role',      adminUser.toggleRole);
router.post('/users/:id/delete',    adminUser.deleteUser);

const ap = require('../controllers/adminProductController');
router.get('/products',              ap.listProducts);
router.get('/products/add',          ap.getAddProduct);
router.post('/products/add',         ap.upload.single('image'), ap.addProduct);
router.get('/products/edit/:id',     ap.getEditProduct);
router.post('/products/edit/:id',    ap.upload.single('image'), ap.editProduct);
router.post('/products/delete/:id',  ap.deleteProduct);

const { getAllOrders } = require('../controllers/orderController');
router.get('/orders', getAllOrders);

module.exports = router;