const express = require('express');
const router = express.Router();
const Like = require('../models/like');
const likeController = require('../controllers/likeController');

// add like 
router.post('/blogs/:id/like', likeController.addLike);

// remove like 
router.delete('/blogs/:id/like/:likeId', likeController.deleteLike);

// index like total like 
router.get('/likes', likeController.indexLike);

// total likes from the specific post 
router.get('/blogs/:id/like/', likeController.totalLikesFromBlog)
module.exports = router;