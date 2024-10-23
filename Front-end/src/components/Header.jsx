import React, { useState, useEffect,useContext } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images';

export const Header = ()=>{
    const navigate = useNavigate();
    const {login,setlogin} = useContext(Usercontext);
    const {loggedusername,setloggedusername} = useContext(Usercontext);
    const {active, setActive} = useContext(Usercontext);
    const handleToggle = (type) => {
        setActive(type); // Toggle active state between 'login' and 'signup'
      };
    
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
      
    //   clearAllCookies();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='fixed w-full lg:text-lg flex justify-center flex-wrap text-sm z-10'>
            <>
                <div className='px-5 py-2 flex gap-[4vw] items-center font-bold mt-3 rounded-full bg-customdark font-roboto flex-wrap'>
                    <div className={`rounded-lg p-2 hover:border-b-[3px] hover:cursor-pointer text-gray-200 ${active === "main" ? "border-b-[3px] border-gray-200 border-opacity-60" : ""}`} onClick={()=> {navigate("/");handleToggle("main")}}>
                        Home
                    </div>
                    <div className={`rounded-lg p-2 hover:border-b-[3px] hover:cursor-pointer text-gray-200 lg:block hidden ${active === "about" ? "border-b-[3px] border-gray-200 border-opacity-60" : ""}`}onClick={()=> {navigate("/");handleToggle("about")}} >About</div>
                    <div className={`rounded-lg p-2 hover:border-b-[3px] lg:block hidden hover:cursor-pointer text-gray-200 ${active === "rank" ? "border-b-[3px] border-gray-200 border-opacity-60" : ""}`}onClick={()=> {navigate("/");handleToggle("rank")}}>Music</div>
                    {
                        login ? (
                            <>
                                <div className='flex gap-4'>
                                    <div className='relative'>
                                        <div className='flex flex-wrap border-[1px] border-gray-200 bg-gray-200 bg-opacity-30 border-opacity-40 items-center py-2 px-4 gap-3 rounded-full hover:cursor-pointer hover:bg-opacity-40 relative z-10' onClick={()=>{setIsOpen(!isOpen)}}>
                                            <div className='text-gray-200 rounded-full'>Category</div>
                                            <img src={images.arrowdown} className='size-7' alt="" />                               
                                        </div>
                                        <div className="relative">
                                            <div 
                                                className={`absolute top-1 p-2 left-0 bg-gray text-white  transform transition-all duration-500 ease-in-out w-full bg-customgray rounded-lg ${
                                                    isOpen ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-[-20px]'
                                                } overflow-hidden`} 
                                            >
                                                <ul className=''>
                                                    <div className='text-gray-200 p-2 hover:border-b-[1px] cursor-pointer' onClick={()=>{navigate("/dashboard/plan");setActive("");setIsOpen(false)}}>Plan</div>
                                                    <div className='text-gray-200 p-2 hover:border-b-[1px] cursor-pointer'>Profile</div>
                                                    {/* <div className='text-gray-200 p-2 hover:border-b-[1px] cursor-pointer'>Shop</div> */}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <button className='text-red-500 p-2 hover:bg-red-500 hover:text-black rounded-lg' onClick={() => {clearAllCookies();navigate("/");setlogin(false);setloggedusername("");setActive("");window.location.reload();}}>Logout</button>
                                </div>
                            </>
                        ):(
                            <>
                                <div className="relative w-[13rem] bg-gray-800 rounded-lg flex items-center">
                                    {/* Sliding background */}
                                    <div
                                    className={`absolute top-0 left-0 w-1/2 h-full bg-blue-500 rounded-lg transition duration-500 ease-in-out 
                                    ${active === 'signup' ? 'translate-x-full' :(active === 'main' || active === 'rank' || active === 'about') ? " hidden" :'translate-x-0'}`}
                                    ></div>

                                    {/* Login Button */}
                                    <button
                                    className={`relative z-10 w-1/2 h-full text-white font-bold transition p-2 duration-500 
                                    ${active === 'login' ? 'text-white' : (active === 'main' || active === 'rank' || active === 'about') ? "text-gray-400 opacity-75 hover:bg-blue-500 rounded-lg" : 'text-gray-500 opacity-70'}`}
                                    onClick={() => {handleToggle('login');navigate("/login")}}
                                    >
                                    Login
                                    </button>

                                    {/* Sign Up Button */}
                                    <button
                                    className={`relative z-10 w-1/2 h-full text-white font-bold transition duration-500 p-2 
                                    ${active === 'signup' ? 'text-white' : active ==="main" ? "text-gray-400 opacity-75 hover:bg-blue-500 rounded-lg" : 'text-gray-500 opacity-70'}`}
                                    onClick={() => {handleToggle('signup');navigate("/register")}}
                                    >
                                    Sign Up
                                    </button>
                                </div>       
                            </>
                        )
                    }
                </div>
            </>
        </div>
    )
}