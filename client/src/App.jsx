import React, { useState, useEffect, createContext } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/UserAuthForm";
import { lookInSession } from "./common/session";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {/* Render Navbar outside of Routes */}
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Welcome to the Home Page!</div>} />
        <Route path="signin" element={<UserAuthForm type="signin" />} />
        <Route path="signup" element={<UserAuthForm type="signup" />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
