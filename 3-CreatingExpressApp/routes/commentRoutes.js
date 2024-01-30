const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const commentController = require('../controllers/commentController');

// list all comments 
router.get('/', commentController.commentIndex);

// delete all comments 
router.delete('/', commentController.deleteComments);



module.exports = router;