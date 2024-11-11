
import React, { useState, useContext} from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Mytask = () =>{
    const { loggedusername, plan,selectedOption,getplan,monthName,setSelectedOption, date, years, days, open,setaddtask,addtask } = useContext(Usercontext);    
      const [checkedarray,setcheckedarray] = useState([]);
      const [updatingcheckedarray,setupdatingcheckedarray] = useState(false);
    
      // if(checkedarray){
      //   console.log(checkedarray);
      //   console.log(checkedarray.length);
      // }
    
      // rollover2
      const [acname, setacname] = useState('');
      const [descriptionac, setdescriptionac] = useState('');
      const [addloadingac, setaddloadingac] = useState(false);
      const [deletingac, setdeletingac] = useState(false);
      const [choosecolor, setchoosecolor] = useState("#3399ff");
      const [textcolor, choosetextcolor] = useState("#e5e7eb");
      const [modify, setmodify] = useState(false);
      const [modifyacname, setmodifyacname] = useState();
      const [dailyid, setdailyid] = useState();
      const [activeid, setactiveid] = useState();
      const [important, setimportant] = useState(false);
  
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

    return(
        <>
            <div className='w-screen h-screen overflow-auto bg-customgray relative'>
                {addtask && (
                    <>
                        <div className='absolute w-full h-full bg-customblue2 bg-opacity-20 flex flex-wrap justify-center items-center z-50'>
                        <div className='w-fit md:w-[30rem] m-auto p-5 rounded-3xl bg-customdark overflow-auto relative'>
                            <img src={images.closecross} className='size-12 absolute top-4 right-5 cursor-pointer' onClick={() => { setaddtask(false)}} alt="" />
                            <div className='text-center break-words text-customblue text-2xl'>TASK</div>
                            <form>
                            <div className={`text-base text-gray-400 mt-3`}>{modify ? "Current Title" : "Title"}</div>
                            <input readOnly={modify ? true: false} type="text" className={`rounded-lg p-2 bg-customblue2 w-2/3 mt-3 text-gray-200`} />
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
                            <div className='mt-3 text-base text-gray-400'>Choose Background Color</div>
                            <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={choosecolor} onChange={(e) => setchoosecolor(e.target.value)} />
                            <div className='mt-3 text-base text-gray-400'>Choose Text Color</div>
                            <input required className='w-2/3 mt-3 rounded-lg bg-customdark h-[2rem]' type="color" value={textcolor} onChange={(e) => choosetextcolor(e.target.value)} />
                            <div className='text-base text-gray-400 mt-3'>Description</div>
                            <textarea placeholder="Enter your description here(Optional)" className='bg-customblue2 text-gray-200 p-2 mt-3 rounded-md w-5/6 h-[6rem]'></textarea>
                            <div className='flex mt-5 justify-between'>
                                <button type='submit' className='px-[5rem] py-2 text-customblue border-[1px] border-customblue w-fit h-fit rounded-3xl hover:bg-customgray' disabled={addloadingac}>{modify ? "Update" : "Add"}</button>
                                {modify && (
                                <>
                                    <button type='button' className='px-[3rem] py-2 text-red-700 border-[1px] border-red-700 w-fit h-fit rounded-3xl hover:bg-red-500' disabled={deletingac}>{deletingac ? "Deleting" : "Delete"}</button>
                                </>
                                )}
                            </div>
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
                                        <React.Fragment key={data._id}>
                                        {data.name == selectedOption &&(
                                            <>
                                                {data.todaytask.map((data2) => (
                                                    <React.Fragment key={data2._id}>
                                                    {
                                                        data2.task.map((data3) =>(
                                                        <React.Fragment key={data3._id}>
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
                        
                        <div className='border-[1px] border-gray-500 max-h-[30rem] overflow-auto p-2 rounded-2xl break-words'>
                            <div className=' relative'>
                                <button className='absolute left-3 rounded-xl px-8 py-1 bg-custompurple hover:bg-opacity-70' onClick={()=>setaddtask(!addtask)}>ADD</button>
                                <div className='text-2xl font-bold text-center my-1'>TASK</div>
                            </div>
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
                </div>
            </div>
        </>
    )
}