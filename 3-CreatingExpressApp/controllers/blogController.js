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
    console.log(user._id);
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

// Blog start ! 
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'Blog 3',
//         snippet: 'Hello',
//         body: 'I am learning nodejs these days '
//     });
//     blog.save()
//     .then((result) => {
//         res.send(result)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })



// // find single blog 
// app.get('/single-blog', (req, res) => {
//     Blog.findById('659cc736588db5b6456936a0')
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })

// // create blog 
// app.post('/blogs', (req, res) => {
//     console.log(req.body);
//     console.log('post finished ...');
// })

module.exports = {
    blogIndex,
    addBlog,
}