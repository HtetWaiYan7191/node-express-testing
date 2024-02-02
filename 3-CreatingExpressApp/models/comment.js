const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Blog = require('../models/blog');
const User = require('../models/user');

const commentSchema = new Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true,
    }

}, {timestamps: true});

// update the comment count of blogs when new comment added 

commentSchema.post('save', async function (doc) {
    const blogId = doc.blogId;
    const Blog = require('../models/blog');
    await Blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } }); // increase the comment count on blog 
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;