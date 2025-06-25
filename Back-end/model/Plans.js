const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Finishedtask schema
const FinishedtaskSchema = new Schema({
  name: {
    required: true,
    type: String,
    default: null,
  },
  date: {
    required: true,
    type: String,
    default: null,
  },
  deadline: {
    required: true,
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  timestart: {
    type: String,
    default: null,
  },
  timeend: {
    type: String,
    default: null,
  },
  color: {
    required: true,
    type: String,
    default: null,
  },
  textcolor: {
    required: true,
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
  color: {
    type: String,
    default: "",
  },
  textcolor: {
    type: String,
    default: "",
  },
  timestart: {
    type: String,
    default: "",
  },
  timeend: {
    type: String,
    default: "",
  },
  deadline: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: null
  },
  notification:{
    active:{
      type:Boolean,
      default:false,
    },
    title:{
      type:String,
      default:""
    },
    body:{
      type:String,
      default:""
    },
    notify_month:{
      type:String,
      default:null
    },
    notify_day:{
      type:String,
      default:null
    },
    notify_hour:{
      type:String,
      default:null
    },
    notify_minute:{
      type:String,
      default:null
    }
  }
});

// Define the Daily schema
const DailySchema = new Schema({
  day: {
    type: Number, // Example: 1 for Monday, 2 for Tuesday, etc.
    required: true,
  },
  activityCount: { // Add this field
    type: Number,
    default: 0,
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
    color: {
      type: String,
      default: "",
    },
    textcolor: {
      type: String,
      default: "",
    },
    timestart: {
      type: String,
      default: "",
    },
    timeend: {
      type: String,
      default: "",
    },
    important: {
      type: Boolean,
      default: false,
    },
    notification:{
      active:{
        type:Boolean,
        default:false,
      },
      title:{
        type:String,
        default:""
      },
      body:{
        type:String,
        default:""
      },
      notify_day:{
        type:String,
        default:null
      },
      notify_hour:{
        type:String,
        default:null
      },
      notify_minute:{
        type:String,
        default:null
      }
    }
  }],
});

const todaytask = new Schema({
  currentdate: {
    type: String,
    default: null,
  },
  task: [
    {
      name: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      color: {
        type: String,
        default: null,
      },
      textcolor: {
        type: String,
        default: null,
      },
      timestart: {
        type: String,
        default: null,
      },
      timeend: {
        type: String,
        default: null,
      },
      important: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        default: null,
      },
      task: {
        type: Boolean,
        default: false,
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
  finished_task: [FinishedtaskSchema], 
  my_task: [IncommingtaskSchema], 
  daily: [DailySchema], 
  timebegin: {
    type: String,
    default: null,
  },
  todaytask: [todaytask],
});

// Define the main UserPlan schema
const UserPlanSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  plans: [PlanSchema], // Array of PlanSchema
});

// Create the model
const UserPlan = mongoose.model('userplans', UserPlanSchema);

module.exports = UserPlan;
