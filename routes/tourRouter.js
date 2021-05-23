const express = require('express');
const tourController = require(`${__dirname}/../controllers/TourController`);

const router = express.Router();
router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkPost, tourController.createTour);

router.route('/:id').get(tourController.getTour);

module.exports = router;
