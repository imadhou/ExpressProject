const express = require('express');
//morgan for having a better log infos it's just a dev dependency
const morgan = require('morgan');

const ErrorHandler = require('./utils/errorHandlers');
const globalErrorHandler = require('./controllers/ErrorController');
const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');

const app = express();

//the use function calls a middlewar and apply it to the request
//it can be a predefined one or one that we
//if we dont specefy the path then the middleware will be applied for all the request
//else only for the requests on the specefied path
//the middleware will have access to three objects req, resp and next
//the next is a callback that should be called to pass to execute next middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//json() is a better alternative for end()
app.use(express.json());
app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//we call our routers (middleware) on the defined routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, resp, next) => {
  next(new ErrorHandler(`can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
