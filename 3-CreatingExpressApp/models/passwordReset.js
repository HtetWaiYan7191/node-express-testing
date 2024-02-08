const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// password reset schema 
const passwordResetSchema = new Schema({
    userId: {
        type: String,
    },
    resetString: {
        type: String
    }
}, {timestamps: true});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)
module.exports = PasswordReset;