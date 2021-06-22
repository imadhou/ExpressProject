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

module.exports = router;
