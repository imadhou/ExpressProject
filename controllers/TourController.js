/* eslint-disable arrow-body-style */
const Tour = require('../models/TourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');
const HandlerFactory = require('./HandlerFactory');

//takes an async function as a parameter returns a call to that function (promise) if resolved or call to next
//inside the catch, so the global error handler will be automatically called

exports.getAllTours = HandlerFactory.getAll(Tour);
exports.getTour = HandlerFactory.getOne(Tour, { path: 'reviews' });
exports.createTour = HandlerFactory.createOne(Tour);
exports.updateTour = HandlerFactory.updateOne(Tour);
exports.deleteTour = HandlerFactory.deleteOne(Tour);

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
