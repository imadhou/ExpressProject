const ErrorHandler = require('../utils/errorHandlers');

const devError = (err, resp) => {
  resp.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodError = (err, resp) => {
  if (err.isOperational) {
    resp.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    resp.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const castErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(message, 400);
};

const duplicatedErrorDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Value ${value} of ${field} already exists, use another value!`;
  return new ErrorHandler(message, 400);
};

const validationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new ErrorHandler(message, 400);
};

module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode * 1 || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENv === 'development') {
    console.log(err.statusCode);
    devError(err, resp);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = castErrorDB(error);
    }

    if (err.code === 11000) {
      error = duplicatedErrorDB(error);
    }

    if (err.name === 'ValidationError') {
      error = validationErrorDB(error);
    }
    prodError(error, resp);
  }
};
