const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');
const sendEmail = require('../utils/email');

//signing a jwt (the user id is wrapped in the payload)
const signToken = (_id) =>
  jwt.sign({ id: _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//creating the token and sending it through the response body and in a cookie
const createAndSendToken = (user, statusCode, resp) => {
  const token = signToken(user._id);
  const cookie = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOlny: true,
  };

  if (process.env.NODE_ENV === 'production') cookie.secure = true;

  resp.cookie('jwt', token, cookie);
  user.password = undefined;
  resp.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

// handler for the create user route
exports.signup = catchAsync(async (req, resp, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createAndSendToken(user, 201, resp);
});

// liging in a user and sending a jwt if the submited data is valid
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

  createAndSendToken(user, 200, resp);
});

//this middleware is first run if a route is protected (needs login )
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

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ErrorHandler('User not found! Try to create an acount', 401)
    );
  }

  if (currentUser.changedPassword(decoded.iat)) {
    return next(
      new ErrorHandler(
        'Password changed without reloging in, please login',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

//this middleware is restricting access to some type of users (roles)
exports.restrictTo = (...roles) => {
  return (req, resp, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler('User not authorized to perform action', 401)
      );
    }
    next();
  };
};

//sending a token for reseting the password
exports.forgotPassword = catchAsync(async (req, resp, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorHandler(
        'No email adress specefied! Please provide an email adresse',
        404
      )
    );
  }

  const resetToken = user.generatePasswordResetToke();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forget your password, patch request with new password and confirm it to ${resetURL} the url received`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset email token (valid for 10 mins)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler('There is an error while reseting password', 500)
    );
  }
  resp.status(200).json({
    status: 'Success',
    message: 'token sent to your mail',
  });
});

//handling the reset password route
exports.resetPassword = catchAsync(async (req, resp, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Token invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createAndSendToken(user, 200, resp);
});

//updating the current logged in userd password
exports.updatePasswor = catchAsync(async (req, resp, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new ErrorHandler(
        'Invalid password, please enter your current password',
        401
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createAndSendToken(user, 200, resp);
});
