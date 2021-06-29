const express = require('express');
const reviewController = require('../controllers/ReviewController');
const authController = require('../controllers/AuthController');

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protectRoute,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
