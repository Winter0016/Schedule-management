// Front-end/src/pages/Schedule.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path

export const Schedule = () => {
  const { loggedusername, plan, deleteac, setdeleteac, addacresult, setaddacresult, date, years, months, days, open, addschedule, setaddschedule, reversetranslateDay, selectedOption, setSelectedOption, modify, setmodify, modifyacname, setmodifyacname, dailyid, setdailyid, activeid, setactiveid,title,settitle,body,setbody,selectedDay,setSelectedDay,selectedHour,setSelectedHour,selectedMinute,setSelectedMinute,activenotify,setactivenotify,selected, setSelected,lasttitle,setlastitle} = useContext(Usercontext);

  let startingdays = 0;

  function translateMonth(months) {
    switch (months) {
      case 0: return "January";
      case 1: return "February";
      case 2: return "March";
      case 3: return "April";
      case 4: return "May";
      case 5: return "June";
      case 6: return "July";
      case 7: return "August";
      case 8: return "September";
      case 9: return "October";
      case 10: return "November";
      case 11: return "December";
      default: return ""; // In case the number is not between 1 and 12
    }
  }

  const monthName = translateMonth(months); // Returns "May"

  function translateDay(dayNumber) {
    switch (dayNumber) {
      case 1: return "Monday";
      case 2: return "Tuesday";
      case 3: return "Wednesday";
      case 4: return "Thursday";
      case 5: return "Friday";
      case 6: return "Saturday";
      case 7: return "Sunday";
      default: return ""; // In case the input is not between 1 and 7
    }
  }



  useEffect(() => {
    getdays();
  }, []);

  const [time, setTime] = useState({ hours: '', minutes: '' });
  const [time2, setTime2] = useState({ hours: '', minutes: '' });

  const [acname, setacname] = useState('');
  const [descriptionac, setdescriptionac] = useState('');
  const [addloadingac, setaddloadingac] = useState(false);
  const [deletingac, setdeletingac] = useState(false);
  const [choosecolor, setchoosecolor] = useState("#3399ff");
  const [textcolor, choosetextcolor] = useState("#e5e7eb");
  const [important, setimportant] = useState(false);




  const closefunction = () => {
    setaddschedule("");
    setmodify(false);
    setaddacresult("");
    setdailyid("");
    setactiveid("");
    setmodifyacname("");
    setdeleteac("");
    settitle("");
    setbody("");
    setlastitle("")
    setSelectedDay("");
    setactivenotify(false);
  }
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }
  

  const addactivity = async (e) => {
    e.preventDefault();
    console.log(`running addactivity`);
  
    let timeStart = { ...time };
    let timeEnd = { ...time2 };
  
    try {
      setaddloadingac(true);
      let subscription = null;
  
      if(!acname){
        throw new Error("Title is required in information!")
      }
      if(timeStart.hours && !timeStart.minutes){
        throw new Error("Min is required when input Hour!")
      }
      if(timeEnd.hours && !timeEnd.minutes){
        throw new Error("Min is required when input Hour!")
      }
      // 🔔 Handle Notification Subscription
      if (activenotify) {
        console.log("activenotify is true");

        if (!selectedDay) {
          throw new Error("Notify day is required for notification!");
        }
      
        const currentPermission = Notification.permission;
        console.log("Notification permission:", currentPermission);
      
        if (currentPermission === "granted") {
          console.log("Notification already granted.");
          // You can proceed to schedule or show notification
        } else if (currentPermission === "denied") {
          alert("You have previously blocked notifications. Please enable them in your browser settings and refresh the page.");
          throw new Error("Notifications are blocked.");
        } else if (currentPermission === "default") {
          alert("We'll now request notification permission. If the prompt doesn't appear, please enable notifications manually in your browser settings and refresh the page.");
          
          const permission = await Notification.requestPermission();
      
          if (permission === "granted") {
            console.log("Permission granted.");
            // Proceed to schedule/show notification
          } else if (permission === "denied") {
            alert("You denied notification permission. You can enable it in your browser settings.");
            throw new Error("Notification permission denied.");
          } else {
            // In rare cases, some browsers suppress the prompt silently
            alert("Notification request was not granted. Please enable it manually in your browser settings and refresh the page.");
            throw new Error("Notification prompt blocked or ignored.");
          }
        }
  
        try {
          const registration = await navigator.serviceWorker.ready;
          subscription = await registration.pushManager.getSubscription();
  
          if (!subscription) {
            const VAPID_PUBLIC_KEY = 'BIrmw2mcz3aafP6wwwpnqQ1l8810B55qllJdBPoKveYwmXbPI8OnFkz3sTx7qBGW_kH_f5Tkx89PUYbz2ciHXEo';
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log("New subscription created:", subscription);
          } else {
            console.log("Existing subscription found:", subscription);
          }
        } catch (subError) {
          console.error("Error during subscription:", subError);
          alert("Failed to get push subscription. Please try again later.");
          throw subError;
        }
      }
  
      // 📤 Send the Activity Data
      const response = await fetch("https://localhost/add-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loggedusername,
          planname: selectedOption,
          day: reversetranslateDay(addschedule),
          nameac: acname || modifyacname || title,
          acdescription: descriptionac,
          color: choosecolor,
          textcolor: textcolor,
          modifyacname: modifyacname,
          timestart: `${timeStart.hours}:${timeStart.hours? timeStart.minutes :""}`,
          timeend: `${timeEnd.hours}:${timeEnd.hours? timeEnd.minutes : ""}`,
          important: important,
          notify_day: selectedDay,
          notify_hour: selectedHour,
          notify_minute: selectedMinute,
          title: title || modifyacname || acname,
          lasttitle: lasttitle,
          body: body || descriptionac,
          active: activenotify,
          subscription: subscription || "already have subscription"
        }),
      });
  
      const data = await response.json();
      if (modify) {
        setacname(modifyacname);
      }
      setaddacresult(data);
      console.log("addacresult", data);
    } catch (error) {
      setaddacresult(error.message);
      console.error("Error in addactivity:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setaddloadingac(false);
    }
  };
  

  const deleteactivity = async () => {
    try {
      setdeletingac(true);
      const response = await fetch("https://localhost/delete-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loggedusername,
          planname: selectedOption,
          dailyId: dailyid,
          activityId: activeid,
          day: reversetranslateDay(addschedule),
          time:`${selectedDay} ${selectedHour}:${selectedMinute}`
        }),
      });
      const data = await response.json();
      setdeleteac(data);
      setdeletingac(false);
    } catch (error) {
      console.log(error);
      setdeletingac(false);
    }
  }

  const getdays = async (req, res) => {
    try {
      const response = await fetch("https://localhost/days", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setDays(data.days.sort((a, b) => a.day - b.day));
      setMonths(data.months);
    } catch (error) {
      console.log(error);
    }
  }
  const [Days, setDays] = useState();
  const [Months, setMonths] = useState();
  const [Endmonth, setEndmonth] = useState();
  const [PreviousEndmonth, setPreviousEndmonth] = useState();

  useEffect(() => {
    if (Months) {
      const endmonth = Months.find((key) => key.month === months + 1).end;
      let previousendmonth
      if (months == 0) {
        previousendmonth = Months.find((key) => key.month === 12).end;
      } else {
        previousendmonth = Months.find((key) => key.month === months).end;
      }
      setEndmonth(endmonth);
      setPreviousEndmonth(previousendmonth)
      // console.log(previousendmonth)
    }
  }, [Months]);



  return (
    <div className='w-full h-screen overflow-auto bg-customgray relative'>
      {addschedule && (
        <>
          <div className='absolute w-full h-screen bg-customblue2 bg-opacity-20 flex flex-wrap justify-center items-center z-50'>
            <form onSubmit={addactivity} className='w-full md:w-[30rem] m-auto p-5 rounded-3xl bg-customdark relative min-h-[44rem] overflow-auto hide-scrollbar flex flex-col justify-between'>
              <div className='top-container'>
                <img src={images.closecross} className='size-12 absolute top-4 right-5 cursor-pointer' onClick={() => closefunction()} alt="" />
                <div className='text-center break-words text-customblue text-2xl'>{addschedule}'s Schedule</div>
                <div className='flex justify-center w-full mt-5'>
                  <div className='h-10 w-1/2 relative flex items-center justify-between overflow-hidden bg-gray-700 rounded-full'>
                    <div
                      className={`absolute top-0 left-0 w-1/2 h-full bg-white rounded-full transition-transform duration-300`}
                      style={{
                        transform: selected === 'info' ? 'translateX(0%)' : 'translateX(100%)'
                      }}
                    />
                    <div
                      onClick={() => setSelected('info')}
                      className={`flex-1 flex justify-center text-center z-10 cursor-pointer select-none ${
                        selected === 'info' ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                    </div>
                    <div
                      onClick={() => setSelected('notify')}
                      className={`flex-1 flex justify-center text-center z-10 cursor-pointer select-none ${
                        selected === 'notify' ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                      </svg>

                    </div>
                  </div>
                </div>
                {
                  selected === 'info' ? (
                    <>
                        <div className={`text-base text-gray-400 mt-3`}>{modify ? "Current Title" : "Title"}</div>
                        <input required readOnly={modify ? true : false} type="text" className={`rounded-lg p-2 bg-customblue2 w-full mt-3 text-gray-200`} value={acname} onChange={(e) => setacname(e.target.value)} />
                        {modify && (
                          <>
                            <div className='text-base text-gray-400 mt-3'>Change Title (Optional)</div>
                            <input type="text" className='rounded-lg p-2 bg-customblue2  mt-3 text-gray-200 w-full' value={modifyacname} onChange={(e) => setmodifyacname(e.target.value)} />
                          </>
                        )}
                        <div className="flex items-center gap-2 text-gray-400 mt-3 text-lg">
                          <div>Time Start (optional):</div>
                          <select
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={time.hours}
                            onChange={(e) => setTime((prevTime) => ({ ...prevTime, hours: e.target.value }))}
                          >
                            <option value="">Hour</option>
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString()}
                              </option>
                            ))}
                          </select>
                          <span>:</span>
                          <select
                            required={time.hours}
                            disabled={!time.hours}
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={time.hours ? time.minutes : ""}
                            onChange={(e) => setTime((prevTime) => ({ ...prevTime, minutes: e.target.value }))}
                          >
                            <option value="">Min</option>
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 mt-3 text-lg">
                          <div>Time End (optional):</div>
                          <select
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={time2.hours}
                            onChange={(e) => setTime2((prevTime) => ({ ...prevTime, hours: e.target.value }))}
                          >
                            <option value="">Hour</option>
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString()}
                              </option>
                            ))}
                          </select>
                          <span>:</span>
                          <select
                            required={time2.hours}
                            disabled={!time2.hours}
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={time2.hours?time2.minutes:""}
                            onChange={(e) => setTime2((prevTime) => ({ ...prevTime, minutes: e.target.value }))}
                          >
                            <option value="">Min</option>
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='flex flex-wrap gap-2 mt-3 items-center'>
                          <div className={`text-lg text-red-700 text-bold underline`}>IMPORTANT</div>
                          <input className='size-7' type="checkbox" checked={important} onChange={(e) => setimportant(e.target.checked)} />
                        </div>
                        <div className='mt-3 text-base text-gray-400'>Choose Background Color</div>
                        <input required className='w-full mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={choosecolor} onChange={(e) => setchoosecolor(e.target.value)} />
                        <div className='mt-3 text-base text-gray-400'>Choose Text Color</div>
                        <input required className='w-full mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={textcolor} onChange={(e) => choosetextcolor(e.target.value)} />
                        <div className='text-base text-gray-400 mt-3'>Description</div>
                        <textarea placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-full h-[6rem]' value={descriptionac} onChange={(e) => setdescriptionac(e.target.value)}></textarea>   
                    </>
                  ):(
                    <>
                        <div className='flex gap-2 items-center mt-3'>
                          <div className={`text-base text-gray-400`}>Notification</div>
                          <label className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-500 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[#1976D2]">
                            <input
                              type="checkbox"
                              id="AcceptConditions"
                              className="peer sr-only"
                              checked={activenotify}
                              onChange={(e) => setactivenotify(e.target.checked)}
                            />
                            <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 bg-gray-900 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
                          </label>
                        </div>
                        <div className={`text-base text-gray-400 mt-3`}>Title</div>
                        <input required type="text" className={`rounded-lg p-2 bg-customblue2 w-full mt-3 text-gray-200`} value={title ? title : acname} onChange={(e) => settitle(e.target.value)} />
                        <div className="flex items-center gap-2 text-gray-400 mt-3 text-lg">
                          <div>Notify time:</div>
                          <select
                            required={activenotify}
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                          >
                            <option value ="">Day</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                            <option value="7">Sunday</option>
                          </select>

                          <div>at</div>

                          {/* Hour select */}
                          <select
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString()}
                              </option>
                            ))}
                          </select>

                          <div>:</div>

                          {/* Minute select */}
                          <select
                            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(e.target.value)}
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>

                        </div>
                        <div className='text-base text-gray-400 mt-3'>Body</div>
                        <textarea placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-full h-[6rem]' value={body ? body : descriptionac} onChange={(e) => setbody(e.target.value)}></textarea>
                    </>
                  )
                }
              </div>
              <div className='w-full flex flex-col h-fit'>
                <div className='flex justify-between'>
                  <button type='submit' className='px-[5rem] py-2 text-customblue border-[1px] border-customblue w-fit h-fit rounded-3xl hover:bg-customgray' disabled={addloadingac}>{modify ? "Update" : "Add"}</button>
                  {modify && (
                    <>
                      <button onClick={deleteactivity} type='button' className='px-[3rem] py-2 text-red-700 border-[1px] border-red-700 w-fit h-fit rounded-3xl hover:bg-red-500' disabled={deletingac}>{deletingac ? "Deleting" : "Delete"}</button>
                    </>
                  )}
                </div>
                {addacresult && (<div className='text-custompurple mt-2'>{addacresult}</div>)}
                {deleteac && (<div className='text-red-800 mt-2'>{deleteac}</div>)}
              </div>
            </form>
          </div>
        </>
      )}
      <div className='mt-20'>
        <div className={`${open ? "max-w-7xl ml-auto" : "max-w-7xl m-auto"}`}>
          <div className='w-full bg-customdark rounded-3xl font-roboto text-gray-200 p-2 h-[37rem] overflow-auto'>
            <div className='px-5 py-2 my-2 flex flex-wrap gap-2 items-center'>
              <div className='p-2 rounded-xl bg-custompurple'>Today</div>
              <div>{monthName} {date}, {years}</div>
              {plan && (
                <>
                  <select
                    id="options"
                    value={selectedOption}
                    onChange={(e) => {setSelectedOption(e.target.value)}}
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
              )}
            </div>
            {Days && Months && Endmonth ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-5'>
                  {Days.map((data) => (
                    <div
                      className=' flex flex-col w-full h-[9.7rem] border border-gray-500 text-sm'
                      key={data._id}>
                      <div className='text-center border-b border-gray-600 p-1'>
                        {translateDay(data.day)}
                      </div>
                      {data.day === days ? (
                        // first modifyicators
                        <div className='flex flex-col overflow-y-auto flex-grow pb-2'>
                          <div className='flex flex-wrap gap-2 items-center mt-1'>
                            <div className='pl-3'>{date}</div>
                            <div className='py-1 px-2 rounded-xl text-custompurple border border-custompurple'>
                              Today
                            </div>
                            <button
                              className='py-1 px-2 rounded-xl text-customblue border border-customblue hover:bg-customblue hover:text-white'
                              disabled={!selectedOption}
                              onClick={() => setaddschedule(translateDay(data.day))}
                            >
                              Add Schedule
                            </button>
                            {
                              plan && (
                                <>
                                  {
                                    plan.map((Data) => (
                                      <React.Fragment key={Data._id}>
                                        {Data.name === selectedOption && (
                                          <>
                                            {Data.daily.map((ac) => (
                                              <React.Fragment key={ac._id}>
                                                {ac.day === days && (
                                                  <>
                                                    {
                                                      (function invokeImmediately(){ // first way: ( ( ()=>{} ) ) , sencond way: ( function *any name you want*(){} ) 
                                                        let truactivitycount = 0;

                                                        Data.my_task.forEach((task) => {
                                                          if (
                                                            task.deadline.split("/")[1] === date.toString() &&
                                                            task.deadline.split("/")[0] === (months + 1).toString()
                                                          ) {
                                                            truactivitycount++;
                                                          }
                                                        });

                                                        return (
                                                          <div className='px-3 py-1 rounded-full border border-blue-800 text-blue-400'>
                                                            {ac.activityCount + truactivitycount} {/* Display the total count */}
                                                          </div>
                                                        );
                                                      })() //Immediately Invoked Function Expression (Advance method learned from chatgpt )
                                                    }
                                                  </>
                                                )}
                                              </React.Fragment>
                                            ))}
                                          </>
                                        )}
                                      </React.Fragment>
                                    ))
                                  }
                                </>
                              )
                            }
                          </div>
                          <div className='mt-3 text-sm overflow-y-auto flex flex-wrap gap-2 pl-3 hide-scrollbar flex-grow'>
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
                                                {
                                                  data2.my_task.map((task) => (
                                                    <React.Fragment key={task._id}>
                                                      {
                                                        (task.deadline.split("/")[1] === date.toString() &&
                                                          task.deadline.split("/")[0] === (months + 1).toString()) && (
                                                          <p
                                                            title={`${task.description}`}
                                                            style={{
                                                              backgroundColor: `${task.color}`,
                                                              color: `${task.textcolor}`,
                                                            }}
                                                            className={`font-bold underline-offset-4 underline p-1 rounded-xl w-fit h-fit flex flex-wrap gap-1 items-center`}
                                                          >
                                                            {task.name}
                                                            {
                                                              `(${task.timestart.split(':')[0]}${task.timestart.split(':')[1] ? ':' + task.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${task.timeend.split(':')[0]}${task.timeend.split(':')[1] ? ':' + task.timeend.split(':')[1].toString().padStart(2, '0') : ''})`}
                                                            <img src={images.deadline} className=' size-7' alt="" />
                                                          </p>
                                                        )
                                                      }
                                                    </React.Fragment>
                                                  ))
                                                }
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
                                                      setaddschedule(translateDay(data.day));
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
                                                      settitle(active.notification.title);
                                                      setlastitle(active.notification.title);
                                                      setbody(active.notification.body);
                                                      setSelectedDay(active.notification.notify_day);
                                                      setSelectedHour(active.notification.notify_hour);
                                                      setSelectedMinute(active.notification.notify_minute);
                                                      setactivenotify(active.notification.active);
                                                      console.log(active.notification.notify_minute);
                                                    }}
                                                  >
                                                    {active.name}
                                                    {
                                                      `(${active.timestart.split(':')[0]}${active.timestart.split(':')[1] ? ':' + active.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${active.timeend.split(':')[0]}${active.timeend.split(':')[1] ? ':' + active.timeend.split(':')[1].toString().padStart(2, '0') : ''})`}
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
                        //Second Modificators
                        <div className='flex flex-col overflow-y-auto flex-grow pb-2'>
                          <div className='flex flex-wrap gap-2 items-center mt-1'>
                            <div className='pl-3'>
                              {data.day < days ? (date - (days - data.day)) <= 0 ? `${PreviousEndmonth + (date - (days - data.day))}(${translateMonth(months -1)})` : (date - (days - data.day)) : (date + (data.day - days)) <= Endmonth ? (date + (data.day - days)) : function PastEndMonth(){
                                const monthName = translateMonth(months + 1); // Returns "May"
                                startingdays++;
                                return(
                                  <>{startingdays}({monthName})</>
                                )
                              }()}
                            </div>
                            <button
                              className='py-1 px-2 rounded-xl text-customblue border border-customblue hover:bg-customblue hover:text-white'
                              disabled={!selectedOption}
                              onClick={() => setaddschedule(translateDay(data.day))}
                            >
                              Add Schedule
                            </button>
                            {
                              plan && (
                                <>
                                  {
                                    plan.map((Data) => (
                                      <React.Fragment key={Data._id}>
                                        {Data.name === selectedOption && (
                                          <>
                                            {Data.daily.map((ac) => (
                                              <React.Fragment key={ac._id}>
                                                {ac.day === data.day && (
                                                  <>
                                                    {
                                                      (function invokeImmediately(){ // first way: ( ( ()=>{} ) ) , sencond way: ( function *any name you want*(){} ) 
                                                        let truactivitycount = 0;

                                                        Data.my_task.forEach((task) => {
                                                          if (
                                                            Number(task.deadline.split("/")[1]) == (data.day < days ? (date - (days - data.day)) <= 0 ? PreviousEndmonth + (date - (days - data.day)) : (date - (days - data.day)) : (date + (data.day - days)) < Endmonth ? (date + (data.day - days)) : startingdays++) &&
                                                            Number(task.deadline.split("/")[0]) == (data.day < days ? (date - (days - data.day)) <= 0 ? months : months + 1 : (date + (data.day - days)) < Endmonth ? months + 1 : months + 2)
                                                          ) {
                                                            truactivitycount++;
                                                          }
                                                        });

                                                        return (
                                                          <div className='px-3 py-1 rounded-full border border-blue-800 text-blue-400'>
                                                            {ac.activityCount + truactivitycount}
                                                          </div>
                                                        );
                                                      })() //Immediately Invoked Function Expression (Advance method learned from chatgpt )
                                                    }
                                                  </>
                                                )}
                                              </React.Fragment>
                                            ))}
                                          </>
                                        )}
                                      </React.Fragment>
                                    ))
                                  }
                                </>
                              )
                            }
                          </div>
                          <div className='mt-3 text-sm overflow-auto flex flex-wrap gap-2 pl-3 hide-scrollbar pr-3'>
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
                                                {
                                                  data2.my_task.map((task) => (
                                                    <React.Fragment key={task._id}>
                                                      {
                                                        Number(task.deadline.split("/")[1]) == (data.day < days ? (date - (days - data.day)) <= 0 ? PreviousEndmonth + (date - (days - data.day)) : (date - (days - data.day)) : (date + (data.day - days)) < Endmonth ? (date + (data.day - days)) : "") &&
                                                        Number(task.deadline.split("/")[0]) == (data.day < days ? (date - (days - data.day)) <= 0 ? months : months + 1 : (date + (data.day - days)) < Endmonth ? months + 1 : "") &&
                                                        (
                                                          <p
                                                            title={`${task.description}`}
                                                            style={{
                                                              backgroundColor: `${task.color}`,
                                                              color: `${task.textcolor}`,
                                                            }}
                                                            className={`font-bold underline-offset-4 underline p-1 rounded-xl w-fit h-fit flex flex-wrap gap-1 items-center`}
                                                          >
                                                            {task.name}
                                                            {
                                                              `(${task.timestart.split(':')[0]}${task.timestart.split(':')[1] ? ':' + task.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${task.timeend.split(':')[0]}${task.timeend.split(':')[1] ? ':' + task.timeend.split(':')[1].toString().padStart(2, '0') : ''})`
                                                            }
                                                            <img src={images.deadline} className=' size-7' alt="" />
                                                          </p>
                                                        )
                                                      }
                                                    </React.Fragment>
                                                  ))
                                                }
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
                                                      setaddschedule(translateDay(data.day));
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
                                                      settitle(active.notification.title);
                                                      setbody(active.notification.body);
                                                      setSelectedDay(active.notification.notify_day);
                                                      setSelectedHour(active.notification.notify_hour);
                                                      setSelectedMinute(active.notification.notify_minute);
                                                      setactivenotify(active.notification.active)
                                                      setlastitle(active.notification.title)
                                                    }}
                                                  >
                                                    {active.name}
                                                    {
                                                      `(${active.timestart.split(':')[0]}${active.timestart.split(':')[1] ? ':' + active.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${active.timeend.split(':')[0]}${active.timeend.split(':')[1] ? ':' + active.timeend.split(':')[1].toString().padStart(2, '0') : ''})`}
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
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}