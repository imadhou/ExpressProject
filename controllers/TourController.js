const Tour = require('../models/TourModel');

exports.getAllTours = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    data: {
      tours: null,
    },
  });
};

exports.getTour = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    data: {
      tours: null,
    },
  });
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

exports.updateTour = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    data: {
      tour: 'updating ....',
    },
  });
};

exports.deletetour = (req, resp) => {
  resp.status(204).json({
    status: 'success',
    data: null,
  });
};
