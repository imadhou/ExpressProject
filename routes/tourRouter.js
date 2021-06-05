const express = require('express');

const tourController = require('../controllers/TourController');

// we use Router for getting a better routes instead
//of calling app.VERB() for all the functions handling a route
//here we define all the verbs for a single route
const router = express.Router();

//router.param('id', tourController.checkId);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
