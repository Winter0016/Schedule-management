import React, { useState, useContext,useEffect } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import images from '../images';

export const Resetpassword = () =>{
    const [searchParams] = useSearchParams();
    const Token = searchParams.get('token'); // Get the token from URL

    const [newPassword, setNewPassword] = useState('');
    const [showpassword,setshowpassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading,setloading] = useState(false);
    const [result,setresult] = useState("");
    const [user,setuser] = useState("");

    useEffect(() =>{
        const checktoken = async() =>{
            // console.log("Checking Token")
            try{
                if(!Token){
                    throw new Error("No token found!");
                }
                setloading(true);
                const response = await fetch('http://localhost:3000/verify-token',{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({token : Token}),
                    credentials: "include"
                })
                const data = await response.json();
                console.log(data);
                setresult(data.message);
                setuser(data.username);
                setloading(false);
            }catch(error){
                console.log(error);
                setresult(error.message)
                setloading(false);
            }
        }
        checktoken();
    },[Token])

    const [changing,setchanging] = useState(false);
    const [changeresult,setchangeresult] = useState("");

    const Changepassword = async(e) =>{
        e.preventDefault();       
        try{
            if(newPassword !== confirmPassword){
                throw new Error("Password is incorrect!")
            }
            setchanging(true);
            const response = await fetch("http://localhost:3000/change-password",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({password:newPassword,username:user}),
                credentials:"include",
            })

            const data = await response.json();
            setchangeresult(data);
            setchanging(false);
        }catch(error){
            console.log(error);
            setchangeresult(error.message);
            setchanging(false);
        }
    }

    const backgroundStyle = {
        backgroundImage: `url(${images.island})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        overflow: 'auto',
    };

    return (
        <>
            {
                result === "Token is valid" ? (
                    <>
                        <div style={backgroundStyle}>
                            <div className='max-w-lg mx-auto pt-[8rem] mb-[2rem]'>
                                <div
                                    style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                                    className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                                >
                                    <div className="p-8">
                                        <h2 className="text-center text-3xl font-extrabold text-white">Change Password for {user}</h2>
                                        <form method="POST" className="mt-8 space-y-6" onSubmit={Changepassword}>
                                            <div className="rounded-md shadow-sm">
                                                <div className='relative'>
                                                    <label className="sr-only" htmlFor="new password">New Password</label>
                                                    <input
                                                        placeholder="New Password"
                                                        className="appearance-none relative block min-w-full pl-3 pr-[4rem] py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                        required
                                                        type={showpassword ? "text" : "password"}
                                                        name="new password"
                                                        id="new password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)} // Update username state
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={()=> {setshowpassword(!showpassword)}}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400"
                                                    >
                                                        {showpassword ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                                <div className='mt-4'>
                                                    <label className="sr-only" htmlFor="confirm password">Confirm password</label>
                                                    <input
                                                        placeholder="Confirm Password"
                                                        className="appearance-none relative block min-w-full pl-3 pr-[4rem] py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                        required
                                                        type="password"
                                                        name="confirm password"
                                                        id="confirm-password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)} // Update username state
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    type="submit"
                                                >
                                                    Change password
                                                </button>
                                            </div>
                                            {
                                                changeresult ? (
                                                    <>
                                                        <div className='text-red text-center text-green-500 font-bold text-lg'>{changeresult}</div>
                                                    </>
                                                ):(
                                                    <></>
                                                )
                                            }
                                        </form>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </>
                ):(
                    <>
                        <div style={backgroundStyle}>
                            <div className='max-w-lg mx-auto pt-[8rem] mb-[2rem]'>
                                <h1 className='text-red-500 text-center text-5xl'>{result}</h1>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}