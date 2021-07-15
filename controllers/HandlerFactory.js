const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, resp, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ErrorHandler('No document was found', 404));
    }
    resp.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, resp, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new ErrorHandler('No document was found', 404));
    }
    resp.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, resp, next) => {
    const doc = await Model.create(req.body);
    resp.status(201).json({
      status: 'success',
      data: {
        tours: doc,
      },
    });
  });

exports.getOne = (Model, options) =>
  catchAsync(async (req, resp, next) => {
    let query = Model.findById(req.params.id);
    if (options) query = query.populate(options);
    const doc = await query;

    if (!doc) {
      return next(new ErrorHandler('No document was found', 404));
    }
    resp.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, resp, next) => {
    //allow nested get routes on get (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.Query;

    resp.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
