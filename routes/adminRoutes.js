const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// admin login post - postAdminLogin
router.post('/login', adminController.postAdminLogin);

// HR manager add post - postAddHRM
router.post('/addHR', auth.requireAuth, adminController.postAddHRM);

// get HR manager details
router.get('/getHRM', auth.requireAuth, adminController.getHRM);

module.exports = router;