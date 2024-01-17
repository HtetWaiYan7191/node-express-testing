const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;