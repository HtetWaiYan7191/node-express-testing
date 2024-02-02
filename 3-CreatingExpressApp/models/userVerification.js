const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// password handler 
const userVerificationSchema = new Schema({
    userId: {
        type:String,
    }, 

    uniqueString: {
        type:String,
    }, 

}, {timestamps: true});

const UserVerification = mongoose.model('userVerification', userVerificationSchema);
module.exports = UserVerification;