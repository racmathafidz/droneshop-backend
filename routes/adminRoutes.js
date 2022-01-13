const { Router } = require('express');

const { cloudinaryConfig, multerUploads } = require('../config/cloudinary');
const adminControllers = require('../controllers/adminControllers');

const router = Router();

// Index endpoint
router.get('/', adminControllers.get_index);

// Transactions endpoint
router.get('/transactions/waiting-payment', adminControllers.get_transactions_waiting_for_payment);

// Products endpoint
router.use('/products/*', cloudinaryConfig);
router.get('/products', adminControllers.get_all_products);
router.get('/products/add', adminControllers.get_add_products);
router.post('/products/add', multerUploads, adminControllers.post_add_products);
router.post('/products/delete/:id', adminControllers.post_delete_products);
router.get('/products/edit/:id', adminControllers.get_update_products);
router.post('/products/edit/:id', multerUploads, adminControllers.put_update_products);

module.exports = router;
