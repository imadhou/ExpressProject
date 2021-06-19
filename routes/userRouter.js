const express = require('express');
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router.route('/:id').get(userController.getUser);

module.exports = router;
