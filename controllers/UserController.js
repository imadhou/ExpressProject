const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, resp) => {
  const users = await User.find();
  resp.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateUser = catchAsync(async (req, resp, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorHandler('This route is not for password updates', 400)
    );
  }

  const fields = filterObj(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.user.id, fields, {
    new: true,
    runValidators: true,
  });

  resp.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, resp, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  resp.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getUser = (req, resp) => {
  resp.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented',
  });
};

exports.createUser = (req, resp) => {
  resp.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented',
  });
};
