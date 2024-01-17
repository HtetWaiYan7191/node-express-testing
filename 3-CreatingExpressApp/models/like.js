const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;