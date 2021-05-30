const Tour = require('../models/TourModel');

exports.getAllTours = async (req, resp) => {
  try {
    const tours = await Tour.find();
    resp.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    resp.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getTour = async (req, resp) => {
  try {
    const tour = await Tour.findById(req.params.id);
    resp.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    resp.status(404).json({
      status: 'not found',
      message: err,
    });
  }
};

exports.createTour = async (req, resp) => {
  try {
    const newTour = await Tour.create(req.body);
    resp.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    resp.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, resp) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    resp.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    resp.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, resp) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    resp.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    resp.status(404).json({
      status: 'error',
      message: err,
    });
  }
};
