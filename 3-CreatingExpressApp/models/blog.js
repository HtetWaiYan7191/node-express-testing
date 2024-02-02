const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Commnt = require('../models/comment');

const blogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


// delete all comments from the blogs when blog is removed 

blogSchema.pre('remove', async function(next) {
    await Comment.deleteMany({blog: this._id})
    next();
})

const Blog = mongoose.model("Blog", blogSchema); // create a blog model
module.exports = Blog;
