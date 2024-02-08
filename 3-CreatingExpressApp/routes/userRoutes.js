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

// request password reset link 
router.post('/requestPasswordReset', userController.requestPasswordReset);

// reset password 
router.post('/resetPassword', userController.resetPassword);
module.exports = router;