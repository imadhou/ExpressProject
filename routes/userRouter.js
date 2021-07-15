const express = require('express');
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protectRoute);

router.patch('/updatePassword', authController.updatePasswor);
router.get('/me', userController.getMe, userController.getUser);
// router.patch(authController.protectRoute, userController.updateMe);
// router.delete(authController.protectRoute, userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
