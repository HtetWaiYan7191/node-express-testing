const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    email: {
        type: String,
        requierd: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema );
module.exports = User;