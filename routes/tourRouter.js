const express = require('express');

const tourController = require('../controllers/TourController');
const authController = require('../controllers/AuthController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protectRoute,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router.route('/stats').get(tourController.getTourStats);

router
  .route('/tours-within/:distance/center/:latlng')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng').get(tourController.getDistances);

router
  .route('/monthly/:year')
  .get(
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    tourController.updateTour,
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide')
  )
  .delete(
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
