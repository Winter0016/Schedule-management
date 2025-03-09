import React, { useState, useContext, useEffect } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images';

export const Login = () => {
    const { setlogin, setloggedusername, loggedusername } = useContext(Usercontext);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const { active, setActive } = useContext(Usercontext);
    const [forgetpwd, setforgetpwd] = useState(false);
    const [emailreset, setemailreset] = useState("");
    const [showpassword, setshowpassword] = useState(false);
    const navigate = useNavigate(); // If you need to navigate after login
    const [loginerror, setloginerror] = useState("");

    const checkrefreshtoken = async (myrefreshtoken) => {
        try {
            console.log(`running checkrefreshtoken`);
            const response = await fetch("http://localhost:3000/auth/checkrefreshtoken", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshtoken: myrefreshtoken })
            });
            const data = await response.json();

            if (data.user) {
                setlogin(true);
                setloggedusername(data.user);
                setActive("main");
                navigate("/dashboard/plan")
            }
        } catch (error) {
            console.log(error)
        }
    };


    const loginfunction = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, pwd: password }), // Use username and password from state
                credentials: 'include' // Include credentials (cookies)
            });
            const data = await response.json();
            console.log(data);
            if (data == "Wrong password!" || data == "No user Found") {
                throw new Error("Wrong password or username!");
            }
            setloginerror("");
            await checkrefreshtoken(document.cookie.substring("jwt".length + 1));
        } catch (error) {
            // console.error('Error:', error);
            setlogin(false);
            setloginerror(error.message);
        }
    };

    const [loadingreset, setloadingreset] = useState(false);
    const [sendresult, setsendresult] = useState("");
    const resetpassword = async (e) => {
        // console.log(`running reset password`)
        e.preventDefault();
        setloadingreset(true);
        try {
            if (!emailreset) {
                throw new Error("Please enter the email for reset password!")
            }
            const response = await fetch('http://localhost:3000/reset-password', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailreset }),
                credentials: 'include'
            })
            const data = await response.json();
            // console.log(data)
            setsendresult(data);
            setloadingreset(false);
        } catch (error) {
            console.log(error)
            setsendresult(error.message);
            setloadingreset(false);
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
        <div style={backgroundStyle}>
            {
                loggedusername ? (
                    <div className='border-2 md:m-auto pt-[10rem] flex justify-center '>
                        <div className='text-center mb-5'>You are LOGGED IN!</div>
                    </div>
                ) : (
                    <div className="max-w-lg w-full mx-auto pt-[10rem]">
                        <div
                            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="p-8">
                                <h2 className="text-center text-3xl font-extrabold text-white">Welcome Back</h2>
                                <p className="mt-4 text-center text-gray-400">Sign in to continue</p>
                                <form method="POST" onSubmit={loginfunction} className="mt-8 space-y-6">
                                    <div className="rounded-md shadow-sm">
                                        <div>
                                            <label className="sr-only" htmlFor="email">Email address</label>
                                            <input
                                                placeholder="Username"
                                                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                required
                                                autoComplete="username"
                                                type="text"
                                                name="text"
                                                id="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)} // Update username state
                                            />
                                        </div>
                                        <div className="mt-4 relative">
                                            <label className="sr-only" htmlFor="password">Password</label>
                                            <input
                                                placeholder="Password"
                                                className="appearance-none relative block min-w-full pl-3 pr-[4rem] py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                required
                                                type={showpassword ? "text" : "password"}
                                                name="password"
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)} // Update password state
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 z-10"
                                                onClick={() => { setshowpassword(!showpassword) }}
                                            >
                                                {showpassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center">
                                            <input
                                                className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-600 rounded"
                                                type="checkbox"
                                                name="remember-me"
                                                id="remember-me"
                                            />
                                            <label className="ml-2 block text-sm text-gray-400" htmlFor="remember-me">Remember me</label>
                                        </div>

                                        <div className="text-sm">
                                            <a className="font-medium text-indigo-500 hover:text-indigo-400 hover:cursor-pointer" onClick={() => { setforgetpwd(true) }}>Forgot your password?</a>
                                        </div>
                                    </div>
                                    {
                                        forgetpwd ? (
                                            <>
                                                <div className='text-red-500'> Please enter your email below</div>
                                                <div className="flex flex-col gap-3">
                                                    <label className="sr-only" htmlFor="resetemail">Email</label>
                                                    <input
                                                        placeholder="Email"
                                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                        required
                                                        autoComplete="email"
                                                        type="email"
                                                        name="resetemail"
                                                        id="resetemail"
                                                        value={emailreset}
                                                        onChange={(e) => setemailreset(e.target.value)} // Update password state
                                                    />
                                                    <div className='flex gap-3'>
                                                        <button className='text-gray-300 py-2 px-7 rounded-full bg-black' onClick={() => { setforgetpwd(false) }}>
                                                            Back
                                                        </button>
                                                        <button className='px-7 py-2 rounded-full bg-blue-500' disabled={loadingreset} onClick={resetpassword}>
                                                            Send
                                                        </button>
                                                    </div>
                                                    {sendresult && <><div className='text-white'>{sendresult}</div> </>}
                                                </div>

                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <button
                                                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        type="submit"
                                                        disabled={forgetpwd}
                                                    >
                                                        Sign In
                                                    </button>
                                                    {loginerror && <div className='text-red-700'>{loginerror}</div>}
                                                </div>
                                            </>
                                        )
                                    }
                                </form>
                            </div>
                            <div className="px-8 py-4 bg-gray-700 text-center">
                                <span className="text-gray-400">Don't have an account?</span>
                                <a className="font-medium text-indigo-500 hover:text-indigo-400 hover:cursor-pointer" onClick={() => { navigate("/register"); setActive("signup") }}>Sign up</a>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
