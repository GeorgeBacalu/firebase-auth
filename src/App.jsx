import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Login from "./components/Login";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => { auth.onAuthStateChanged(user => setUser(user)); }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate replace to="/profile" /> : <Navigate replace to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate replace to="/login" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate replace to="/profile" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/profile" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}