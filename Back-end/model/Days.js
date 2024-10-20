const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = new Schema({
    day:{
        type: Number,
        required:true,
    },
})

module.exports = mongoose.model("days",daySchema);