const ErrorHandler = require('../utils/errorHandlers');

const devError = (err, resp) => {
  console.log(err);
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

const jwtError = () =>
  new ErrorHandler('Invalid jwToken! please try to login', 401);

const tokenExpiredError = () =>
  new ErrorHandler('Token expired, Please login again', 401);

//This middleware intercepts errors passed to next() (or throwed with throw new Error..., or catch(err)) and handle them according to
//their name property or status that is defined and a response will be sent to the client containing the error message
module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode * 1 || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
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

    if (err.name === 'JsonWebTokenError') {
      error = jwtError();
    }
    if (err.name === 'TokenExpiredError') {
      error = tokenExpiredError();
    }
    prodError(error, resp);
  }
};
