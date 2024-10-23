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
import ProtectedRoute from "./components/ProtectedRoute";

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

  const getplan = async(req,res) =>{
    // console.log(`getplan`)
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
    if(loggedusername){
        // console.log("hello")
        getplan();
    }
  
  },[loggedusername,usernamerole,addacresult,deleteac,deleteresult,createresult])

  
  return (
    <>
      <Usercontext.Provider value={{ login, setlogin, refreshtoken, setrefreshtoken, loggedusername, setloggedusername, active, setActive, usernamerole, setusernamerole,open,setopen,plan,setplan,deleteac,setdeleteac,addacresult,setaddacresult,deleteresult,setdeleteresult,createresult,setcreateresult,getplan,loadingplan }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
            <Route path="/reset-password" element={<Resetpassword />} />

            {/* Protected Route for /plan */}
            <Route path="/dashboard" element={null}>
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
