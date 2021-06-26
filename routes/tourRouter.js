const express = require('express');

const tourController = require('../controllers/TourController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/')
  .get(authController.protectRoute, tourController.getAllTours)
  .post(tourController.createTour);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protectRoute,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
