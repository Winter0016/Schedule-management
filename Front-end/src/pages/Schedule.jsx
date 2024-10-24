// Front-end/src/pages/Schedule.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Schedule = () => {
    const { loggedusername, plan, deleteac, setdeleteac, addacresult, setaddacresult, date, years, months, days, open,addtask,setaddtask,reversetranslateDay } = useContext(Usercontext);

    function translateMonth() {
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
            default: return "Invalid month number"; // In case the number is not between 1 and 12
        }
    }

    const monthName = translateMonth(); // Returns "May"

    function translateDay(dayNumber) {
        switch (dayNumber) {
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            case 7: return "Sunday";
            default: return "Invalid day number"; // In case the input is not between 1 and 7
        }
    }



    useEffect(() => {
        getdays();
    }, []);

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

    const [selectedOption, setSelectedOption] = useState('');
    const [acname, setacname] = useState();
    const [descriptionac, setdescriptionac] = useState();
    const [addloadingac, setaddloadingac] = useState(false);
    const [deletingac, setdeletingac] = useState(false);
    const [choosecolor, setchoosecolor] = useState("#3399ff");
    const [textcolor, choosetextcolor] = useState("#e5e7eb");
    const [modify, setmodify] = useState(false);
    const [modifyacname, setmodifyacname] = useState();
    const [dailyid, setdailyid] = useState();
    const [activeid, setactiveid] = useState();
    const [important, setimportant] = useState(false);

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
            if (modify) {
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

    const clearacresult = () => {
        setaddacresult("");
    }

    if (addacresult) {
        const mytimeout = setTimeout(clearacresult, 2000);
    }

    const deleteactivity = async () => {
        try {
            setdeletingac(true);
            const response = await fetch("http://localhost:3000/delete-activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loggedusername,
                    planname: selectedOption,
                    dailyId: dailyid,
                    activityId: activeid,
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
            const response = await fetch("http://localhost:3000/days", {
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

    useEffect(() => {
        getdays();
    }, []);

    const [Days, setDays] = useState();
    const [Months, setMonths] = useState();
    const [Endmonth, setEndmonth] = useState();

    useEffect(() => {
        if (Months) {
            const endmonth = Months.find((key) => key.month === months - 1).end;
            setEndmonth(endmonth);
        }
    }, [Months]);

    return (
        <div className='w-screen h-screen overflow-auto bg-customgray relative'>
          <div className={`${open ? "max-w-7xl ml-auto" : "max-w-7xl m-auto"} pt-[8rem]`}>
            {addtask && (
              <>
                  <div className='absolute w-full h-full bg-customblue2 bg-opacity-20 flex flex-wrap justify-center items-center z-50'>
                    <div className='w-fit md:w-[30rem] m-auto p-5 rounded-3xl bg-customdark overflow-auto relative'>
                      <img src={images.closecross} className='size-12 absolute top-4 right-5 cursor-pointer' onClick={() => { setaddtask(""); setmodify(false); setaddacresult(""); setdailyid(""); setactiveid(""); setmodifyacname(""); setdeleteac("") }} alt="" />
                      <div className='text-center break-words text-customblue text-2xl'>{addtask}'s Schedule</div>
                      <form onSubmit={addactivity}>
                        <div className={`text-base text-gray-400 mt-3`}>{modify ? "Current Title" : "Title"}</div>
                        <input required readOnly={modify ? true : false} type="text" className={`rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200`} value={acname} onChange={(e) => setacname(e.target.value)} />
                        {modify && (
                          <>
                            <div className='text-base text-gray-400 mt-3'>Change Title (Optional)</div>
                            <input type="text" className='rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200' value={modifyacname} onChange={(e) => setmodifyacname(e.target.value)} />
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
                        <div className='flex flex-wrap gap-2 mt-3 items-center'>
                          <div className={`text-lg text-red-700 text-bold underline`}>IMPORTANT</div>
                          <input className='size-7' type="checkbox" checked={important} onChange={(e) => setimportant(e.target.checked)} />
                        </div>
                        <div className='mt-3 text-base text-gray-400'>Choose Background Color</div>
                        <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={choosecolor} onChange={(e) => setchoosecolor(e.target.value)} />
                        <div className='mt-3 text-base text-gray-400'>Choose Text Color</div>
                        <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={textcolor} onChange={(e) => choosetextcolor(e.target.value)} />
                        <div className='text-base text-gray-400 mt-3'>Description</div>
                        <textarea placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-5/6 h-[6rem]' value={descriptionac} onChange={(e) => setdescriptionac(e.target.value)}></textarea>
                        <div className='flex mt-5 justify-between'>
                          <button type='submit' className='px-[5rem] py-2 text-customblue border-[1px] border-customblue w-fit h-fit rounded-3xl hover:bg-customgray' disabled={addloadingac}>{modify ? "Update" : "Add"}</button>
                          {modify && (
                            <>
                              <button onClick={deleteactivity} type='button' className='px-[3rem] py-2 text-red-700 border-[1px] border-red-700 w-fit h-fit rounded-3xl hover:bg-red-500' disabled={deletingac}>{deletingac ? "Deleting" : "Delete"}</button>
                            </>
                          )}
                        </div>
                        {addacresult && (<div className='text-custompurple mt-2'>{addacresult}</div>)}
                        {deleteac && (<div className='text-red-800 mt-2'>{deleteac}</div>)}
                      </form>
                    </div>
                  </div>
                </>
            )}
            <div className='w-full bg-customdark rounded-3xl font-roboto text-gray-200 p-2 h-[37rem] overflow-auto'>
              <div className='px-5 py-2 my-2 flex flex-wrap gap-2 items-center'>
                <div className='p-2 rounded-xl bg-custompurple'>Today</div>
                <div>{monthName} {date}, {years}</div>
                {plan && (
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
                )}
              </div>
              {Days && Months && Endmonth ? (
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
              ) : (
                  <></>
              )}
            </div>
          </div>
        </div>
    );
}