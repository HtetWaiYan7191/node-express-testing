const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');

const blogIndex = (req, res) => {
    Blog.find().sort({createdAt: -1}).then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    })
}

//add blog 
const addBlog = async (req,res) => {
    const user = await User.findOne();
    const blog = new Blog({
        userId: user._id,
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body
    });

    blog.save().then((result) => {
       return res.json({
            status: 200,
            message: 'blog created successfully',
            data: result
        })
    })
    .catch((err) => {
      return  res.json({
            status: 400,
            message: 'cannot created !',
            error: err
        })
    })
}

// find single blog 
const detailBlog = async (req, res) => {
    try {
        const result = await Blog.findById(req.params.id)
        return res.json({
            status: 200,
            message: 'blog detail',
            data: result
        })
    } catch(err) {
           return err 
    }
}

// update blog
const updateBlog = async (req,res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {new: true});

    if(!updatedBlog) {
        return res.status(404).json({
            error: 'Blog cannot update...'
        })
    }

    res.json({
        message: 'Blog updated successfully...',
        status: 201,
        data: updatedBlog
    })
}

// delete blog 

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        return res.json({
            message: 'blog delete',
            status: 204,
            data: blog
        })
    }  catch(err) {
        return err
    }
}

module.exports = {
    blogIndex,
    addBlog,
    detailBlog,
    updateBlog,
    deleteBlog
}