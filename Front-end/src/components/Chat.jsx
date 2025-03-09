import { useState, useEffect, useRef,useContext } from "react";
import axios from 'axios';
import { Usercontext } from "../App";

export const Chat = () => {
    const { loggedusername,selectedOption} = useContext(Usercontext); 
    const [showchat, setshowchat] = useState(false);
    const [messages, setMessages] = useState([
        // { text: "Hello!", sender: "user" },
        { text: "Hi there! How can I help you?", sender: "responder" },
    ]);

    const chatEndRef = useRef(null); // Reference to scroll to the bottom
    const [inputValue, setInputValue] = useState(""); // State for textarea value
    const [turnonmic, setturnonmic] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioBlob, setAudioBlob] = useState(null); // State to store the recorded audio blob

    const [aithinking,setaithinking] = useState(false);
    const handleSendMessage = async (text) => {
        if (text) {

            setMessages(prevMessages => [...prevMessages, { text, sender: "user" }]);
            setInputValue("");
            
            try {
                setaithinking(true);
                const response = await axios.post('http://localhost:3000/ask', {
                    username: loggedusername,
                    planname: selectedOption,
                    question: text,
                });
                const data = response.data;
                console.log(data);
    
                setMessages(prevMessages => [...prevMessages, { text: data, sender: "responder" }]);
            } catch (error) {
                console.error(error);
            } finally {
                setaithinking(false);
            }
        }
    };
    

    // Scroll to the bottom of the chat when a new message is added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [transcribeMessage,settranscribeMessage] = useState("");

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'received.wav'); // Append the audio blob to the form data
    
        try {
            const response = await fetch('http://localhost:3000/voice-receive', {
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
            settranscribeMessage(data);
            setInputValue(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const [loadingspeechtotext,setloadingspeechtotext] =useState(false);
    const startRecording = async () => {
        try {
            setloadingspeechtotext(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(recordedBlob); // Store the recorded audio blob
                console.log("Recorded audio Blob:", recordedBlob); // Log the Blob to the console
                audioChunksRef.current = []; // Clear the chunks for the next recording
                    // Send the recorded audio to the server
                sendAudioToServer(recordedBlob);
            };

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }finally{
            setloadingspeechtotext(false);
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
        <div className="fixed bottom-10 w-fit h-fit right-16 flex gap-4">
            <div className={`${showchat ? "block" : "hidden"}`}>
                <div className="chat-component bg-white rounded-lg shadow-lg p-4 w-80 h-96 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-2 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`inline-block p-2 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} max-w-[70%]`}>
                                <span className="whitespace-normal break-words">{message.text}</span> {/* Allow text to wrap */}
                            </div>
                        </div>
                    ))}
                    {
                        aithinking ? (
                            <div class="flex flex-row gap-2">
                                <div class="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                                <div class="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                                <div class="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                            </div>
                        ):(
                            <></>
                        )
                    }
                    <div ref={chatEndRef} /> {/* Empty div to scroll to the bottom */}
                </div>
                <div className="w-full flex gap-1 items-center mt-2">
                    <div className="cursor-pointer" onClick={toggleMic}>
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
                    <textarea
                        disabled={loadingspeechtotext}
                        placeholder={loadingspeechtotext ? "Typing....":"Type a message..."}
                        className="border rounded w-full p-3 resize-none" // Added resize-none to prevent resizing
                        rows={1} // Set the number of visible rows
                        value={inputValue} // Controlled component
                        onChange={(e) => setInputValue(e.target.value)} // Update state on change
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { // Send message on Enter, allow Shift+Enter for new line
                                e.preventDefault(); // Prevent default behavior of Enter key
                                handleSendMessage(inputValue);
                            }
                        }}
                    />
                    {/* Display recorded audio here */}
                </div>
                {/* {audioBlob && (
                    <audio controls src={URL.createObjectURL(audioBlob)} className="mt-2">
                        Your browser does not support the audio element.
                    </audio>
                )} */}
            </div>
            <div className="w-fit h-fit p-3 rounded-full bg-gray-600 mt-2 self-end cursor-pointer" onClick={() => { setshowchat(!showchat) }}>
                {/* SVG icon goes here */}
                {showchat ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                )}
            </div>
        </div>
    );
};