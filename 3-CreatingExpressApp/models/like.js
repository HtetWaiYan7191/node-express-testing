const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Blog = require('../models/blog');

const likeSchema = new Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

})

// update  the number of likes when a like is added or removed
likeSchema.post('save', async function (doc) {
    const blogId = doc.blogId;

    await Blog.findByIdAndUpdate(blogId, {$inc: {likes: 1}});
})


const Like = mongoose.model('Like', likeSchema);
module.exports = Like;