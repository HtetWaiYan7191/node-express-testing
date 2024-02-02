const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// password handler 
const userSchema = new Schema({
    username: {
        type:String,
        required: true
    }, 

    email: {
        type:String,
        required: true,
        unique: true,
    }, 

    password: {
        type:String,
        required: true
    }, 

    phone: {
        type: Number,
    }, 
    verified: {
        type: Boolean
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;