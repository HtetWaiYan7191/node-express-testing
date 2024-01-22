const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');

//list all users
router.get('/', userController.userIndex);

module.exports = router;