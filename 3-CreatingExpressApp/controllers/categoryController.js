const express = require('express');
const Category = require('../models/category');

//category list 
const categoryIndex = async (req, res) => {
    // .then way promises 
    // Category.find().sort({createdAt: -1}).then((result) => {
    //     res.json({
    //         status: 201,
    //         message: 'success',
    //         data: result
    //     })
    //     .catch((err) => {
    //         return err
    //     })
    // })

    //async await way
    try {
        const result = await Category.find().sort({createdAt: -1});
        return res.json({
            status: 201,
            message: 'success',
            data: result
        })
    }
    catch(err) {
        return res.json({
            status: 400,
            message: 'cannot show data'
        })
    }

}

//create category 
const categoryCreate = async (req, res) => {
    try {
        if(!req.body.name){
            return res.json({
                status: 400,
                message: 'name cannot be blank'
            })
        }
    
        const category = new Category({
            name: req.body.name
        })

        const result = await category.save();
        return res.json({
            status: 200,
            message:'category created successfully!',
            data: result
        })
    } catch(err) {
        return res.json({
            status: 400,
            message: err
        })
    }
}

//show category
const categoryDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id)
        return res.json({
            status: 200,
            message: 'success',
            data: category
        })
    } catch(err) {
        return res.json({
            message: 'cannot show the list',
            data: err
        })
    }
}

//update category
const categoryUpdate = async (req, res) => {
    try {
        if(!req.body.name) {
            return res.json({
                status: 400,
                message: 'name cannot be blank'
            })
        }
        const id = req.params.id;
        const updateData = req.body;
        const updateCategory = await Category.findByIdAndUpdate(id, updateData, {new: true});
        return res.json({
            status: 201,
            message: 'updated successfully...',
            data: updateCategory
        })
    }
    catch(err) {
        return res.json({
            status: 400,
            message: 'cannot updated...'
        })
    }
}

//delete category 

const categoryDelete = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.findByIdAndDelete(id);
        return res.json({
            message: 'category delete successfully',
            status: 204,
            data: category
        })
    }
    catch(err) {
        return res.json({
            status: 400,
            message: 'cannot delete'
        })
    }
}


//export the functions 
module.exports = {
    categoryIndex,
    categoryCreate,
    categoryDetail,
    categoryUpdate,
    categoryDelete,
}