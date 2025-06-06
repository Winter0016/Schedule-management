import React, { useState, useContext, useEffect } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images'; // Assuming 'images.island' is a valid image path
import axios from 'axios';

export const Sidebar = () => {

  const { loggedusername, open, setopen,setlogin,setloggedusername,profilepicture,setprofilepicture } = useContext(Usercontext)
  const navigate = useNavigate();
  const clearAllCookies = () => {
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        const cookieName = cookie.split('=')[0].trim(); // Get the cookie name
    
        // Remove the cookie for both the root path and any subpaths
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    }
    
    // Optionally, reload the page to ensure all changes are reflected
    localStorage.clear();
    
    console.log('All cookies have been cleared.');
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
  
      // Preview
      setprofilepicture(base64Image);
  
      // Send to backend
      try {
        await fetch("http://localhost:3000/auth/change-profile-picture", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pictureData: base64Image,
            username: loggedusername
          }),
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
  
    reader.readAsDataURL(file); // This converts it to base64
  };
  
  return (
    <>
      <img src={images.sidebar} className={`size-[3.5rem] absolute left-4 top-4 cursor-pointer z-40 transition-all duration-700 ${open === false ? "block" : "hidden"}`} alt="" onClick={() => setopen(true)} />
      <div className={` absolute left-0 top-0 h-screen font-roboto text-gray-300 bg-customdark transition-all duration-700 ease-in-out border-r-[1px] border-gray-700 ${open ? 'w-[12rem] opacity-100 z-30' : '-z-30 w-[4rem] opacity-0'}`}>
        <img src={images.closesidebar} className='size-[2rem] absolute top-5 right-5 bg-gray-400 cursor-pointer rounded-lg' onClick={() => setopen(false)} alt="" />
        <div className='border-b-[1px] border-gray-700 pb-10 pt-14 flex flex-col w-full gap-1 items-center'>
          <label className="cursor-pointer">
            <img
              src={profilepicture}
              className='size-[5rem] rounded-full object-cover'
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <div className=' w-full text-center mt-2'>{loggedusername}</div>
        </div>
        <div className='mt-7 flex flex-col gap-7'>
          <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={() => navigate("plan")}>Plan</div>
          <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={() => navigate("schedule")}>Daily Schedule</div>
          <div className='cursor-pointer hover:bg-gray-700 p-3' onClick={() => navigate("mytask")}>Task</div>
          <div className='p-2'>
            <div className='w-fit bg-gray-800 rounded-lg flex items-center text-lg'>
              <button className='text-white p-2 hover:bg-red-500 hover:text-black rounded-lg' onClick={() => {clearAllCookies();navigate("/");setlogin(false);setloggedusername("");window.location.reload();}}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}