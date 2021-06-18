/* eslint-disable arrow-body-style */
const Tour = require('../models/TourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');

exports.getAllTours = catchAsync(async (req, resp, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.Query;

  resp.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, resp, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new ErrorHandler('No tour was found', 404));
  }
  resp.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//takes an async function as a parameter returns a call to that function (promise) if resolved or call to next
//inside the catch, so the global error handler will be automatically called

exports.createTour = catchAsync(async (req, resp, next) => {
  const newTour = await Tour.create(req.body);
  resp.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, resp, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new ErrorHandler('No tour was found', 404));
  }
  resp.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, resp, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new ErrorHandler('No tour was found', 404));
  }
  resp.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, resp, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numRantings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  resp.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, resp, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numToursStarts: -1,
      },
    },
  ]);

  resp.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
