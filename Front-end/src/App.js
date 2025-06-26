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
import { Layout } from "./components/Layout";
import axios from 'axios';

export const Usercontext = createContext("");




function App() {

  const [loggedusername, setloggedusername] = useState("");
  const [profilepicture,setprofilepicture] = useState("");
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

  const [lasttitle,setlastitle] = useState("");

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

  const [selected, setSelected] = useState('info');

  const [title,settitle] = useState("");
  const [body,setbody] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [activenotify,setactivenotify] = useState(false);
  const [notifyMonth,setnotifyMonth] = useState("");
  const [notifyDay,setnotifyDay] = useState("");
  


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
      default: return ""; // In case the input is not between 1 and 7
    }
  }



  const checkrefreshtoken = async (myrefreshtoken) => {
    try {
      // console.log(`running checkrefreshtoken at app.js`);
      const response = await fetch("http://13.217.195.4:3000/auth/checkrefreshtoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 THIS IS IMPORTANT
      });

      const data = await response.json();

      if (data.user) {
        setlogin(true);
        setloggedusername(data.user);
        setprofilepicture(data.picture);
        console.log(`checkrefreshtoken in appjs: ${data.user}`)
      }
    } catch (error) {
        console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    checkrefreshtoken();
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
            console.log(selectedDate)
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
        const response = await axios.post('http://13.217.195.4:3000/update-todaytask', {
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
      setlastitle("")
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
      setactivenotify(false)
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
      const response = await fetch("http://13.217.195.4:3000/plan", {
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
    if (updatecheckedarrayresult !== "" || updatetaskresult == "Added task successfully!" || updatetaskresult == "Updated task successfully!" || updatetaskresult =="Deleted activity successfully" || addacresult == "Action Updated!" || deleteac !== "" || createresult !== "" || deleteresult !== "" || deletefinishedtaskResult !== "") {
        console.log(updatetaskresult)
        handleUpdateTasks(); // Call the new function
    }
}, [selectedOption, loggedusername,updatecheckedarrayresult,updatetaskresult,addacresult,deleteac,,createresult,deleteresult,deletefinishedtaskResult]);

useEffect(()=>{
  if(profilepicture){
    checkrefreshtoken();
  }
},[profilepicture])

useEffect(()=>{
  if(loggedusername !== ""){
    console.log(`getplan at loggedusername`)
    handleUpdateTasks(); 
  }
},[loggedusername,selectedOption])


const VAPID_PUBLIC_KEY = 'BIrmw2mcz3aafP6wwwpnqQ1l8810B55qllJdBPoKveYwmXbPI8OnFkz3sTx7qBGW_kH_f5Tkx89PUYbz2ciHXEo';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

async function subscribe(username,title,body,time) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  await axios.post('http://13.217.195.4:3000/subscribe', subscription,username,title,body,time);
  console.log('Push subscription sent to server:', subscription);
}

//testing
// useEffect(() => {
//   async function unsubscribeOld() {
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//       try {
//         const registration = await navigator.serviceWorker.ready;
//         const subscription = await registration.pushManager.getSubscription();
//         if (subscription) {
//           await subscription.unsubscribe();
//           console.log('Unsubscribed old push subscription.');
//         } else {
//           console.log('No push subscription found.');
//         }
//       } catch (error) {
//         console.error('Error unsubscribing:', error);
//       }
//     }
//   }

//   unsubscribeOld();
// }, []);

  return (
    <>
      <Usercontext.Provider value={{ login, setlogin, loggedusername, setloggedusername,setprofilepicture,profilepicture, active, setActive, open, setopen, plan, deleteac, setdeleteac, addacresult, setaddacresult, setdeleteresult, createresult, setcreateresult, getplan, setSelectedOption, selectedOption, date, years, months, days, addschedule, setaddschedule, reversetranslateDay, setaddtask, addtask, updatetaskresult, setupdatetaskresult, modify, setmodify, modifyacname, setmodifyacname, dailyid, setdailyid, activeid, setactiveid,loadingplan,setupdatecheckedarrayresult,selectedMonth,selectedDate,setSelectedDate,setSelectedMonth,setPreviousMonth,setPreviousDate,modifyupdatetask, setmodifyupdatetask,modifyacnametask, setmodifyacnametask,setdeletefinishedtaskResult,title,settitle,body,setbody,selectedDay,setSelectedDay,selectedHour,setSelectedHour,selectedMinute,setSelectedMinute,activenotify,setactivenotify,selected, setSelected,notifyMonth,setnotifyMonth,notifyDay,setnotifyDay,lasttitle,setlastitle}}>
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