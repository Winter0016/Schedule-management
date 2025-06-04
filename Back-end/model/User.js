const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true // corrected "require" to "required"
    },
    picture:{
        type:String,
        default:null
    },
    email: {
        type: String,
        required: true // corrected "require" to "required"
    },
    verified: {
        type: Boolean, // changed from String to Boolean
        required: true, // corrected "require" to "required"
        default: false // Default value is false for new users
    },
    password: {
        type: String,
        required: true // corrected "require" to "required"
    },
    refreshToken: {
        type: String // This field is optional
    }
});

module.exports = mongoose.model("User", userSchema);
