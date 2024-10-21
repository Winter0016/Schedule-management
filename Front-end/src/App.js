import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";

import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { Mainpage } from "./pages/Mainpage";
import { Register } from "./pages/Register";
import { Resetpassword } from "./pages/Resetpassword";
import { Plan } from "./pages/Plan";
import { NotFound } from "./pages/404";
import { Loginsignup } from "./components/Login&signup";
import ProtectedRoute from "./components/ProtectedRoute";

export const Usercontext = createContext("");

function App() {
  const [login, setlogin] = useState(localStorage.getItem("loggedusername") ? true : false);
  const [loggedusername, setloggedusername] = useState(localStorage.getItem("loggedusername") || null); // Get from localStorage if exists
  const [usernamerole, setusernamerole] = useState();
  const [refreshtoken, setrefreshtoken] = useState("");
  const [active, setActive] = useState('');

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

  
  return (
    <>
      <Usercontext.Provider value={{ login, setlogin, refreshtoken, setrefreshtoken, loggedusername, setloggedusername, active, setActive, usernamerole, setusernamerole }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
            <Route path="/reset-password" element={<Resetpassword />} />

            {/* Protected Route for /plan */}
            <Route path="/plan" element={
              <ProtectedRoute loggedusername={loggedusername}>
                <Plan />
              </ProtectedRoute>
            } />
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
