const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Plan schema
const Notifylist = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    default:""
  },
  day:{
    type:Number,
    default:null,
  },
  time:{
    type: String,
    default:null
  }
});

// Define the main UserPlan schema
const Notifyschema = new Schema({
  username: {
    type: String,
    required: true,
  },
  subscribe:{
    type:Object,
    required:true,
  },
  notifylist: [Notifylist], // Array of PlanSchema
});

// Create the model
const NotifyUsers = mongoose.model('notifyusers', Notifyschema);

module.exports = NotifyUsers;
