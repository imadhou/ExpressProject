const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const ErrorHandler = require('../utils/errorHandlers');
const HandlerFactory = require('./HandlerFactory');

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, resp, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = HandlerFactory.getAll(User);
exports.getUser = HandlerFactory.getOne(User);
exports.updateUser = HandlerFactory.updateOne(User);
exports.deleteUser = HandlerFactory.deleteOne(User);
exports.createUser = HandlerFactory.createOne(User);

// exports.updateUser = catchAsync(async (req, resp, next) => {
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new ErrorHandler('This route is not for password updates', 400)
//     );
//   }

//   const fields = filterObj(req.body, 'name', 'email');

//   const user = await User.findByIdAndUpdate(req.user.id, fields, {
//     new: true,
//     runValidators: true,
//   });

//   resp.status(200).json({
//     status: 'success',
//     data: {
//       user,
//     },
//   });
// });
