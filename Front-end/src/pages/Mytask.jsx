
import React, { useState, useContext} from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Mytask = () =>{
    const { loggedusername, plan,selectedOption,getplan,monthName,setSelectedOption, date, years, days, open } = useContext(Usercontext);    
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
    return(
        <>
            <div className='w-screen h-screen overflow-auto bg-customgray relative'>
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
                </div>
            </div>
        </>
    )
}