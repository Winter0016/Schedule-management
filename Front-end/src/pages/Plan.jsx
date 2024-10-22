import React, { useState, useContext, useEffect, act } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import { div } from '@tensorflow/tfjs';
import axios from 'axios';

export const Plan = () => {
  const { loggedusername,usernamerole } = useContext(Usercontext);
  const [createresult,setcreateresult] = useState("");
  const [newplan,setnewplan]=useState("");
  const [plan,setplan] = useState();
  const [open,setopen] = useState(false);


  const navigate = useNavigate(); // If you need to navigate after login

  const [createloading,setcreateloading] = useState(false);

  const today = new Date();

  const date = today.getDate();
  let days = today.getDay(); // Get the current day number (0 = Sunday, 1 = Monday, etc.)
  if(days ==0){
    days = 7
  }
  const months = today.getMonth();
  const years = today.getFullYear();

  const currenttime = `${years}-${months}-${date}`
  // console.log(`currenttime : ${currenttime}`)

  function calculateDaysBetweenDates(timeBegin, deadline) {
    // console.log(`timebegin : ${timeBegin}`);
    // console.log(`deadline : ${deadline}`)
    const startDate = new Date(timeBegin);
    const endDate = new Date(deadline);
    // console.log(startDate);
    // console.log(endDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    // console.log(differenceInDays)

    return differenceInDays;
  }


  const createnewplan = async(req,res) =>{
    try{
      setcreateloading(true);
      if(!newplan){
          throw new Error("Please provide a name for your plan!");
      }
      const response = await fetch("http://localhost:3000/add-plan",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({username:loggedusername,name:newplan,timebegin:`${years}-${months}-${date}`})
      })
      const data = await response.json();
      setcreateresult(data);
      setcreateloading(false);
    }catch(error){
        setcreateloading(false);
        console.log(error);
        setcreateresult(error.message)
    }
  }

  const[loadingplan,setloadingplan] = useState(false);
  const sortactivity = (activityarray) => {
    return activityarray.sort((a, b) => parseInt(a.timestart.split(":")[0]) - parseInt(b.timestart.split(":")[0]));
  };
  
  const finddaily = (daily) => {
    return daily.map((key) => ({
      ...key,
      activities: sortactivity(key.activities)
    }));
  };
  const getplan = async(req,res) =>{
    // console.log(`getplan`)
    try{
        setloadingplan(true)
        const response = await fetch("http://localhost:3000/plan",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:loggedusername}),
        })
        const data = await response.json()
        // console.log(`${JSON.stringify(data)}`);
        // console.log(data[1].name)
        const updatedplan = data.plans.map((key) => ({
          ...key,
          daily: finddaily(key.daily)
        }));
        setplan(updatedplan);
        setloadingplan(false);
    }catch(error){
        setloadingplan(false);
        console.log(error);
    }
}

const [deleteing,setdeleteing] = useState(false);
const [deleteresult,setdeleteresult] = useState("");

const [Delete,setDelete] = useState("");
const deleteplan = async(req,res)=>{
    try{
        setdeleteing(true);
        const response = await fetch("http://localhost:3000/delete-plan",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:loggedusername,planId:Delete})
        })

        const data = await response.json();
        setdeleteresult(data);
        setdeleteing(false);
        setDelete("");
    }catch(error){
        setdeleteing(false);
        console.log(error);
        setdeleteresult(error.message)
    }
}
const [addacresult,setaddacresult] = useState();
const[deleteac,setdeleteac] = useState("");
const [deletingac,setdeletingac] = useState(false);
  useEffect(()=>{
    if(loggedusername){
        // console.log("hello")
        getplan();
    }
  
  },[loggedusername,usernamerole,addacresult,deleteac,deleteresult,createresult])
  const [openproperty,setopenproperty] = useState("Plan");

  // const testing =[
  //   {"day":"Monday"},
  //   {"day":"Tuesday"},
  //   {"day":"Wednesday"},
  //   {"day":"Thursday"},
  //   {"day":"Friday"},
  //   {"day":"Saturday"},
  //   {"day":"Sunday"},
  // ]



  const [Days,setDays] = useState();
  const [Months,setMonths] = useState();
  const getdays = async(req,res) =>{
    try{
        const response = await fetch("http://localhost:3000/days",{
            method:"GET",
            headers:{"Content-Type":"application/json"},
        })
        const data = await response.json();
        // console.log(data);
        setDays(data.days.sort((a,b) => a.day - b.day));
        setMonths(data.months);
    }catch(error){
        console.log(error);
    }
  }
//   console.log(Months)

const [Endmonth,setEndmonth] = useState();

useEffect(()=>{
    if(Months){
        const endmonth = Months.find((key) => key.month === months-1).end;
        setEndmonth(endmonth);
        // console.log(Endmonth);
    }
},[Months])

  function translateMonth() {
    switch (months) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "Invalid month number"; // In case the number is not between 1 and 12
    }
  }
  
  // Example usage:
  const monthName = translateMonth(); // Returns "May"

  function translateDay(dayNumber) {
    switch(dayNumber) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
      default:
        return "Invalid day number"; // In case the input is not between 1 and 7
    }
  }
  function reversetranslateDay(daystring) {
    switch(daystring) {
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednesday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
      case "Sunday":
        return 7;
      default:
        return "Invalid day string"; // In case the input is not between 1 and 7
    }
  }
  
  useEffect(()=>{
    getdays();
  },[])

  const [time, setTime] = useState({ hours: '', minutes: '' });
const [time2, setTime2] = useState({ hours: '', minutes: '' });
const handleChange = (e) => {
  const { name, value } = e.target;

  // Only allow numbers for input
  if (!/^\d*$/.test(value)) return;

  if (name === 'hours') {
    if (value.length <= 2 && (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23))) {
      setTime((prevTime) => ({ ...prevTime, hours: value }));
    }
  } else if (name === 'minutes') {
    if (value.length <= 2 && (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59))) {
      setTime((prevTime) => ({ ...prevTime, minutes: value }));
    }
  }
};
const handleChange2 = (e) => {
  const { name, value } = e.target;

  // Only allow numbers for input
  if (!/^\d*$/.test(value)) return;

  if (name === 'hours') {
    if (value.length <= 2 && (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23))) {
      setTime2((prevTime) => ({ ...prevTime, hours: value }));
    }
  } else if (name === 'minutes') {
    if (value.length <= 2 && (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59))) {
      setTime2((prevTime) => ({ ...prevTime, minutes: value }));
    }
  }
};

  const [addtask,setaddtask] = useState("");
  const [selectedOption, setSelectedOption] = useState('');
  const [acname,setacname] = useState();
  const [descriptionac,setdescriptionac] = useState();
  const [addloadingac,setaddloadingac] = useState(false);
  const [choosecolor,setchoosecolor] = useState("#3399ff");
  const [textcolor,choosetextcolor] = useState("#e5e7eb")
  const [modify,setmodify] = useState(false);
  const [modifyacname,setmodifyacname] = useState();

  const [dailyid,setdailyid] = useState();
  const [activeid,setactiveid] = useState();
  const [important,setimportant] = useState(false);


  const addactivity = async (e) => {
    e.preventDefault();
  
    // Use local variables to manage the time fields to avoid async issues
    let timeStart = { ...time };
    let timeEnd = { ...time2 };
  
    try {
      // Check and set minutes to "00" if hours are present but minutes are not
      if (timeStart.hours && !timeStart.minutes) {
        timeStart.minutes = "00"; 
      }
      if (timeEnd.hours && !timeEnd.minutes) {
        timeEnd.minutes = "00"; 
      }
      if (timeStart.hours.toString().length == 1) {
        timeStart.hours = "0" + timeStart.hours.toString();
      }
      if (timeStart.minutes.toString().length == 1) {
        timeStart.minutes = "0" + timeStart.minutes.toString();
      }
      if (timeEnd.hours.toString().length == 1) {
        timeEnd.hours = "0" + timeEnd.hours.toString();
      }
      if (timeEnd.minutes.toString().length == 1) {
        timeEnd.minutes = "0" + timeEnd.minutes.toString();
      }
      // Validation for incorrect time inputs
      if ((!timeStart.hours && timeStart.minutes) || (!timeEnd.hours && timeEnd.minutes)) {
        throw new Error("Invalid time");
      }
  
      // Validation for time start and time end
      if ((timeStart.hours && !timeEnd.hours) || (!timeStart.hours && timeEnd.hours)) {
        throw new Error("Time start and Time End need to be together!");
      }
      // Set loading state
      setaddloadingac(true);
  
      // Send the updated time fields in the request
      const response = await fetch("http://localhost:3000/add-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loggedusername,
          planname: selectedOption,
          day: reversetranslateDay(addtask),
          nameac: acname,
          acdescription: descriptionac,
          color: choosecolor,
          textcolor: textcolor,
          modifyacname: modifyacname,
          timestart: `${timeStart.hours}:${timeStart.minutes}`,
          timeend: `${timeEnd.hours}:${timeEnd.minutes}`,
          important: important,
        }),
      });
  
      const data = await response.json();
      if(modify){
        setacname(modifyacname);
      }
      setaddacresult(data);
      setaddloadingac(false);
    } catch (error) {
      setaddacresult(error.message);
      setaddloadingac(false);
      console.log(error);
    }
  };

  const clearacresult = ()=>{
    setaddacresult("");
  }
  
  if(addacresult){
    const mytimeout = setTimeout(clearacresult,2000);
  }

  const deleteactivity = async()=>{
    try{
      setdeletingac(true);
      const response = await fetch("http://localhost:3000/delete-activity",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({
          username: loggedusername,
          planname:selectedOption,
          dailyId:dailyid,
          activityId:activeid,
        }),
      })
      const data = await response.json();
      setdeleteac(data);
      setdeletingac(false);
    }catch(error){
      console.log(error);
      setdeletingac(false);
    }
  }

  
  const updateTodayTask = async (todaytask,changetodaytask) => {
    try {
        const response = await axios.post('http://localhost:3000/update-todaytask', {
            username: loggedusername,
            plan: selectedOption,
            date: `${years}-${months}-${date}`,
            task: todaytask,
            changetodaytask:changetodaytask,
        });

        // console.log(response.data);
    } catch (error) {
        console.error('Error updating today task:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (plan && selectedOption) {
      const tasks = [];
      let changetodaytask = false;
      plan.forEach((data2) => {
        if (data2.name === selectedOption) {
          data2.daily.forEach((activity) => {
            if(activity.day === days){
              if(reversetranslateDay(addtask) === days){
                console.log(`change today schedule`);
                changetodaytask = true;
              }
              activity.activities.forEach((active) => {
                tasks.push({
                  name: active.name,
                  description: active.description,
                  timestart: active.timestart,
                  timeend: active.timeend,
                  color: active.color,
                  textcolor: active.textcolor,
                  important: active.important,
                  // Add any other properties you want to include
                });
              });
            }
          });
        }
      });
      updateTodayTask(tasks,changetodaytask)
    }
  }, [plan,selectedOption,addacresult]);

  const [checkedarray,setcheckedarray] = useState([]);
  const [updatingcheckedarray,setupdatingcheckedarray] = useState(false);

  // if(checkedarray){
  //   console.log(checkedarray);
  //   console.log(checkedarray.length);
  // }

  // rollover2

  const updatecheckedarray = async() =>{
    try{
      setupdatingcheckedarray(true);
      const response = await axios.post("http://localhost:3000/update-checkedarray", {
        username: loggedusername,
        plan:selectedOption,
        checkedArray : checkedarray
      })
      const data = response.data;
      console.log(data);
      setupdatingcheckedarray(false);
      setcheckedarray([]);
    }catch(error){
      setcheckedarray([]);
      setupdatingcheckedarray(false);
      console.log(error);
    }finally{
      getplan();
    }
  }
  return (
    <div className='w-screen h-screen overflow-auto bg-customgray relative'>
      {
        addtask && (
          <>
            <div className='absolute w-full h-full bg-customblue2 bg-opacity-20 flex flex-wrap justify-center items-center z-50'>
              <div className=' w-fit md:w-[30rem] m-auto p-5 rounded-3xl bg-customdark overflow-auto relative'>
                <img src={images.closecross} className=' size-12 absolute top-4 right-5 cursor-pointer' onClick={()=>{setaddtask("");setmodify(false);setaddacresult("");setdailyid("");setactiveid("");setmodifyacname("");setdeleteac("")}} alt="" />
                <div className='text-center break-words text-customblue text-2xl'>{addtask}'s Schedule</div>
                <form onSubmit={addactivity}>
                  <div className={`text-base text-gray-400 mt-3`}>{modify ? "Current Title" :"Title"}</div>
                  <input required readOnly={modify ? true:false} type="text" className={`rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200`} value={acname} onChange={(e) => setacname(e.target.value)} />
                  {
                    modify && (
                      <>
                        <div className='text-base text-gray-400 mt-3'>Change Title (Optional)</div>
                        <input type="text" className='rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200' value={modifyacname} onChange={(e)=>setmodifyacname(e.target.value)} />                      
                      </>
                    )
                  }
                  <div className="flex items-center gap-2 text-gray-400 mt-3 text-lg">
                    <div>Time Start (optional):</div>
                    <input
                      type="text"
                      name="hours"
                      placeholder="HH"
                      value={time.hours}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md w-12 text-center"
                      maxLength="2"
                    />
                    <span>:</span>
                    <input
                      type="text"
                      name="minutes"
                      placeholder="MM"
                      value={time.minutes}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md w-12 text-center"
                      maxLength="2"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mt-3 text-lg">
                    <div>Time End (optional):</div>
                    <input
                      type="text"
                      name="hours"
                      placeholder="HH"
                      value={time2.hours}
                      onChange={handleChange2}
                      className="border border-gray-300 rounded-md w-12 text-center"
                      maxLength="2"
                    />
                    <span>:</span>
                    <input
                      type="text"
                      name="minutes"
                      placeholder="MM"
                      value={time2.minutes}
                      onChange={handleChange2}
                      className="border border-gray-300 rounded-md w-12 text-center"
                      maxLength="2"
                    />
                  </div>
                  <div className='flex flex-wrap gap-2 mt-3 items-center'>
                    <div className={`text-lg text-red-700 text-bold underline`}>IMPORTANT</div>
                    <input className=' size-7' type="checkbox" checked={important} onChange={(e) => setimportant(e.target.checked)} />
                  </div>
                  <div className='mt-3 text-base text-gray-400'>Choose Background Color</div>
                  <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={choosecolor} onChange={(e)=>setchoosecolor(e.target.value)} />
                  <div className='mt-3 text-base text-gray-400'>Choose Text Color</div>
                  <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={textcolor} onChange={(e)=>choosetextcolor(e.target.value)} />
                  <div className='text-base text-gray-400 mt-3'>Description</div>
                  <textarea placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-5/6 h-[6rem]' value={descriptionac} onChange={(e)=> setdescriptionac(e.target.value)}></textarea>
                  <div className='flex mt-5 justify-between'>
                    <button type='submit' className='px-[5rem] py-2 text-customblue border-[1px] border-customblue w-fit h-fit rounded-3xl hover:bg-customgray' disabled={addloadingac}>{modify ? "Update" :"Add"}</button>
                    {
                      modify && (
                        <>
                          <button onClick={deleteactivity} type='button' className='px-[3rem] py-2 text-red-700 border-[1px] border-red-700 w-fit h-fit rounded-3xl hover:bg-red-500' disabled={deletingac}>{deletingac ? "Deleting":"Delete"}</button>                          
                        </>
                      )
                    }
                  </div>
                  {
                    addacresult && (<div className='text-custompurple mt-2'>{addacresult}</div>)
                  }
                  {
                    deleteac && (<div className='text-red-800 mt-2'>{deleteac}</div>)
                  }
                </form>
              </div>
            </div>
          </>
        )
      }
      <div className={`${open ? "max-w-7xl ml-auto" :"max-w-7xl m-auto" } pt-[8rem]`}>
        <div className='w-full overflow-auto h-[37rem] bg-customdark text-gray-200 rounded-3xl font-roboto'>
              {
                openproperty === "Schedule" ? (
                    <>
                        <div className='w-full'>
                            <div className='px-5 py-2 my-2 flex flex-wrap gap-2 items-center'>
                              <div className='p-2 rounded-xl bg-custompurple'>Today</div>
                              <div>{monthName} {date}, {years}</div>
                              {
                                plan && (
                                  <>
                                    <select
                                      id="options"
                                      value={selectedOption}
                                      onChange={(e) => setSelectedOption(e.target.value)}
                                      className='text-gray-200 bg-customgray py-1 px-3 rounded-lg'
                                    >
                                      <option value="">Select a plan</option> {/* Default option */}
                                      {plan.map((data) => (
                                        <option key={data.name} value={data.name}> {/* Added key prop */}
                                          {data.name}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                )
                              }
                            </div>
                            {
                              Days && Months && Endmonth ?(
                                <>
                                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-5'>
                                    {Days.map((data) => (
                                      <div
                                        className='w-full h-[9.7rem] border border-gray-500 text-sm'
                                        key={data._id}
                                      >
                                        <div className='text-center border-b border-gray-600 p-1'>
                                          {translateDay(data.day)}
                                        </div>
                                        {data.day === days ? (
                                          <div className='flex flex-col overflow-y-auto'>
                                            <div className='flex flex-wrap gap-2 items-center mt-1'>
                                              <div className='pl-3'>{date}</div>
                                              <div className='py-1 px-2 rounded-xl text-custompurple border border-custompurple'>
                                                Today
                                              </div>
                                              <button
                                                className='py-1 px-2 rounded-xl text-customblue border border-customblue hover:bg-customblue hover:text-white'
                                                disabled={!selectedOption}
                                                onClick={() => setaddtask(translateDay(data.day))}
                                              >
                                                Add Schedule
                                              </button>
                                            </div>
                                            <div className='mt-3 text-sm overflow-auto h-[4.5rem] flex flex-wrap gap-2 pl-3 hide-scrollbar'>
                                            {plan && (
                                              <>
                                                {plan.map((data2) => (
                                                  <React.Fragment key={data2._id}> {/* Add key here */}
                                                    {data2.name === selectedOption && (
                                                      <>
                                                        {data2.daily.map((activity) => (
                                                          <React.Fragment key={activity._id}> {/* Add key here */}
                                                            {activity.day === days && (
                                                              <>
                                                                {activity.activities.map((active) => (
                                                                  <p
                                                                    key={active._id} // Keep your existing key here
                                                                    title={`${active.description}`}
                                                                    style={{
                                                                      backgroundColor: `${active.color}`,
                                                                      color: `${active.textcolor}`,
                                                                    }}
                                                                    className={`${active.important ? "font-bold underline-offset-4 underline" : ""} p-1 rounded-xl w-fit h-fit cursor-pointer`}
                                                                    onClick={() => {
                                                                      setaddtask(translateDay(data.day));
                                                                      setacname(active.name);
                                                                      setdescriptionac(active.description);
                                                                      choosetextcolor(active.textcolor);
                                                                      setchoosecolor(active.color);
                                                                      setmodify(true);
                                                                      setmodifyacname(active.name);
                                                                      setdailyid(activity._id);
                                                                      setactiveid(active._id);
                                                                      setTime({ minutes: active.timestart.split(":")[1], hours: active.timestart.split(":")[0] });
                                                                      setTime2({ minutes: active.timeend.split(":")[1], hours: active.timeend.split(":")[0] });
                                                                      setimportant(active.important);
                                                                    }}
                                                                  >
                                                                    {active.name}
                                                                    {active.timestart !== ':' && active.timeend !== ':' &&
                                                                      `(${active.timestart}-${active.timeend})`}
                                                                  </p>
                                                                ))}
                                                              </>
                                                            )}
                                                          </React.Fragment>
                                                        ))}
                                                      </>
                                                    )}
                                                  </React.Fragment>
                                                ))}
                                              </>
                                            )}
                                          </div>
                                          </div>
                                        ) : (
                                          <div className='flex flex-col overflow-y-auto'>
                                            <div className='flex flex-wrap gap-2 items-center mt-1'>
                                              <div className='pl-3'>
                                                {data.day < days
                                                  ? Math.abs(date - Math.abs(data.day - days))
                                                  : Math.abs(date + Math.abs(data.day - days)) <= Endmonth
                                                  ? Math.abs(date + Math.abs(data.day - days))
                                                  : ''}
                                              </div>
                                              <button
                                                className='py-1 px-2 rounded-xl text-customblue border border-customblue hover:bg-customblue hover:text-white'
                                                disabled={!selectedOption}
                                                onClick={() => setaddtask(translateDay(data.day))}
                                              >
                                                Add Schedule
                                              </button>
                                            </div>
                                            <div className='mt-3 text-sm overflow-auto h-[4.5rem] flex flex-wrap gap-2 pl-3 hide-scrollbar pr-3'>
                                            {plan && (
                                              <>
                                                {plan.map((data2) => (
                                                  <React.Fragment key={data2._id}> {/* Add key here */}
                                                    {data2.name === selectedOption && (
                                                      <>
                                                        {data2.daily.map((activity) => (
                                                          <React.Fragment key={activity._id}> {/* Add key here */}
                                                            {activity.day === data.day && (
                                                              <>
                                                                {activity.activities.map((active) => (
                                                                  <p
                                                                    key={active._id} // Keep your existing key here
                                                                    title={`${active.description}`}
                                                                    style={{
                                                                      backgroundColor: `${active.color}`,
                                                                      color: `${active.textcolor}`,
                                                                    }}
                                                                    className={`${active.important ? "font-bold underline-offset-4 underline" : ""} p-1 rounded-xl w-fit h-fit cursor-pointer`}
                                                                    onClick={() => {
                                                                      setaddtask(translateDay(data.day));
                                                                      setacname(active.name);
                                                                      setdescriptionac(active.description);
                                                                      choosetextcolor(active.textcolor);
                                                                      setchoosecolor(active.color);
                                                                      setmodify(true);
                                                                      setmodifyacname(active.name);
                                                                      setdailyid(activity._id);
                                                                      setactiveid(active._id);
                                                                      setTime({ minutes: active.timestart.split(":")[1], hours: active.timestart.split(":")[0] });
                                                                      setTime2({ minutes: active.timeend.split(":")[1], hours: active.timeend.split(":")[0] });
                                                                      setimportant(active.important);
                                                                    }}
                                                                  >
                                                                    {active.name}
                                                                    {active.timestart !== ':' && active.timeend !== ':' &&
                                                                      `(${active.timestart}-${active.timeend})`}
                                                                  </p>
                                                                ))}
                                                              </>
                                                            )}
                                                          </React.Fragment>
                                                        ))}
                                                      </>
                                                    )}
                                                  </React.Fragment>
                                                ))}
                                              </>
                                            )}

                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </>
                                ):(
                                    <></>
                                )
                              }
                          </div>
                      </>
                  ): openproperty === "Plan" ? (
                      <>
                          <div className=' pl-5 font-roboto font-bold text-3xl py-4 text-center'>Your Plan</div>
                          <div className='flex gap-3 border-b pb-5 pl-5 flex-col'>
                              <div className='flex gap-4 w-fit'>
                                  <input type="text" placeholder="Add new plan" className='w-full rounded-lg border-2 p-2 text-black' value={newplan} onChange={(e) => setnewplan(e.target.value)} />
                                  <button className='rounded-lg p-2 border-[1px] hover:bg-gray-500'onClick={createnewplan} disabled={createloading}>{createloading ? "ADDING..." : "ADD"}</button>
                              </div>
                              {
                                  createresult && <div className='w-full'>{createresult}</div>
                              }
                          </div>
                          <table className="w-full overflow-auto">
                              <thead>
                                  <tr>
                                      <th className="py-2 p-4">Name</th>
                                      <th className="py-2 p-4">Progress</th>
                                      <th className="py-2 p-4">Time</th>
                                      <th className='opacity-0'></th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {
                                      loadingplan ? (
                                          <div>Loading</div>
                                      ):plan ? (
                                          <>
                                              {
                                                  plan.map((data) =>(
                                                      <tr key={data._id}>
                                                          <th className=' p-4'>{data.name}</th>
                                                          <th className=' p-4'>{data.progress} {data.progress === null ? "0 task done" : data.progress === 1 ? "task done" : "tasks done"} </th>
                                                          <th className=' p-4'>{calculateDaysBetweenDates(data.timebegin,currenttime)} {calculateDaysBetweenDates(data.timebegin,currenttime) === 0 ? "day" : calculateDaysBetweenDates(currenttime,data.timebegin) === 1 ? "day" : "days"}</th>
                                                          <th>
                                                              {
                                                                  Delete == data._id ? (
                                                                      <div className='flex gap-4 justify-center'>
                                                                          <button onClick={() => setDelete("")} className='p-2 rounded-lg bg-red-900 text-sm'>Cancel</button>
                                                                          <button className='p-2 rounded-lg bg-green-900 text-sm' disabled={deleteing} onClick={deleteplan}>Confirm</button>
                                                                      </div>
                                                                  ):(<>

                                                                      <button className='p-1 bg-gray-700 rounded-lg hover:bg-gray-500' onClick={()=> setDelete(data._id)}>
                                                                          <img src={images.trashcan} className='size-8' alt="" />
                                                                      </button>
                                                                  </>)
                                                              }
                                                          </th>
                                                      </tr>
                                                  ))
                                              }    
                                          </>
                                      ):(
                                          <></>
                                      )
                                  }
                              </tbody>
                          </table>
                      </>
                  ): openproperty === "mytask" ?(
                      <div className='w-full'>
                        <div className='px-5 py-2 my-2 flex flex-wrap gap-2 items-center'>
                          <div className='p-2 rounded-xl bg-custompurple'>Today</div>
                          <div>{monthName} {date}, {years}</div>
                          {
                            plan && (
                              <>
                                <select
                                  id="options"
                                  value={selectedOption}
                                  onChange={(e) => setSelectedOption(e.target.value)}
                                  className='text-gray-200 bg-customgray py-1 px-3 rounded-lg'
                                >
                                  <option value="">Select a plan</option> {/* Default option */}
                                  {plan.map((data) => (
                                    <option key={data.name} value={data.name}> {/* Added key prop */}
                                      {data.name}
                                    </option>
                                  ))}
                                </select>
                              </>
                            )
                          }
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 px-5 font-roboto'>
                          <div className='border-[1px] border-gray-500 max-h-[30rem] overflow-auto p-2 rounded-2xl break-words'>
                            <div className='text-2xl font-bold text-center my-1'>Today Schedule</div>
                            {checkedarray.length > 0 && (
                              <>
                                <button className='border-[1px] border-customblue text-purple-300 py-2 px-6 rounded-3xl hover:bg-custompurple bg-customblue2' disabled={updatingcheckedarray} onClick={updatecheckedarray}>{updatingcheckedarray ? "Updating" : "Update"}</button>
                              </>
                            )}
                            <div className='grid grid-cols-2'>
                              <div className=' border-b-[1px] border-r-[1px]'>
                                <div className='text-center'>Schedule</div>
                              </div>
                              <div>
                                <div className='text-center border-b-[1px]'>Description</div>
                              </div>
                            </div>
                            {/* rollover1 */}
                            {
                              plan && selectedOption && (
                              <>
                                {
                                  plan.map((data) =>(
                                    <>
                                      {data.name == selectedOption &&(
                                        <>
                                          {data.todaytask.map((data2) => (
                                            <>
                                              {
                                                data2.task.map((data3) =>(
                                                  <>
                                                    <div className='grid grid-cols-2'>
                                                      <div className='border-r-[1px]'>
                                                        <div className='flex items-center'>
                                                        <input
                                                          type="checkbox"
                                                          className={` size-4 lg:size-5 shrink-0`}
                                                          checked={data3.status == "Finished" ? true : checkedarray.includes(data3.name)}
                                                          onChange={(e) => {
                                                            if (e.target.checked) {
                                                              // Add the id to the array if checked
                                                              setcheckedarray((prev) => [...prev, data3.name]);
                                                            } else {
                                                              // Remove the id from the array if unchecked
                                                              setcheckedarray((prev) => prev.filter(name => name !== data3.name));
                                                            }
                                                          }}
                                                          disabled={data3.status == "Finished"}
                                                        />                                                       
                                                        <div style={{backgroundColor: `${data3.color}`, color: `${data3.textcolor}`}} className={`text-center m-2 p-1 rounded-xl md:text-base text-sm ${data3.important ? "font-bold underline-offset-4 underline" : ""} ${data3.status ? "line-through" : ""}`}>{data3.name}{data3.timestart !== ':' && data3.timeend !== ':' &&`(${data3.timestart}-${data3.timeend})`}</div>
                                                        </div>                                        
                                                      </div>
                                                      <div>
                                                        <div style={{backgroundColor: `${data3.color}`, color: `${data3.textcolor}`}} className='text-center m-2 p-1 rounded-xl'>{data3.description ? data3.description : "No description"}</div>
                                                      </div>
                                                    </div>
                                                  </>
                                                ))
                                              }
                                            </>
                                          ))}
                                        </>
                                      )}
                                    </>
                                  ))
                                }
                              </>
                              )
                            }
                          </div>
                          
                          <div className='border-[1px] border-gray-500 max-h-[30rem] overflow-auto p-2 rounded-2xl break-words'>
                            <div className='text-2xl font-bold text-center my-3'>TASK</div>
                            <div className='grid grid-cols-2'>
                              <div className=' border-b-[1px] border-r-[1px]'>
                                <div className='text-center'>Task</div>
                              </div>
                              <div>
                                <div className='text-center border-b-[1px]'>Description</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ):(
                    <></>
                  )
              }
            </div>
        </div>
        <>
          <img src={images.sidebar} className={`size-[3.5rem] absolute left-4 top-4 cursor-pointer z-40 transition-all duration-700 ${open === false ? "block" : "hidden"}`} alt="" onClick={()=>setopen(true)} />   
          <div className={` absolute left-0 top-0 h-screen font-roboto text-gray-300 bg-customdark transition-all duration-700 ease-in-out border-r-[1px] border-gray-700 ${open ? 'w-[12rem] opacity-100 z-30' : '-z-30 w-[4rem] opacity-0'}`}>
              <img src={images.closesidebar} className='size-[2rem] absolute top-5 right-5 bg-gray-400 cursor-pointer rounded-lg' onClick={()=>setopen(false)} alt="" />
              <div className='border-b-[1px] border-gray-700 pb-10 pt-14 flex flex-col w-full gap-1 items-center'>
                  <img src={images.profile} className='size-[5rem]' alt="" />
                  <div className=' w-full text-center'>{loggedusername}</div>
                  <div className='w-full text-center'>ROLE:</div>
                  <div className='text-red-600 w-full text-center'>{usernamerole}</div>
              </div>
              <div className='mt-7 flex flex-col gap-7'>
                  <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={()=> setopenproperty("Plan")}>Plan</div>
                  <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={()=> setopenproperty("Schedule")}>Daily Schedule</div>
                  <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={()=>setopenproperty("mytask")}>My Task</div>
                  <div className='cursor-pointer hover:bg-gray-700 p-3'>Finished Task</div>
                  <div className='cursor-pointer hover:bg-gray-700 p-3'>Music List</div>
              </div>
          </div>
        </>
      </div>
    );
};
