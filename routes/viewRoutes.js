const express = require('express');
const viewsContoller = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsContoller.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsContoller.getTour);
router.get('/login', authController.isLoggedIn, viewsContoller.getLoginForm);
router.get('/me', authController.protect, viewsContoller.getAccount);

// /login

module.exports = router;
