import React, { useState, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Sidebar = () =>{

    const {loggedusername,usernamerole,open,setopen} = useContext(Usercontext)
    const navigate = useNavigate();
    return (
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
              <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={()=> navigate("plan")}>Plan</div>
              <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={()=> navigate("schedule")}>Daily Schedule</div>
              <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={()=>navigate("mytask")}>My Task</div>
              <div className='cursor-pointer hover:bg-gray-700 p-3'>Finished Task</div>
              <div className='cursor-pointer hover:bg-gray-700 p-3'>Music List</div>
          </div>
        </div>
        <Outlet/>
      </>
    )
}