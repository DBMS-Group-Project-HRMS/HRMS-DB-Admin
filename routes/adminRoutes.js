const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// admin login post - postAdminLogin
router.post('/login', adminController.postAdminLogin);

// HR manager add post - postAddHRM
router.post('/addHR', auth.requireAuth, adminController.postAddHRM);

module.exports = router;