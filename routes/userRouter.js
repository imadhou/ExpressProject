const express = require('express');
const router = express.Router();
const userController = require(`${__dirname}/../controllers/UserController`);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router.route('/:id').get(userController.getUser);

module.exports = router;
