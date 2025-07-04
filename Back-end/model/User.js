const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true 
    },
    picture:{
        type:String,
        default:null
    },
    email: {
        type: String,
        required: true 
    },
    verified: {
        type: Boolean, 
        required: true, 
        default: false 
    },
    password: {
        type: String,
        required: true 
    },
    refreshToken: {
        type: String 
    }
});

module.exports = mongoose.model("User", userSchema);
