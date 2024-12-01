const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Finishedtask schema
const FinishedtaskSchema = new Schema({
  name: {
    type: String,
    default: null, 
  },
  date: {
    type: String,
    default: null, 
  },
});

// Define the Incommingtask schema
const IncommingtaskSchema = new Schema({
  name: {
    type: String, // Name of the activity
    required: true,
  },
  description: {
    type: String, // Description of the activity
    default: '',
  },
  color:{
    type:String,
    default:"",
  },
  textcolor:{
    type: String,
    default:"",
  },
  timestart:{
    type:String,
    default:"",
  },
  timeend:{
    type: String,
    default: "",
  },
  deadline:{
    type:String,
    default:""
  },
  status:{
    type:String,
    default:null
  }
});

// Define the Daily schema
const DailySchema = new Schema({
  day: {
    type: Number, // Example: 1 for Monday, 2 for Tuesday, etc.
    required: true,
  },
  activities: [{
    name: {
      type: String, // Name of the activity
      required: true,
    },
    description: {
      type: String, // Description of the activity
      default: '',
    },
    color:{
      type:String,
      default:"",
    },
    textcolor:{
      type: String,
      default:"",
    },
    timestart:{
      type:String,
      default:"",
    },
    timeend:{
      type: String,
      default: "",
    },
    important:{
      type: Boolean,
      default:false,
    }
  }],
});

const todaytask = new Schema({
  currentdate: {
    type: String,
    default: null,
  },
  task:[
    {
      name: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      color:{
        type: String,
        default: null,
      },
      textcolor:{
        type: String,
        default: null,
      },
      timestart:{
        type: String,
        default: null,
      },
      timeend:{
        type: String,
        default: null,
      },
      important:{
        type: Boolean,
        default: false,
      },
      status:{
        type: String,
        default: null,
      },
      dateupdated:{
        type:String,
        default:null,
      },
      task:{
        type:Boolean,
        default:false,
      },
    }
  ]

});
// Define the Plan schema
const PlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: null,
  },
  time: {
    type: Number,
    default: null,
  },
  finished_task: [FinishedtaskSchema], // Array of Finished tasks
  my_task: [IncommingtaskSchema], // Array of Incoming tasks
  daily: [DailySchema], // Array of Daily activities
  timebegin:{
    type: String,
    default:null,
  },
  todaytask: [todaytask],
});

// Define the main UserPlan schema
const UserPlanSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  plans: [PlanSchema], // Array of PlanSchema
});

// Create the model
const UserPlan = mongoose.model('userplans', UserPlanSchema);

module.exports = UserPlan;
