const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, resp) => {
  const users = await User.find();
  resp.status(500).json({
    status: 'success',
    data: {
      users,
    },
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
