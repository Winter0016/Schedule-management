
import React, { useState, useContext,useEffect} from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Mytask = () =>{
    const { loggedusername, plan,selectedOption,monthName,setSelectedOption,days, date, years, months, open,setaddtask,addtask,updatetaskresult,setupdatetaskresult,loadingplan,setupdatecheckedarrayresult,selectedMonth,selectedDate,setSelectedDate,setSelectedMonth,setPreviousMonth,setPreviousDate,modifyupdatetask, setmodifyupdatetask,modifyacnametask, setmodifyacnametask,setdeletefinishedtaskResult} = useContext(Usercontext);    
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
            const response = await axios.post("http://localhost:3000/update-checkedarray", {
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
        setSelectedMonth(parseInt(e.target.value));
        setSelectedDate(null); // Reset date when month changes
    };
    
    const handleDateChange = (e) => {
        setSelectedDate(parseInt(e.target.value));
    };
    
    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!/^\d*$/.test(value)) return; // Only allow numbers
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
        if (!/^\d*$/.test(value)) return; // Only allow numbers
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
          // rollover2
    const updatetask = async(e)=>{
        e.preventDefault();
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
            if (timeStart.hours.toString().length === 1) {
                timeStart.hours = "0" + timeStart.hours.toString();
            }
            if (timeStart.minutes.toString().length === 1) {
                timeStart.minutes = "0" + timeStart.minutes.toString();
            }
            if (timeEnd.hours.toString().length === 1) {
                timeEnd.hours = "0" + timeEnd.hours.toString();
            }
            if (timeEnd.minutes.toString().length === 1) {
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

            setupdatingtask(true);
            const response = await axios.post("http://localhost:3000/update-task",{
                username: loggedusername,
                planname: selectedOption,
                nameac: acname,
                acdescription: descriptionac,
                color: choosecolor,
                textcolor: textcolor,
                timestart: `${timeStart.hours}:${timeStart.minutes}`,
                timeend: `${timeEnd.hours}:${timeEnd.minutes}`,
                deadline: `${selectedMonth}/${selectedDate}`,
                modifyacname: modifyacnametask
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
            const response = await fetch("http://localhost:3000/delete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loggedusername,
                    planname: selectedOption,
                    mytaskid:mytaskid,
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
            const response = await axios.post("http://localhost:3000/deletefinishedtask",{
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
        setaddtask(false);setupdatetaskresult("");setmodifyupdatetask(false);setmodifyacnametask("");setSelectedMonth("");setSelectedDate("");setPreviousDate("");setPreviousMonth("");
    }
    return(
        <>
            <div className='w-full h-screen overflow-auto bg-customgray relative'>
                {addtask && (
                    <>
                        <div className='absolute w-full h-screen bg-customblue2 bg-opacity-20 flex flex-wrap justify-center items-center z-50'>
                            <div className='w-fit md:w-[30rem] m-auto p-5 rounded-3xl bg-customdark relative max-h-[44rem] overflow-auto hide-scrollbar'>
                                <img src={images.closecross} className='size-12 absolute top-4 right-5 cursor-pointer' onClick={() => closefunction()} alt="" />
                                <div className='text-center break-words text-customblue text-2xl'>TASK</div>
                                <form onSubmit={updatetask}>
                                    <div className={`text-base text-gray-400 mt-3`}>{modifyupdatetask ? "Current Title" : "Title"}</div>
                                    <input required value={acname} onChange={(e)=>setacname(e.target.value)} readOnly={modifyupdatetask ? true: false} type="text" className={`rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200`} />
                                    {modifyupdatetask && (
                                        <>
                                        <div className='text-base text-gray-400 mt-3'>Change Title (Optional)</div>
                                        <input type="text" className='rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200' value={modifyacnametask} onChange={(e) => setmodifyacnametask(e.target.value)} />
                                        </>
                                    )}
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
                                    <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={choosecolor} onChange={(e) => setchoosecolor(e.target.value)} />
                                    <div className='mt-3 text-base text-gray-400' value={textcolor} onChange={(e)=>choosetextcolor(e.target.value)}>Choose Text Color</div>
                                    <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={textcolor} onChange={(e) => choosetextcolor(e.target.value)} />
                                    <div className='text-base text-gray-400 mt-3' >Description</div>
                                    <textarea value={descriptionac} onChange={(e)=> setdescriptionac(e.target.value)} placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-5/6 h-[6rem]'></textarea>
                                    <div className='flex mt-5 justify-between'>
                                        <button type='submit' className='px-[5rem] py-2 text-customblue border-[1px] border-customblue w-fit h-fit rounded-3xl hover:bg-customgray' disabled={updatingtask}>{modifyupdatetask ? "Update" : updatingtask ? "Updating..." : "Add"}</button>
                                        {modifyupdatetask && (
                                        <>
                                            <button onClick={deletetask} type='button' className='px-[3rem] py-2 text-red-700 border-[1px] border-red-700 w-fit h-fit rounded-3xl hover:bg-red-500' disabled={deletingac}>{deletingac ? "Deleting" : "Delete"}</button>
                                        </>
                                        )}
                                    </div>
                                    {updatetaskresult && (<div className='text-custompurple mt-2'>{updatetaskresult}</div>)}
                                </form>
                            </div>
                        </div>
                    </>
                )}
                <div className={`${open ? "max-w-7xl ml-auto" : "max-w-7xl m-auto"} pt-[8rem]`}>
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
                                                                                    <div style={{backgroundColor: `${data3.color}`, color: `${data3.textcolor}`}} className={`text-center m-2 p-1 rounded-xl md:text-base text-sm flex items-center gap-1 ${data3.important ? "font-bold underline-offset-4 underline" : ""} ${data3.status ? "line-through" : ""}`}>{data3.name}{data3.timestart !== ':' && data3.timeend !== ':' &&`(${data3.timestart}-${data3.timeend})`}
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
                                                                                                            setSelectedMonth(data2.deadline.split("/")[0]);
                                                                                                            setSelectedDate(data2.deadline.split("/")[1]);
                                                                                                            setPreviousDate(data2.deadline.split("/")[1]);
                                                                                                            setPreviousMonth(data2.deadline.split("/")[0]);
                                                                                                            setmytaskid(data2._id);
                                                                                                        }}>
                                                                                                            {data2.name}
                                                                                                            {((data2.timestart !== ':') && (data2.timeend !== ':')) && `(${data2.timestart}-${data2.timeend})`}
                                                                                                        </div>
                                                                                                        
                                                                                                    </div>
                                                                                                    <div className='ml-2 font-bold'>Deadline: {data2.deadline}</div>
                                                                                                    <div className='ml-2 text-red-700'>Countdown: ({calculateDaysLeft(data2.deadline)} days left)</div>
                                                                                                    <div className='ml-2 text-green-700'>Progress: </div>
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
                                                                                    .map((data2) => (
                                                                                        <React.Fragment key={data2._id}>
                                                                                            <div className='grid grid-cols-2'>
                                                                                                <div className='border-r-[1px] pb-3'>
                                                                                                    <div className='flex items-center'>
                                                                                                        <div style={{ backgroundColor: `${data2.color}`, color: `${data2.textcolor}` }} className={`text-center m-2 p-1 rounded-xl md:text-base text-sm font-bold`}>
                                                                                                            {data2.name}
                                                                                                            {((data2.timestart !== ':') && (data2.timeend !== ':')) && `(${data2.timestart}-${data2.timeend})`}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='ml-2 font-bold'>Deadline: {data2.deadline}</div>
                                                                                                    <div className='ml-2 text-red-700'>Date: {data2.date}</div>
                                                                                                    <div className='ml-2 text-green-700'>Progress: </div>
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