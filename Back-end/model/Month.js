const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthSchema = new Schema({
    month:{
        type: Number,
        required:true,
    },
    end:{
        type: Number,
        required:true,
    }
})

module.exports = mongoose.model("months",monthSchema);