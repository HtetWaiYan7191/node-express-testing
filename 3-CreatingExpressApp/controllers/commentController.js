const express = require("express");
const Comment = require("../models/comment");
const Blog = require("../models/blog");
const User = require("../models/user");

//comment list
const commentIndex = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "success",
      data: comments,
    });
  } catch (err) {
    console.log(err);
  }
};

//delete all comments for testing purpose
const deleteComments = async (req, res) => {
  try {
    const result = await Comment.deleteMany();
    return res.json({
      status: 200,
      message: " All comments delete...",
    });
  } catch (err) {
    console.log(err);
  }
};

// comment list from specific blog
const commentFromBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(400).json({ message: "blog does not exist " });

    const comments =await Comment.find({blogId: blogId});
    console.log(comments);
    return res.status(200).json({
      messaage: ` ${blog.title} has ${blog.commentCount} comments `,
      data: comments,
    });
  } catch (err) {
    console.log(err);
  }
};

// create comment
const addComment = async (req, res) => {
  try {
    const user = await User.findOne();
    const blogId = req.params.id;
    const newComment = new Comment({
      text: req.body.text,
      author: user._id,
      blogId: blogId,
    });
    const result = await newComment.save();
    // const blog = await Blog.findById(blogId).populate('comments');
    // blog.comments.push(result)
    return res.status(200).json({
      message: "comment added successfully...",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  commentIndex,
  commentFromBlog,
  addComment,
  deleteComments,
};
