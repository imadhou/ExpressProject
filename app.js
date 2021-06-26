// we start by requiring the modules and the middlewares that we're gonna use in our project
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const ErrorHandler = require('./utils/errorHandlers');
const globalErrorHandler = require('./controllers/ErrorController');
const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');

//the first step is to create an express application and to use the helmet middleware
const app = express();
app.use(helmet());

//we use morgan when we are in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//rate limit secure us from dos attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request, try agin in a moment',
});
app.use('/api', limiter);

//json for rendring json data
app.use(express.json());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//we call our routers (middleware) on the defined routes the non defined routes generate an error
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, resp, next) => {
  next(new ErrorHandler(`can't find ${req.originalUrl} on the server`, 404));
});

//we use the global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
