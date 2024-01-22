const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const blogController = require('../controllers/blogController');
// list all blogs 
router.get('/', blogController.blogIndex )

// add blog 
router.post('/addBlog', blogController.addBlog);

module.exports = router;