const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/userController');

//list all users
router.get('/', userController.userIndex);

// user sign up 
router.post('/signup', userController.userSignUp);

// user log in 
router.post('/login', userController.userLogIn);

// verify email 
router.get('/verify/:userId/:uniqueString', userController.verifyEmail);
module.exports = router;