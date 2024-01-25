const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const categoryController = require('../controllers/categoryController');

//list all categories
router.get('/', categoryController.categoryIndex);

// add category
router.post('/', categoryController.categoryCreate);

// show category 
router.get('/:id', categoryController.categoryDetail);

//update category 
router.patch('/:id', categoryController.categoryUpdate);

// delete category 
router.delete('/:id', categoryController.categoryDelete);

module.exports = router;

