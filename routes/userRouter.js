const express = require('express');
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id').get(userController.getUser);

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protectRoute,
  authController.updatePasswor
);
router.patch(
  '/updateUser',
  authController.protectRoute,
  userController.updateUser
);
router.delete(
  '/deleteuser',
  authController.protectRoute,
  userController.deleteUser
);

module.exports = router;
