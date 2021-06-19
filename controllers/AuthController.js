const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, resp, next) => {
  const user = await User.create(req.body);
  resp.status(201).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});
