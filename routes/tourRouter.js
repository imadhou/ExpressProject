const express = require('express');

const tourController = require('../controllers/TourController');

const router = express.Router();

//router.param('id', tourController.checkId);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id').get(tourController.getTour);

module.exports = router;
