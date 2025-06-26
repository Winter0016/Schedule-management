
import React, { useState, useContext,useEffect} from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Mytask = () =>{
    const { loggedusername, plan,selectedOption,monthName,setSelectedOption,days, date, years, months, open,setaddtask,addtask,updatetaskresult,setupdatetaskresult,loadingplan,setupdatecheckedarrayresult,selectedMonth,selectedDate,setSelectedDate,setSelectedMonth,setPreviousMonth,setPreviousDate,modifyupdatetask, setmodifyupdatetask,modifyacnametask, setmodifyacnametask,setdeletefinishedtaskResult,title,settitle,body,setbody,selectedHour,setSelectedHour,selectedMinute,setSelectedMinute,activenotify,setactivenotify,selected, setSelected,notifyMonth,setnotifyMonth,notifyDay,setnotifyDay,lasttitle,setlastitle} = useContext(Usercontext);    
      const [checkedarray,setcheckedarray] = useState([]);
      const [updatingcheckedarray,setupdatingcheckedarray] = useState(false);
    
      // if(checkedarray){
      //   console.log(checkedarray);
      //   console.log(checkedarray.length);
      // }
    
      const [acname, setacname] = useState('');
      const [descriptionac, setdescriptionac] = useState('');
      const [deletingac, setdeletingac] = useState(false);
      const [choosecolor, setchoosecolor] = useState("#3399ff");
      const [textcolor, choosetextcolor] = useState("#e5e7eb");
      const [updatingtask,setupdatingtask] = useState(false);

      const [deletefinishedtask,setdeletefinishedtask] = useState("");

      const [taskselection,settaskselection] = useState("Available Task");
    const updatecheckedarray = async() =>{
        try{
            setupdatingcheckedarray(true);
            const response = await axios.post("http://13.217.195.4:3000/update-checkedarray", {
                username: loggedusername,
                plan:selectedOption,
                checkedArray : checkedarray,
                day:days,
                month:months,
                date:date,
                year:years
            })
            const data = response.data;
            console.log(data);
            setupdatingcheckedarray(false);
            setcheckedarray([]);
            setupdatecheckedarrayresult(data);
        }catch(error){
            setcheckedarray([]);
            setupdatingcheckedarray(false);
            console.log(error);
        }
    }
    const [time, setTime] = useState({ hours: '', minutes: '' });
    const [time2, setTime2] = useState({ hours: '', minutes: '' });
    
    const handleMonthChange = (e) => {
        setSelectedMonth((e.target.value));
        setSelectedDate(null); // Reset date when month changes
    };
    
    const handleDateChange = (e) => {
        setSelectedDate((e.target.value));
    };
    
    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };
    
    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }
    const updatetask = async(e)=>{
        e.preventDefault();
        let timeStart = { ...time };
        let timeEnd = { ...time2 };

        try {
            setupdatingtask(true);
            let subscription = null;
            if(!selectedDate && !selectedMonth){
                throw new Error("Deadlines are required!");
            }
            if(!acname){
                throw new Error("Name is required in info sector!")
            }
            if(timeStart.hours && !timeStart.minutes){
                throw new Error("Min is required when input Hour!")
            }
            if(timeEnd.hours && !timeEnd.minutes){
                throw new Error("Min is required when input Hour!")
            }
            
            if (activenotify) {
                console.log("activenotify is true");
                if(!notifyMonth || !notifyDay){
                    throw new Error("Notify day and month are required for notification!")
                }
                // 🔐 Check if notifications are blocked
                console.log("notification permission: ",Notification.permission);
                if (Notification.permission === 'denied') {
                    alert("You have blocked notifications. Please enable them in your browser settings.");
                    throw new Error("Notifications are blocked.");
                }
            
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    throw new Error("Website has blocked prompt, please enable it back!");
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
            const response = await axios.post("http://13.217.195.4:3000/update-task",{
                username: loggedusername,
                planname: selectedOption,
                nameac: acname,
                acdescription: descriptionac,
                color: choosecolor,
                textcolor: textcolor,
                timestart: `${timeStart.hours}:${timeStart.hours? timeStart.minutes : ""}`,
                timeend: `${timeEnd.hours}:${timeStart.hours ? timeEnd.minutes : ""}`,
                deadline: `${selectedMonth}/${selectedDate}`,
                modifyacname: modifyacnametask,
                notify_month: notifyMonth ? notifyMonth : "",
                notify_day: notifyDay ? notifyDay : "",
                notify_hour: selectedHour,
                notify_minute: selectedMinute ,
                title: title || modifyacnametask || acname,
                lasttitle:lasttitle,
                body: body || descriptionac,
                active: activenotify,
                subscription: subscription || "already have subscription"
            })
            const data = response.data;
            setupdatetaskresult(data);
        }catch(error){
            console.log("error :",error);
            setupdatetaskresult(error.message);
        }finally{
            setupdatingtask(false);
        }
    }

    const [mytaskid,setmytaskid] = useState("");
    const deletetask = async () => {
        try {
            setdeletingac(true);
            const response = await fetch("http://13.217.195.4:3000/delete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loggedusername,
                    planname: selectedOption,
                    mytaskid:mytaskid,
                    time: `${notifyMonth}/${notifyDay} ${selectedHour}:${selectedMinute}`
                }),
            });
            const data = await response.json();
            setupdatetaskresult(data);
        } catch (error) {
            console.log(error);
        }
        finally{
            setdeletingac(false)
        }
    }

    // const estimatetime = (deadline) => {
    //     const today = new Date();
    //     const todayMonth = today.getMonth() + 1; // Current month (1-12)
    //     const todayDate = today.getDate(); // Current date (1-31)

    //     const [month, date] = deadline.split("/").map(Number); // Parse month and date

    //     const deadlineDate = new Date(today.getFullYear(), month - 1, date); // month - 1 because months are 0-indexed

    //     const timeDifference = deadlineDate - today;
    //     // console.log(`timedifference : ${timeDifference}`)
    //     // console.log(`1 day in millisecond : ${(1000 * 60 * 60 * 24)}`)
    //     // console.log(timeDifference / (1000 * 60 * 60 * 24))

    //     const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    //     if (daysLeft < 0) {
    //         return ("Deadline has passed");
    //     } else {
    //         return(`${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`);
    //     }
    // }

    const calculateDaysLeft = (deadline) => {
        const today = new Date();
        const [month, day] = deadline.split("/").map(Number);
        const deadlineDate = new Date(today.getFullYear(), month - 1, day);
        const timeDifference = deadlineDate - today;
        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    };
    // ...

    const [deletingfinishedtask,setdeletingfinishedtask] = useState(false);
    const deleteFinishedTask = async () => {
        try {
            setdeletefinishedtask(true);
            const response = await axios.post("http://13.217.195.4:3000/deletefinishedtask",{
                username:loggedusername,
                planname: selectedOption,
                finishedtask_id: deletefinishedtask,
            })
            const data = response.data;
            setdeletefinishedtaskResult(data);        
        } catch (error) {
            console.log(error)
        }finally{
            setdeletingfinishedtask(false);
        }
    }

    // ...
    //sample of using Array.from

    // const fruits = ['apple', 'banana', 'orange'];
    // const fruitInfo = Array.from(fruits, (fruit, i) => ({ name: fruit, position: i + 1 }));
    // console.log(fruitInfo);
    // Output:
    // [
    //   { name: 'apple', position: 1 },
    //   { name: 'banana', position: 2 },
    //   { name: 'orange', position: 3 }
    // ]  
    
    //

    const closefunction = ()=>{
        setaddtask(false);setupdatetaskresult("");setmodifyupdatetask(false);setmodifyacnametask("");setSelectedMonth("");setSelectedDate("");setPreviousDate("");setPreviousMonth("");setlastitle("");setactivenotify(false);
    }
    return(
        <>
            <div className='w-full h-screen overflow-auto bg-customgray relative'>
                {addtask && (
                    <>
                        <div className='absolute w-full h-screen bg-customblue2 bg-opacity-20 flex flex-wrap justify-center items-center z-50'>
                            <form onSubmit={updatetask} className='w-full md:w-[30rem] m-auto p-5 rounded-3xl bg-customdark relative min-h-[44rem] overflow-auto hide-scrollbar flex flex-col justify-between'>
                                <div>
                                    <img src={images.closecross} className='size-12 absolute top-4 right-5 cursor-pointer' onClick={() => closefunction()} alt="" />
                                    <div className='text-center break-words text-customblue text-2xl'>TASK</div>
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
                                                <div className={`text-base text-gray-400 mt-3`}>{modifyupdatetask ? "Current Title" : "Title"}</div>
                                                <input required value={acname} onChange={(e)=>setacname(e.target.value)} readOnly={modifyupdatetask ? true: false} type="text" className={`rounded-lg p-2 bg-customblue2 w-full mt-3 text-gray-200`} />
                                                {modifyupdatetask && (
                                                    <>
                                                    <div className='text-base text-gray-400 mt-3'>Change Title (Optional)</div>
                                                    <input type="text" className='rounded-lg p-2 bg-customblue2 w-full mt-3 text-gray-200' value={modifyacnametask} onChange={(e) => setmodifyacnametask(e.target.value)} />
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
                                                        value={time.minutes}
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
                                                <div className='flex items-center gap-2 text-gray-400 mt-3 text-lg'>
                                                    <div className='text-red-500'>Deadline (required):</div>
                                                    <div>
                                                        <select
                                                            required
                                                            value={selectedMonth || ""} // Set to an empty string if selectedMonth is null or undefined
                                                            onChange={handleMonthChange}
                                                            className="border border-gray-300 rounded-md w-20 text-center"
                                                        >
                                                            <option value="">Month</option> {/* Use an empty string as the default value */}
                                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                                <option key={month} value={month}>
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <span>/</span>
                                                    <select
                                                        required
                                                        value={selectedDate || ""}
                                                        onChange={handleDateChange}
                                                        className="border border-gray-300 rounded-md w-16 text-center"
                                                        disabled={!selectedMonth}
                                                    >
                                                        <option value="">Date</option>
                                                        {selectedMonth &&
                                                            Array.from({ length: getDaysInMonth(selectedMonth, new Date().getFullYear()) }, (_, i) => i + 1).map((day) => (
                                                                <option key={day} value={day}>
                                                                    {day}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div value={choosecolor} onChange={(e)=>setchoosecolor(e.target.value)} className='mt-3 text-base text-gray-400'>Choose Background Color</div>
                                                <input required className='w-full mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={choosecolor} onChange={(e) => setchoosecolor(e.target.value)} />
                                                <div className='mt-3 text-base text-gray-400' value={textcolor} onChange={(e)=>choosetextcolor(e.target.value)}>Choose Text Color</div>
                                                <input required className='w-full mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={textcolor} onChange={(e) => choosetextcolor(e.target.value)} />
                                                <div className='text-base text-gray-400 mt-3' >Description</div>
                                                <textarea value={descriptionac} onChange={(e)=> setdescriptionac(e.target.value)} placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-full h-[6rem]'></textarea>                                        
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
                                                <div className={`text-base text-gray-400 mt-3`}>Title(optional)</div>
                                                <input type="text" className={`rounded-lg p-2 bg-customblue2 w-full mt-3 text-gray-200`} value={title} onChange={(e) => settitle(e.target.value)} placeholder={acname || modifyacnametask} />
                                                <div className='mt-3 text-lg text-gray-400'>Notify time:</div>
                                                <div className='flex items-center gap-2 text-gray-400 mt-3 text-lg'>
                                                    <div>
                                                        <select
                                                            required ={activenotify}
                                                            value={notifyMonth} // Set to an empty string if selectedMonth is null or undefined
                                                            onChange={(e) => setnotifyMonth((e.target.value))}
                                                            className="border border-gray-300 rounded-md w-20 text-center"
                                                        >
                                                            <option value="">Month</option> {/* Use an empty string as the default value */}
                                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                                <option key={month} value={month}>
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <span>/</span>
                                                    <select
                                                        required = {activenotify}
                                                        value={notifyDay}
                                                        onChange={(e) => setnotifyDay((e.target.value))}
                                                        className="border border-gray-300 rounded-md w-16 text-center"
                                                        disabled={!notifyMonth}
                                                    >
                                                        <option value="">Date</option>
                                                        {notifyMonth &&
                                                            Array.from({ length: getDaysInMonth(notifyMonth, new Date().getFullYear()) }, (_, i) => i + 1).map((day) => (
                                                                <option key={day} value={day}>
                                                                    {day}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 mt-3 text-lg">
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
                                                <textarea placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-full h-[6rem]' value={body ? body : descriptionac} onChange={(e) => setbody(e.target.value)}></textarea>
                                            </>
                                        )
                                    }                                    
                                </div>
                                
                                <div className='w-full flex flex-col h-fit'>
                                    <div className='flex justify-between'>
                                        <button type='submit' className='px-[5rem] py-2 text-customblue border-[1px] border-customblue w-fit h-fit rounded-3xl hover:bg-customgray' disabled={updatingtask}>{modifyupdatetask ? "Update" : updatingtask ? "Updating..." : "Add"}</button>
                                        {modifyupdatetask && (
                                        <>
                                            <button onClick={deletetask} type='button' className='px-[3rem] py-2 text-red-700 border-[1px] border-red-700 w-fit h-fit rounded-3xl hover:bg-red-500' disabled={deletingac}>{deletingac ? "Deleting" : "Delete"}</button>
                                        </>
                                        )}
                                    </div>
                                </div>
                                {updatetaskresult && (<div className='text-custompurple mt-2'>{updatetaskresult}</div>)}
                            </form>
                        </div>
                    </>
                )}
                <div className={`${open ? "max-w-7xl ml-auto" : "max-w-7xl m-auto"} mt-20`}>
                    <div className='w-full bg-customdark rounded-3xl font-roboto text-gray-200 p-2 h-[37rem] overflow-auto'>
                        <div className='px-5 py-2 my-2 flex flex-wrap gap-2 items-center'>
                        <div className='p-2 rounded-xl bg-custompurple'>Today</div>
                        <div>{monthName} {date}, {years}</div>
                        {
                            plan && (
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
                            )
                        }
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 px-5 font-roboto'>
                            <div className='border-[1px] border-gray-500 max-h-[25rem] p-2 rounded-2xl break-words flex flex-col'>
                                <div className='text-2xl font-bold text-center my-1'>Today Schedule</div>
                                {checkedarray.length > 0 && (
                                <>
                                    <button className='border-[1px] border-customblue text-purple-300 py-2 px-6 rounded-3xl hover:bg-custompurple bg-customblue2 w-fit' disabled={updatingcheckedarray} onClick={updatecheckedarray}>{updatingcheckedarray ? "Updating" : "Update"}</button>
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
                                <div className='flex-grow overflow-auto hide-scrollbar'>
                                    {
                                        plan && selectedOption && loadingplan == false && (
                                        <>
                                            {
                                                plan.map((data) =>(
                                                    <React.Fragment key={data._id}>
                                                    {data.name == selectedOption &&(
                                                        <>
                                                            {data.todaytask.map((data2) => (
                                                                <React.Fragment key={data2._id}>
                                                                {
                                                                    data2.task.map((data3) =>(
                                                                    <React.Fragment key={data3._id}>
                                                                        <div className='grid grid-cols-2'>
                                                                            <div className='border-r-[1px] pb-3'>
                                                                                <div className='flex items-center'>
                                                                                    <input
                                                                                    type="checkbox"
                                                                                    className={` size-4 lg:size-5 shrink-0`}
                                                                                    checked={data3.status === "Finished" || checkedarray.map((item) => item.Name).includes(data3.name)/* or you can use : checkedarray.some(item => item.Name === data3.name) **/} 
                                                                                    onChange={(e) => {
                                                                                        if (e.target.checked) {
                                                                                        // Add the id to the array if checked
                                                                                        setcheckedarray((prev) => [...prev, {Name: data3.name,Task:data3.task,Description:data3.description}]);
                                                                                        } else {
                                                                                        // Remove the id from the array if unchecked
                                                                                        setcheckedarray((prev) => prev.filter(item => item.Name !== data3.name));
                                                                                        }
                                                                                    }}
                                                                                    disabled={data3.status == "Finished"}
                                                                                    />                                                       
                                                                                    <div style={{backgroundColor: `${data3.color}`, color: `${data3.textcolor}`}} className={`text-center m-2 p-1 rounded-xl md:text-base text-sm flex items-center gap-1 ${data3.important ? "font-bold underline-offset-4 underline" : ""} ${data3.status ? "line-through" : ""}`}>{data3.name}{`(${data3.timestart.split(':')[0]}${data3.timestart.split(':')[1] ? ':' + data3.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${data3.timeend.split(':')[0]}${data3.timeend.split(':')[1] ? ':' + data3.timeend.split(':')[1].toString().padStart(2, '0') : ''})`}
                                                                                        {data3.task == true && (
                                                                                            <img src={images.deadline} className=' size-7' alt="" />
                                                                                        )}
                                                                                    </div>
                                                                                </div>                                        
                                                                            </div>
                                                                            <div>
                                                                                <div style={{backgroundColor: `${data3.color}`, color: `${data3.textcolor}`}} className='text-center m-2 p-1 rounded-xl'>{data3.description ? data3.description : "No description"}</div>
                                                                            </div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                    ))
                                                                }
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
                            </div>
                        
                            <div className='border-[1px] border-gray-500 max-h-[25rem] overflow-auto p-2 rounded-2xl break-words flex flex-col'>
                                <div className=' relative'>
                                    <button className='absolute left-3 rounded-xl px-8 py-1 bg-custompurple hover:bg-opacity-70' disabled={!selectedOption} onClick={()=>setaddtask(!addtask)}>ADD</button>
                                    <div className='text-2xl font-bold text-center my-1'>TASK</div>
                                    <div className='flex justify-center my-5 relative md:absolute md:right-3 md:top-0 md:w-fit md:h-fit md:my-0'>
                                        <select
                                            id="options"
                                            className='text-gray-200 bg-customgray py-1 px-3 rounded-lg'
                                            value={taskselection}
                                            onChange={(e)=>settaskselection(e.target.value)}
                                        >
                                            <option value="Available Task">Available Task</option> {/* Default option */}
                                            <option value="Finished Task">Finished Tasks</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <div className=' border-b-[1px] border-r-[1px]'>
                                        <div className='text-center'>Task</div>
                                    </div>
                                    <div>
                                        <div className='text-center border-b-[1px]'>Description</div>
                                    </div>
                                </div>
                                {/* rollover1 */}
                                <div className='flex-grow overflow-auto hide-scrollbar'>
                                    {
                                        plan && selectedOption && (
                                            <>
                                                {
                                                    plan.map((data) => (
                                                        <React.Fragment key={data._id}>
                                                            {data.name === selectedOption && (
                                                                <>
                                                                    {
                                                                        taskselection === "Available Task" ? (
                                                                            <>
                                                                                {data.my_task
                                                                                    .sort((a, b) => {
                                                                                        const daysLeftA = calculateDaysLeft(a.deadline);
                                                                                        const daysLeftB = calculateDaysLeft(b.deadline);
                                                                                        return daysLeftA - daysLeftB; // Sort in ascending order
                                                                                    })
                                                                                    .map((data2) => (
                                                                                        <React.Fragment key={data2._id}>
                                                                                            <div className='grid grid-cols-2'>
                                                                                                <div className='border-r-[1px] pb-3'>
                                                                                                    <div className='flex items-center'>
                                                                                                        <div style={{ backgroundColor: `${data2.color}`, color: `${data2.textcolor}` }} className={`text-center m-2 p-1 rounded-xl md:text-base text-sm font-bold hover:cursor-pointer`} onClick={() => {
                                                                                                            setaddtask(true);
                                                                                                            setacname(data2.name);
                                                                                                            setmodifyacnametask(data2.name);
                                                                                                            setchoosecolor(data2.color);
                                                                                                            setmodifyupdatetask(true);
                                                                                                            choosetextcolor(data2.textcolor);
                                                                                                            setdescriptionac(data2.description);
                                                                                                            setTime({ minutes: data2.timestart.split(":")[1], hours: data2.timestart.split(":")[0] });
                                                                                                            setTime2({ minutes: data2.timeend.split(":")[1], hours: data2.timeend.split(":")[0] });
                                                                                                            setSelectedMonth(data2.deadline.split("/")[0]);
                                                                                                            console.log(`deadline: `,data2.deadline)
                                                                                                            setSelectedDate(data2.deadline.split("/")[1]);
                                                                                                            setPreviousDate(data2.deadline.split("/")[1]);
                                                                                                            setPreviousMonth(data2.deadline.split("/")[0]);
                                                                                                            setmytaskid(data2._id);
                                                                                                            settitle(data2.notification.title);
                                                                                                            setlastitle(data2.notification.title)
                                                                                                            setbody(data2.notification.body);
                                                                                                            setnotifyDay(data2.notification.notify_day)
                                                                                                            setnotifyMonth(data2.notification.notify_month)
                                                                                                            setSelectedHour(data2.notification.notify_hour);
                                                                                                            setSelectedMinute(data2.notification.notify_minute);
                                                                                                            setactivenotify(data2.notification.active)
                                                                                                        }}>
                                                                                                            {data2.name}
                                                                                                            {`(${data2.timestart.split(':')[0]}${data2.timestart.split(':')[1] ? ':' + data2.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${data2.timeend.split(':')[0]}${data2.timeend.split(':')[1] ? ':' + data2.timeend.split(':')[1].toString().padStart(2, '0') : ''})`}
                                                                                                        </div>
                                                                                                        
                                                                                                    </div>
                                                                                                    <div className='ml-2 font-bold'>Deadline: {data2.deadline}</div>
                                                                                                    <div className='ml-2 font-bold'>Notifcation:{data2.notification.notify_month ? `${data2.notification.notify_month}/${data2.notification.notify_day} at ${data2.notification.notify_hour}:${data2.notification.notify_minute.toString().padStart(2,'0')}`: " Empty"}</div>
                                                                                                    <div className='ml-2 text-red-700'>Countdown: ({calculateDaysLeft(data2.deadline)} days left)</div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div style={{ backgroundColor: `${data2.color}`, color: `${data2.textcolor}` }} className='text-center m-2 p-1 rounded-xl'>{data2.description ? data2.description : "No description"}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                                }                                                                        
                                                                            </>
                                                                        ):(
                                                                            <>
                                                                                {data.finished_task
                                                                                    .sort((a, b) => {
                                                                                        const daysLeftA = calculateDaysLeft(a.deadline);
                                                                                        const daysLeftB = calculateDaysLeft(b.deadline);
                                                                                        return daysLeftA - daysLeftB; // Sort in ascending order
                                                                                    })
                                                                                    //finished task
                                                                                    .map((data2) => (
                                                                                        <React.Fragment key={data2._id}> 
                                                                                            <div className='grid grid-cols-2'>
                                                                                                <div className='border-r-[1px] pb-3'>
                                                                                                    <div className='flex items-center'>
                                                                                                        <div style={{ backgroundColor: `${data2.color}`, color: `${data2.textcolor}` }} className={`text-center m-2 p-1 rounded-xl md:text-base text-sm font-bold`}>
                                                                                                            {data2.name}
                                                                                                            {`(${data2.timestart.split(':')[0]}${data2.timestart.split(':')[1] ? ':' + data2.timestart.split(':')[1].toString().padStart(2, '0') : ''} - ${data2.timeend.split(':')[0]}${data2.timeend.split(':')[1] ? ':' + data2.timeend.split(':')[1].toString().padStart(2, '0') : ''})`}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='ml-2 font-bold'>Deadline: {data2.deadline}</div>
                                                                                                    <div className='ml-2 text-red-700'>Date: {data2.date}</div>
                                                                                                    {
                                                                                                        deletefinishedtask == data2._id ? (
                                                                                                            <>
                                                                                                                <div className='flex gap-4 ml-2 mt-4'>
                                                                                                                    <button onClick={() => setdeletefinishedtask("")} className='p-2 rounded-lg bg-red-900 text-sm'>Cancel</button>
                                                                                                                    <button className='p-2 rounded-lg bg-green-900 text-sm' onClick={()=>{deleteFinishedTask()}}>{deletingfinishedtask ? "Deleting":"Confirm"}</button>
                                                                                                                </div>                    
                                                                                                            </>
                                                                                                        ):(
                                                                                                            <>
                                                                                                                <div className='ml-2 w-fit h-fit p-2 bg-red-800 mt-4 rounded-lg cursor-pointer' onClick={()=>setdeletefinishedtask(data2._id)}>
                                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                                                                    </svg>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        )
                                                                                                    }
                                                                                    
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div style={{ backgroundColor: `${data2.color}`, color: `${data2.textcolor}` }} className='text-center m-2 p-1 rounded-xl'>{data2.description ? data2.description : "No description"}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                                }                                                            
                                                                            </>
                                                                        )
                                                                    }
                                                                </>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            
                            </div>
                        </div>
                    </div>                
                </div>
            </div>
        </>
    )
}