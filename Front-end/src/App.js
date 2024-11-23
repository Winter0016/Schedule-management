import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { Loading } from "./components/Loadingpage";
import axios from 'axios';

export const Usercontext = createContext("");

function App() {
  const [loggedusername, setloggedusername] = useState(); 
  const [login, setlogin] = useState(loggedusername ? true : false);
  const [usernamerole, setusernamerole] = useState();
  const [active, setActive] = useState('');
  const [open,setopen] = useState(false);
  const [plan,setplan] = useState();
  const[deleteac,setdeleteac] = useState("");
  const [addacresult,setaddacresult] = useState();
  const [deleteresult,setdeleteresult] = useState("");
  const [createresult,setcreateresult] = useState("");
  const[loadingplan,setloadingplan] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [addschedule, setaddschedule] = useState(""); 
  const [addtask,setaddtask] = useState(false);
  const [updatetaskresult,setupdatetaskresult] = useState("")

  const today = new Date();
  const [isLoading, setIsLoading] = useState(true); // Loading state

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



  const checkrefreshtoken = async (myrefreshtoken) => {
    try {
      console.log(`running checkrefreshtoken at app.js`);
      const response = await fetch("http://localhost:3000/auth/checkrefreshtoken", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshtoken: myrefreshtoken })
      });
      const data = await response.json();
      
      if(data.user && data.role){
        setlogin(true);
        setloggedusername(data.user);
        setusernamerole(data.role);
      }
    }catch(error){
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
       
      //in canse document cookie store more than one :

      // example cookie data : const sampleCookieString = "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw0; key=some_value; another_cookie=test";

      // const cookieParts = document.cookie.split('; ');
      // for (const part of cookieParts) {
      //   const [key, value] = part.split('=');
      //   if (key === 'jwt') {
      //     console.log(`jwt = ${value}`);
      //   }
      //   if (key === 'key') {
      //     console.log(`key = ${value}`);
      //   }
      // }

      ///////
      // console.log(document.cookie.substring("jwt".length + 1));
      if(!document.cookie){
        setIsLoading(false)
      }else{
        checkrefreshtoken(document.cookie.substring("jwt".length + 1));
      }
  }, []);

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
                            if (reversetranslateDay(addschedule) == days) {
                                // console.log(`changetodaytask due to addschedule`)
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

  const sortactivity = (activityarray) => {
    return activityarray.sort((a, b) => parseInt(a.timestart.split(":")[0]) - parseInt(b.timestart.split(":")[0]));
  };

  const finddaily = (daily) => {
    return daily.map((key) => ({
      ...key,
      activities: sortactivity(key.activities)
    }));
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
        if(data){
          const updatedplan = data.plans.map((key) => ({
            ...key,
            daily: finddaily(key.daily),
          }));
          setplan(updatedplan);
        }
        setloadingplan(false);
    }catch(error){
        setloadingplan(false);
        console.log(error);
    }
  }
  useEffect(()=>{
    if(loggedusername){
      console.log(`running getplan`)
      getplan();
    }  
  },[loggedusername,addacresult,deleteac,deleteresult,createresult,updatetoday,selectedOption,updatetaskresult])

  useEffect(()=>{
    // console.log(`loadingplan is changing`)
    if(loadingplan == false){
      // console.log(`running updatetodaytask`)
      updateTodayTask();
    }
  },[loadingplan])
  return (
    <>
      <Usercontext.Provider value={{ login, setlogin, loggedusername, setloggedusername, active, setActive, usernamerole, setusernamerole,open,setopen,plan,deleteac,setdeleteac,addacresult,setaddacresult,setdeleteresult,createresult,setcreateresult,getplan,loadingplan,setSelectedOption,selectedOption,date,years,months,days,addschedule,setaddschedule,reversetranslateDay,setaddtask,addtask,updatetaskresult,setupdatetaskresult }}>
        <BrowserRouter>
          <Header />
          {isLoading == true ? (
            <Loading /> // Show Loading while isLoading is true
          ) : (
            <Routes>
              <Route path="/" element={<Mainpage />} />
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
          )}
        </BrowserRouter>
      </Usercontext.Provider>
    </>
  );
}

export default App;