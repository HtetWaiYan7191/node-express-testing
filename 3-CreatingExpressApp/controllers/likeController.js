const express = require("express");
const Like = require("../models/like");
const User = require("../models/user");
const Blog = require("../models/blog");

//index like for testing purpose
const indexLike = async (req, res) => {
  try {
    const likes = await Like.find();
    return res.status(200).json({
      message: "like list",
      data: likes,
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// total like from a specific blog
const totalLikesFromBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog)
      return res.status(404).json({
        message: "Blog does not exist",
      });
      const likes = await blog.likes
      return res.status(200).json({
        message: `${blog.title} has ${likes} likes`,
        data: likes
      });

  } catch (err) {
    console.log(err);
  }
};

// create a new like

const addLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    // Check if the blog exists
    const existingBlog = await Blog.findOne({ _id: blogId });
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog does not exist" });
    }

    const user = await User.findOne();
    if (!user) return res.status(401).json({ msg: "User not found" });

    // Check if the user already liked the post
    const existingLike = await Like.findOne({ blogId, user });
    if (existingLike) {
      return res.status(400).json({
        error: "User already liked the post!",
      });
    }

    const newLike = new Like({
      user: user._id,
      blogId: blog._id,
    });

    const result = await newLike.save();

    return res.json({
      status: 200,
      message: `Add like to blog ${blogId}`,
      data: newLike,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      err: err,
      message: "Cannot add like...",
    });
  }
};

const deleteLike = async (req, res) => {
  try {
    const id = req.params.likeId;
    const like = await Like.findByIdAndDelete(id);
    return res.json({
      message: "remove like successfully",
      status: 200,
      data: like,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      err: err,
      message: "cannot remove like",
    });
  }
};

module.exports = {
  addLike,
  deleteLike,
  indexLike,
  totalLikesFromBlog
};
