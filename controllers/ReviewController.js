const Review = require('../models/ReviewModel');
const HandlerFactory = require('./HandlerFactory');

exports.setIds = (req, resp, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};

exports.getReviews = HandlerFactory.getAll(Review);
exports.getReview = HandlerFactory.getOne(Review);
exports.createReview = HandlerFactory.createOne(Review);
exports.updateReview = HandlerFactory.updateOne(Review);
exports.deleteReview = HandlerFactory.deleteOne(Review);
