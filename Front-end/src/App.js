import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
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
import { Chat } from "./components/Chat";
import { Layout } from "./components/Layout";
import axios from 'axios';

export const Usercontext = createContext("");

function App() {

  const [loggedusername, setloggedusername] = useState("");
  const [login, setlogin] = useState(loggedusername ? true : false);
  const [active, setActive] = useState('');
  const [open, setopen] = useState(false);
  const [plan, setplan] = useState();

  const [addschedule, setaddschedule] = useState("");
  const [deleteac, setdeleteac] = useState("");
  const [addacresult, setaddacresult] = useState("");
    const [modify, setmodify] = useState(false);
    const [modifyacname, setmodifyacname] = useState();
    const [dailyid, setdailyid] = useState("");
    const [activeid, setactiveid] = useState("");


  const [deleteresult, setdeleteresult] = useState("");
  const [createresult, setcreateresult] = useState("");


  const [loadingplan, setloadingplan] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");


  const [addtask, setaddtask] = useState(false);
  const [updatetaskresult, setupdatetaskresult] = useState("")
      const [selectedMonth, setSelectedMonth] = useState();
      const [selectedDate, setSelectedDate] = useState("");
      const [previousMonth, setPreviousMonth] = useState("");
      const [previousDate, setPreviousDate] = useState("");
      const [modifyupdatetask, setmodifyupdatetask] = useState(false);
      const [modifyacnametask, setmodifyacnametask] = useState();
  const [updatecheckedarrayresult,setupdatecheckedarrayresult] = useState("");
  const [deletefinishedtaskResult,setdeletefinishedtaskResult] = useState("");


  const today = new Date();
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const date = today.getDate();
  let days = today.getDay(); // Get the current day number (0 = Sunday, 1 = Monday, etc.)
  if (days == 0) {
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
      // console.log(`running checkrefreshtoken at app.js`);
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
      }
    } catch (error) {
      console.log(error)
    } finally {
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
    if (!document.cookie) {
      setIsLoading(false)
    } else {
      checkrefreshtoken(document.cookie.substring("jwt".length + 1));
    }
  }, []);

  const [updatetodayresult,setupdatetodayresult] = useState("");
  const updateTodayTask = async (plan) => {
    let taskarray = []; // Initialize taskarray here
    console.log(`running updatetoday`)
    let currentchangetodaytask = false;
    try {
      // Fetch the latest plan data first
      if (plan && selectedOption) {
        console.log(plan);
        plan.forEach((data2) => {
          if (data2.name === selectedOption) {
            console.log(`updating`)
            console.log(selectedDate);
            if((selectedDate == date && selectedMonth ==(months + 1)) || (previousDate == date && previousMonth == (months + 1))) {
              currentchangetodaytask = true;
              console.log(`modified task todays => currentchange is true`)
            }
            data2.my_task.forEach((task) => {
              if (task.deadline.split("/")[0] == (months + 1).toString() && task.deadline.split("/")[1] == date.toString()) {
                console.log(`found`)
                taskarray.push({
                  name: task.name,
                  description: task.description,
                  timestart: task.timestart,
                  timeend: task.timeend,
                  color: task.color,
                  textcolor: task.textcolor,
                  important: true,
                  task:true,
                })
              }
            })
            data2.daily.forEach((activity) => {
              if (activity.day === days) {
                if (reversetranslateDay(addschedule) == days) {
                  console.log(`changetodaytask due to addschedule`)
                  currentchangetodaytask = true;
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
          changetodaytask: currentchangetodaytask // Use the local variable here
        });
        const data = await response;
        setupdatetodayresult(data);
        console.log("currentchangetodaytask: ",currentchangetodaytask);
      }
      // Reset taskarray and currentChangetodaytask to default values
    } catch (error) {
      console.error('Error updating today task:', error.response ? error.response.data : error.message);
    }finally{
      console.log(taskarray);
      currentchangetodaytask = false;

      setcreateresult("")
      setdeleteresult("")

      setaddschedule("");
      setmodify(false);
      setaddacresult("");
      setdailyid("");
      setactiveid("");
      setmodifyacname("");
      setdeleteac("")

      setaddtask(false);
      setupdatetaskresult("");
      setmodifyupdatetask(false);
      setmodifyacnametask("");
      setSelectedMonth("");
      setSelectedDate("");
      setPreviousDate("");
      setPreviousMonth("");
      taskarray = [];
      setupdatecheckedarrayresult("");

      setdeletefinishedtaskResult("");
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
  const getplan = async (req, res) => {
    try {
      const response = await fetch("http://localhost:3000/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedusername }),
      })
      const data = await response.json()
      // console.log(`${JSON.stringify(data)}`);
      // console.log(data[1].name)
      if (data) {
        console.log(`getplan`)
        // console.log(plan);
        const updatedplan = data.plans.map((key) => ({
          ...key,
          daily: finddaily(key.daily),
        }));
        setplan(updatedplan);
        console.log(updatedplan)
        return updatedplan; // Return the updated plan
      }
    } catch (error) {
      console.log(error);
    }finally{
      setloadingplan(false);
    }
  }


  const handleUpdateTasks = async () => {
    const updatedPlan = await getplan(); // Wait for getplan to finish and get the updated plan
    await updateTodayTask(updatedPlan); // Pass the updated plan to updateTodayTask
    await getplan(); // Call getplan again after updateTodayTask
};

// Use useEffect to call handleUpdateTasks when needed
useEffect(() => {
    if (updatecheckedarrayresult !== "" || updatetaskresult !== "" || addacresult !== "" || deleteac !== "" || createresult !== "" || deleteresult !== "" || deletefinishedtaskResult !== "") {
        console.log(updatetaskresult)
        handleUpdateTasks(); // Call the new function
    }
}, [selectedOption, loggedusername,updatecheckedarrayresult,updatetaskresult,addacresult,deleteac,,createresult,deleteresult,deletefinishedtaskResult]);

useEffect(()=>{
  if(loggedusername !== ""){
    console.log(`getplan at loggedusername`)
    getplan();
  }
},[loggedusername])

useEffect(()=>{
  if(selectedOption !== ""){
    console.log(`getplan at selectedOption`);
    handleUpdateTasks(); // Call the new function
  }
},[selectedOption])

  return (
    <>
      <Usercontext.Provider value={{ login, setlogin, loggedusername, setloggedusername, active, setActive, open, setopen, plan, deleteac, setdeleteac, addacresult, setaddacresult, setdeleteresult, createresult, setcreateresult, getplan, setSelectedOption, selectedOption, date, years, months, days, addschedule, setaddschedule, reversetranslateDay, setaddtask, addtask, updatetaskresult, setupdatetaskresult, modify, setmodify, modifyacname, setmodifyacname, dailyid, setdailyid, activeid, setactiveid,loadingplan,setupdatecheckedarrayresult,selectedMonth,selectedDate,setSelectedDate,setSelectedMonth,setPreviousMonth,setPreviousDate,modifyupdatetask, setmodifyupdatetask,modifyacnametask, setmodifyacnametask,setdeletefinishedtaskResult}}>
        <BrowserRouter>
          <Header />
          {isLoading == true ? (
            <Loading /> // Show Loading while isLoading is true
          ) : (
            <Routes>
              <Route path="/" element={<Mainpage />} />
              <Route path="/reset-password" element={<Resetpassword />} />

              {/* Protected Route for /plan */}
              <Route path="/dashboard" element={<Layout></Layout>}>
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