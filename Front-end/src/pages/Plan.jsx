import React, { useState, useContext } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Plan = () => {
  const { loggedusername, open, plan, setdeleteresult, createresult, setcreateresult, loadingplan, date, years, months } = useContext(Usercontext);
  const [newplan, setnewplan] = useState("");


  const navigate = useNavigate(); // If you need to navigate after login

  const [createloading, setcreateloading] = useState(false);



  const currenttime = `${years}-${months + 1}-${date}`
  // console.log(`currenttime : ${currenttime}`)

  function calculateDaysBetweenDates(timeBegin, deadline) {

    // console.log(timeBegin)
    // console.log(deadline)
    const startDate = new Date(timeBegin);
    const endDate = new Date(deadline);
    // console.log(startDate)
    // console.log(endDate)



    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    // console.log(differenceInDays)

    return differenceInDays;
  }
  const createnewplan = async (req, res) => {
    try {
      setcreateloading(true);
      if (!newplan) {
        throw new Error("Please provide a name for your plan!");
      }
      const response = await fetch("http://localhost:3000/add-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedusername, name: newplan, timebegin: `${years}-${months + 1}-${date}` })
      })
      const data = await response.json();
      setcreateresult(data);
      setcreateloading(false);
    } catch (error) {
      setcreateloading(false);
      console.log(error);
      setcreateresult(error.message)
    }
  }




  const [deleteing, setdeleteing] = useState(false);

  const [Delete, setDelete] = useState("");
  const deleteplan = async (req, res) => {
    try {
      setdeleteing(true);
      const response = await fetch("http://localhost:3000/delete-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedusername, planId: Delete })
      })

      const data = await response.json();
      setdeleteresult(data);
      setdeleteing(false);
      setDelete("");
    } catch (error) {
      setdeleteing(false);
      console.log(error);
      setdeleteresult(error.message)
    }
  }

  return (
    <div className='w-full h-screen overflow-auto bg-customgray relative'>
      <div className={`${open ? "max-w-7xl ml-auto" : "max-w-7xl m-auto"} pt-[8rem]`}>
        <div className='w-full overflow-auto h-[37rem] bg-customdark text-gray-200 rounded-3xl font-roboto'>
          <>
            <div className=' pl-5 font-roboto font-bold text-3xl py-4 text-center'>Your Plan</div>
            <div className='flex gap-3 border-b pb-5 pl-5 flex-col'>
              <div className='flex gap-4 w-fit'>
                <input type="text" placeholder="Add new plan" className='w-full rounded-lg border-2 p-2 text-black' value={newplan} onChange={(e) => setnewplan(e.target.value)} />
                <button className='rounded-lg p-2 border-[1px] hover:bg-gray-500' onClick={createnewplan} disabled={createloading}>{createloading ? "ADDING..." : "ADD"}</button>
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
                  ) : plan ? (
                    <>
                      {
                        plan.map((data) => (
                          <tr key={data._id}>
                            <th className=' p-4'>{data.name}</th>
                            <th className=' p-4'>{data.progress} {data.progress === null ? "0 task done" : data.progress === 1 ? "task done" : "tasks done"} </th>
                            <th className=' p-4'>{calculateDaysBetweenDates(data.timebegin, currenttime)} {calculateDaysBetweenDates(data.timebegin, currenttime) === 0 ? "day" : calculateDaysBetweenDates(currenttime, data.timebegin) === 1 ? "day" : "days"}</th>
                            <th>
                              {
                                Delete == data._id ? (
                                  <div className='flex gap-4 justify-center'>
                                    <button onClick={() => setDelete("")} className='p-2 rounded-lg bg-red-900 text-sm'>Cancel</button>
                                    <button className='p-2 rounded-lg bg-green-900 text-sm' disabled={deleteing} onClick={deleteplan}>Confirm</button>
                                  </div>
                                ) : (
                                  <>
                                    <button className='p-1 bg-gray-700 rounded-lg hover:bg-gray-500' onClick={() => setDelete(data._id)}>
                                      <img src={images.trashcan} className='size-8' alt="" />
                                    </button>
                                  </>)
                              }
                            </th>
                          </tr>
                        ))
                      }
                    </>
                  ) : (
                    <></>
                  )
                }
              </tbody>
            </table>
          </>
        </div>
      </div>
      {/* rollover3 */}
    </div>
  );
};
