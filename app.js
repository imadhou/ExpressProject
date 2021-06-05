const express = require('express');
//morgan for having a better log infos
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//json() is a better alternative for end()
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
