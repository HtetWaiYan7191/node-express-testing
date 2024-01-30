const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
// list all blogs 
router.get('/', blogController.blogIndex )


// list comments from specific blog 
router.get('/:id/comments', commentController.commentFromBlog);

// add comment to specific blog 
router.post('/:id/comments', commentController.addComment);

// add blog 
router.post('/addBlog', blogController.addBlog);

// show blog 
router.get('/:id', blogController.detailBlog);

// update blog
router.patch('/:id', blogController.updateBlog);

// delete blog 
router.delete('/:id', blogController.deleteBlog);
module.exports = router;