const express = require('express');
const viewsContoller = require('../controllers/viewsController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewsContoller.alerts);

router.get('/', authController.isLoggedIn, viewsContoller.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsContoller.getTour);
router.get('/signup', viewsContoller.getSignupForm);
router.get('/login', authController.isLoggedIn, viewsContoller.getLoginForm);
router.get('/me', authController.protect, viewsContoller.getAccount);
router.get(
  '/my-tours',
  // bookingController.webhookCheckout,
  authController.protect,
  viewsContoller.getMyTours
);

// /login

module.exports = router;
