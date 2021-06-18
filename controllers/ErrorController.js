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

module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode * 1 || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENv === 'development') {
    console.log(err.statusCode);
    devError(err, resp);
  } else if (process.env.NODE_ENV === 'production') {
    prodError(err, resp);
  }
};
