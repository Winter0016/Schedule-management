import React, { useState, useContext, useEffect } from 'react';
import { Usercontext } from '../App';
import { useNavigate } from 'react-router-dom';
import images from '../images';

export const Register = () => {
    const { setlogin, setrefreshtoken, setloggedusername, loggedusername, active, setActive } = useContext(Usercontext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [loginresult, setloginresult] = useState("");
    const [error, seterror] = useState("");
    const [loading, setloading] = useState(false);
    const [showpassword, setshowpassword] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);


    const checkusername = async (USERNAME) => {
        // console.log(`Checking user ${USERNAME}`);
        try {
            const response = await fetch('https://34.201.151.117/auth/check-username', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: USERNAME }),
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Error checking username");
            }
            const data = await response.json();
            // console.log(data);
            setUsernameAvailable(data.exists ? "taken" : "available");
        }
        catch (error) {
            // console.log(error);
            setUsernameAvailable(error.message);
        }
    }
    const [emailavailable, setemailavailable] = useState("");
    const checkemail = async (EMAIL) => {
        // console.log(`Checking user ${USERNAME}`);
        try {
            const response = await fetch('https://34.201.151.117/auth/check-email', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: EMAIL }),
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Error checking username");
            }
            const data = await response.json();
            // console.log(data);
            setemailavailable(data.exists ? "taken" : "available");
        }
        catch (error) {
            // console.log(error);
            setemailavailable(error.message);
        }
    }

    useEffect(() => {
        if (username) {
            // console.log("username changing");
            checkusername(username)
        }
    }, [username])
    useEffect(() => {
        if (email) {
            checkemail(email)
        }
    }, [email])

    const registerfunction = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior
        try {
            if (!username || !password || !email) {
                throw new Error("Please fill everything from the form!");
            }
            setloading(true);
            const response = await fetch('https://34.201.151.117/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password, email: email }), // Use username and password from state
                credentials: 'include' // Include credentials (cookies)
            });

            if (!response.ok) {
                if (response.status == 409) {
                    throw new Error(`User ${username} is already exited`)
                }
                throw new Error('Registered failed');
            }

            const data = await response.json();
            setloginresult(data);
            // console.log(data);
            setlogin(false);
            seterror("");
            setUsername("");
            setEmail("");
            setPassword("");
            setloading(false);
        }
        catch (error) {
            console.error('Error:', error);
            seterror(error.message);
            setloading(false);
        }
    };

    const backgroundStyle = {
        backgroundImage: `url(${images.island})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        overflow: 'auto', // or 'scroll' for always showing the scrollbar
    };


    return (
        <div style={backgroundStyle}>
            {
                loggedusername ? (
                    <div className='border-2 md:m-auto pt-[10rem] flex justify-center'>
                        <div className='text-center mb-5'>You are LOGGED IN!</div>
                    </div>
                ) : (
                    <>
                        <div className="max-w-lg mx-auto pt-[10rem]">
                            <div
                                style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                                className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                            >
                                <div className="p-8">
                                    <h2 className="text-center text-3xl font-extrabold text-white">Register</h2>
                                    <p className="mt-4 text-center text-gray-400">Sign up now and get full access to our app</p>
                                    <form method="POST" className="mt-8 space-y-6" onSubmit={registerfunction}>
                                        <div className="rounded-md shadow-sm">
                                            <div>
                                                <label className="sr-only" htmlFor="username">Username</label>
                                                <input
                                                    placeholder="Username"
                                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    required
                                                    type="text"
                                                    name="username"
                                                    id="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)} // Update username state
                                                />
                                                {
                                                    usernameAvailable && username ? (
                                                        <>
                                                            <div className={`${usernameAvailable == "taken" ? "text-red-500" : "text-green-500"} pl-2 text-sm`}>{usernameAvailable}</div>
                                                        </>
                                                    ) : (
                                                        <>

                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className='mt-4'>
                                                <label className="sr-only" htmlFor="email">Email address</label>
                                                <input
                                                    placeholder="Email address (Email needs to exist)"
                                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    required
                                                    autoComplete="email"
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)} // Update username state
                                                />
                                                {
                                                    emailavailable && email ? (
                                                        <>
                                                            <div className={`${emailavailable == "taken" ? "text-red-500" : "text-green-500"} pl-2 text-sm`}>{emailavailable}</div>
                                                        </>
                                                    ) : (
                                                        <>

                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className="mt-4 relative">
                                                <label className="sr-only" htmlFor="password">Password</label>
                                                <input
                                                    placeholder="Password"
                                                    className="appearance-none relative block min-w-full pl-3 pr-[4rem] py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    required
                                                    autoComplete="current-password"
                                                    type={showpassword ? "text" : "password"}
                                                    name="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)} // Update password state
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => { setshowpassword(!showpassword) }}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-10 text-gray-400"
                                                >
                                                    {showpassword ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">

                                        </div>

                                        <div>
                                            <button
                                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                type="submit"
                                                disabled={usernameAvailable == "taken" || emailavailable === "taken" || loading}
                                            >
                                                {loading ? "Signing..." : "Sign up"}
                                            </button>
                                        </div>
                                        {
                                            loginresult ? (
                                                <>
                                                    <div className='text-center text-green-500 font-bold text-lg'>{loginresult}</div>
                                                </>
                                            ) : error && (
                                                <>
                                                    <div className='text-red-500 font-bold text-lg'>{error}</div>
                                                </>
                                            )
                                        }
                                    </form>
                                </div>
                                <div className="px-8 py-4 bg-gray-700 text-center">
                                    <span className="text-gray-400">Already have an account?</span>
                                    <a className="font-medium text-indigo-500 hover:text-indigo-400 hover:cursor-pointer" onClick={() => { navigate("/login"); setActive("login") }}>Login</a>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};
