const catchAsync = require('../utils/catchAsync');
const Review = require('../models/ReviewModel');

exports.createReview = catchAsync(async (req, resp, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  const newReview = await Review.create(req.body);

  resp.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

exports.getReviews = catchAsync(async (req, resp, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  resp.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});
