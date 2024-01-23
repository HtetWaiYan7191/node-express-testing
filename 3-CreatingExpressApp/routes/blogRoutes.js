const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const blogController = require('../controllers/blogController');
// list all blogs 
router.get('/', blogController.blogIndex )

// add blog 
router.post('/addBlog', blogController.addBlog);

// show blog 
router.get('/:id', blogController.detailBlog);

// update blog
router.patch('/:id', blogController.updateBlog);

// delete blog 
router.delete('/:id', blogController.deleteBlog);
module.exports = router;