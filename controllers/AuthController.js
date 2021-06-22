/* eslint-disable arrow-body-style */
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');

const signToken = (_id) => {
  return jwt.sign({ id: _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, resp, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(user._id);
  console.log(token);
  resp.status(201).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

exports.login = catchAsync(async (req, resp, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandler(
        'Email or password not provided! Please enter your email adress and password',
        400
      )
    );
  }

  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorHandler('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  console.log(user);
  resp.status(200).json({
    status: 'success',
    token,
  });
});

exports.protectRoute = catchAsync(async (req, resp, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ErrorHandler(
        'You are not authorized to access this ressource! Please log in',
        401
      )
    );
  }
  next();
});
