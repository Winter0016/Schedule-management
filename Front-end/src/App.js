import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";

import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { Mainpage } from "./pages/Mainpage";
import { Register } from "./pages/Register";
import { Resetpassword } from "./pages/Resetpassword";
import { Plan } from "./pages/Plan";
import { NotFound } from "./pages/404";
import { Loginsignup } from "./components/Login&signup";
import { Testing } from "./pages/testing";
import { Sidebar } from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Schedule } from "./pages/Schedule";
import { Mytask } from "./pages/Mytask";
import axios from 'axios';


export const Usercontext = createContext("");

function App() {
  const [login, setlogin] = useState(localStorage.getItem("loggedusername") ? true : false);
  const [loggedusername, setloggedusername] = useState(localStorage.getItem("loggedusername") || null); // Get from localStorage if exists
  const [usernamerole, setusernamerole] = useState();
  const [refreshtoken, setrefreshtoken] = useState("");
  const [active, setActive] = useState('');
  const [open,setopen] = useState(false);
  const [plan,setplan] = useState();
  const[deleteac,setdeleteac] = useState("");
  const [addacresult,setaddacresult] = useState();
  const [deleteresult,setdeleteresult] = useState("");
  const [createresult,setcreateresult] = useState("");
  const[loadingplan,setloadingplan] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [addtask, setaddtask] = useState(""); 
  const today = new Date();

  const date = today.getDate();
  let days = today.getDay(); // Get the current day number (0 = Sunday, 1 = Monday, etc.)
  if(days ==0){
    days = 7
  }
  const months = today.getMonth();
  const years = today.getFullYear();

  function reversetranslateDay(daystring) {
    switch (daystring) {
        case "Monday": return 1;
        case "Tuesday": return 2;
        case "Wednesday": return 3;
        case "Thursday": return 4;
        case "Friday": return 5;
        case "Saturday": return 6;
        case "Sunday": return 7;
        default: return "Invalid day string"; // In case the input is not between 1 and 7
    }
}

  const sortactivity = (activityarray) => {
    return activityarray.sort((a, b) => parseInt(a.timestart.split(":")[0]) - parseInt(b.timestart.split(":")[0]));
  };
  
  const finddaily = (daily) => {
    return daily.map((key) => ({
      ...key,
      activities: sortactivity(key.activities)
    }));
  };

  const checkrefreshtoken = async (myrefreshtoken) => {
    const response = await fetch("http://localhost:3000/auth/checkrefreshtoken", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshtoken: myrefreshtoken })
    });
    const data = await response.json();
    
    setloggedusername(data.user);
    setusernamerole(data.role);
    localStorage.setItem("loggedusername", data.user);  // Save logged user to localStorage
  };

  useEffect(() => {
    if (document.cookie) {
      setlogin(true);
      setrefreshtoken(document.cookie.substring("jwt".length + 1));
      checkrefreshtoken(document.cookie.substring("jwt".length + 1));
    }
  }, [document.cookie]);

  const [updatetoday,setupdatetoday] = useState("")
  const updateTodayTask = async () => {
    let currentChangetodaytask = false; // Use a local variable
    let taskarray = []; // Initialize taskarray here

    try {
        // Fetch the latest plan data first
        if (plan && selectedOption) {
            // console.log(`plan and selected option`)
            plan.forEach((data2) => {
                if (data2.name === selectedOption) {
                    data2.daily.forEach((activity) => {
                        if (activity.day === days) {
                            if (reversetranslateDay(addtask) == days) {
                                // console.log(`changetodaytask due to addtask`)
                                currentChangetodaytask = true; // Update the local variable
                            }
                            activity.activities.forEach((active) => {
                                taskarray.push({
                                    name: active.name,
                                    description: active.description,
                                    timestart: active.timestart,
                                    timeend: active.timeend,
                                    color: active.color,
                                    textcolor: active.textcolor,
                                    important: active.important,
                                });
                            });
                        }
                    });
                }
            });

            const response = await axios.post('http://localhost:3000/update-todaytask', {
                username: loggedusername,
                plan: selectedOption,
                date: `${years}-${months}-${date}`,
                task: taskarray,
                changetodaytask: currentChangetodaytask // Use the local variable here
            });
            setupdatetoday(response.data)
            // console.log(response.data);
        }
        // Reset taskarray and currentChangetodaytask to default values
        taskarray = []; // Reset taskarray
        currentChangetodaytask = false; // Reset currentChangetodaytask

        // console.log(response.data);
    } catch (error) {
        console.error('Error updating today task:', error.response ? error.response.data : error.message);
    }
};

  const getplan = async(req,res) =>{
    try{
        setloadingplan(true)
        const response = await fetch("http://localhost:3000/plan",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:loggedusername}),
        })
        const data = await response.json()
        // console.log(`${JSON.stringify(data)}`);
        // console.log(data[1].name)
        const updatedplan = data.plans.map((key) => ({
          ...key,
          daily: finddaily(key.daily)
        }));
        setplan(updatedplan);
        setloadingplan(false);
    }catch(error){
        setloadingplan(false);
        console.log(error);
    }
  }
  useEffect(()=>{
    if(loggedusername || addacresult !=="" || deleteac !=="" || deleteresult !=="" || createresult !=="" || updatetoday !==""){
      // console.log(`running getplan`)
      getplan();
    }  
  },[loggedusername,addacresult,deleteac,deleteresult,createresult,updatetoday,selectedOption])

  useEffect(()=>{
    // console.log(`loadingplan is changing`)
    if(loadingplan == false){
      // console.log(`running updatetodaytask`)
      updateTodayTask();
    }
  },[loadingplan])
  return (
    <>
      <Usercontext.Provider value={{ login, setlogin, refreshtoken, setrefreshtoken, loggedusername, setloggedusername, active, setActive, usernamerole, setusernamerole,open,setopen,plan,deleteac,setdeleteac,addacresult,setaddacresult,setdeleteresult,createresult,setcreateresult,getplan,loadingplan,setSelectedOption,selectedOption,date,years,months,days,addtask,setaddtask,reversetranslateDay }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
            <Route path="/reset-password" element={<Resetpassword />} />

            {/* Protected Route for /plan */}
            <Route path="/dashboard" element={<Sidebar></Sidebar>}>
              <Route index element={<Navigate to="/dashboard/404" />} /> {/* Redirect to 404 if just /dashboard */}
              <Route path="plan" element={
                <ProtectedRoute loggedusername={loggedusername}>
                  <Plan />
                </ProtectedRoute>
              } />
              <Route path="testing" element={
                <ProtectedRoute loggedusername={loggedusername}>
                  <Testing />
                </ProtectedRoute>
              } />
              <Route path="schedule" element={
                <ProtectedRoute loggedusername={loggedusername}>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="mytask" element={
                <ProtectedRoute loggedusername={loggedusername}>
                  <Mytask />
                </ProtectedRoute>
              } />
              <Route path="404" element={<NotFound />} /> {/* 404 route */}
            </Route>
            <Route path="/login" element={
              <Loginsignup loggedusername={loggedusername}>
                <Login />
              </Loginsignup>
            } />
            <Route path="/register" element={
              <Loginsignup loggedusername={loggedusername}>
                <Register />
              </Loginsignup>
            } />

            {/* 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all for other invalid routes */}
          </Routes>
        </BrowserRouter>
      </Usercontext.Provider>
    </>
  );
}

export default App;
