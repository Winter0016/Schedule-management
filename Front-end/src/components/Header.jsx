import React, { useState, useEffect,useContext,useRef } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import images from '../images';

export const Header = ()=>{
    const navigate = useNavigate();
    const {login,setlogin} = useContext(Usercontext);
    const {loggedusername,setloggedusername} = useContext(Usercontext);
    const {active, setActive,selectedOption,setaddacresult,setupdatetaskresult} = useContext(Usercontext);
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
    const [speechtotextresult,setspeechtotextresult] = useState("");

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'received.wav'); // Append the audio blob to the form data
        try {
            const response = await fetch('https://localhost/voice-receive', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                console.log('Audio file sent successfully.');
            } else {
                console.error('Error sending audio file:', response.statusText);
            }
            const data = await response.json();
            console.log(data);
            setspeechtotextresult(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioBlob, setAudioBlob] = useState(null); // State to store the recorded audio blob
    const [turnonmic, setturnonmic] = useState(false);

        const addactivity2 = async (name,description,day,bgcolor,textcolor,timestart,timeend,modifyacname) => {
            console.log("calling addactivity 2");            
            if(timeend ==""){
                timeend= ":"
            }
            if(timestart==""){
                timestart=":"
            }
    
            try {
              // Send the updated time fields in the request
              const response = await fetch("https://localhost/add-daily", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: loggedusername,
                  planname: selectedOption,
                  day: parseInt(day),
                  nameac: name,
                  acdescription: description,
                  color: bgcolor,
                  textcolor: textcolor,
                  modifyacname: modifyacname,
                  timestart: timestart,
                  timeend: timeend,
                  important: true,
                }),
              });
        
              const data = await response.json();
              setaddacresult(data);
            } catch (error) {
              setaddacresult(error.message);
              console.log(error);
            }
        };
    
        const updatetask2 = async(name,description,bgcolor,textcolor,timestart,timeend,modifyacnametask,deadline)=>{
            if(timestart == ""){
                timestart = ":"
            }
            if(timeend == ""){
                timeend = ":"
            }
            try {
                const response = await axios.post("https://localhost/update-task",{
                    username: loggedusername,
                    planname: selectedOption,
                    nameac: name,
                    acdescription: description,
                    color: bgcolor,
                    textcolor: textcolor,
                    timestart: timestart,
                    timeend: timeend,
                    deadline: `${deadline.split("/")[1]}/${deadline.split("/")[0]}`,
                    modifyacname: modifyacnametask
                })
                const data = response.data;
                setupdatetaskresult(data);
            }catch(error){
                console.log("error :",error);
                setupdatetaskresult(error.message);
            }
        }
    const [aithinking,setaithinking] = useState(false);
    const handleSendMessage = async (text) => {
        if (text) {
            
            try {
                setaithinking(true);
                const response = await axios.post('https://localhost/ask', {
                    username: loggedusername,
                    planname: selectedOption,
                    question: text,
                });
                const data = response.data;
                console.log(data);
                if(data.purpose == "make-schedule"){
                    await addactivity2(data.content,data.description,data.day,"#3399ff","#e5e7eb",data.timestart,data.timeend,"");
                }else if(data.purpose == "make-task"){
                    await updatetask2(data.content,data.description,"#3399ff","#e5e7eb",data.timestart,data.timeend,"",data.deadline);
                }
    
            } catch (error) {
                console.error(error);
            } finally {
                setaithinking(false);
                setspeechtotextresult("");
            }
        }
    };
    useEffect(()=>{
        if(speechtotextresult){
            console.log("speechtotestresult: ",speechtotextresult);
            handleSendMessage(speechtotextresult);
        }
    },[speechtotextresult])
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(recordedBlob); 
                console.log("Recorded audio Blob:", recordedBlob); 
                audioChunksRef.current = []; 
                    
                sendAudioToServer(recordedBlob);
            };

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const toggleMic = () => {
        if (turnonmic) {
            stopRecording(); // Stop recording
            setturnonmic(false); // Update mic state
        } else {
            startRecording(); // Start recording
            setturnonmic(true); // Update mic state
        }
    };

    return (
        <div className='fixed w-full lg:text-lg flex justify-center flex-wrap text-sm z-10'>
            <>
                <div className=' font-bold font-roboto flex flex-col items-center'>
                    {
                        login ? (
                            <>
                                <div className="cursor-pointer mt-2  bg-gray-800 rounded-full p-2 w-fit" onClick={toggleMic}>
                                    {turnonmic ? (
                                        /* Mic Off SVG */
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        /* Mic On SVG */
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                        </svg>
                                    )}
                                </div> 
                                {
                                    aithinking && speechtotextresult && (
                                        <>
                                            <div className='flex gap-2 p-2 bg-gray-300 rounded-lg text-sm lg:text-md items-center justify-center'>
                                                <div>{speechtotextresult}</div>
                                                <div className="w-5 h-5 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>                                        
                                        </>
                                    )
                                } 
                            </>
                        ):(
                            <>
                                <div className="relative w-[13rem] bg-gray-800 rounded-lg flex items-center mt-10">
                                    {/* Sliding background */}
                                    <div
                                    className={`absolute top-0 left-0 w-1/2 h-full ${(active === "login" || active === "signup") ? "bg-blue-500" :""} rounded-lg transition duration-500 ease-in-out 
                                    ${active === 'signup' ? 'translate-x-full' :(active === 'main' || active === 'rank' ) ? " hidden" :'translate-x-0'}`}
                                    ></div>

                                    {/* Login Button */}
                                    <button
                                    className={`relative z-10 w-1/2 h-full text-white font-bold transition p-2 duration-500 
                                    ${active === 'login' ? 'text-white' : (active === 'main' || active === 'rank') ? "text-gray-400 opacity-75 hover:bg-blue-500 rounded-lg" : 'text-gray-500 opacity-70'}`}
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