import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Posts from "./components/Posts";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import { auth, db } from "./firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async user => {
        if (user) {
          const superAdminsCollectionRef = collection(db, "superAdmins");
          const superAdminDocSnap = await getDocs(superAdminsCollectionRef);
          const superAdminUser = superAdminDocSnap.docs.filter(doc => doc.data().email === user.email);
          if (superAdminUser.length === 0) {
            setUser(user);
            setIsSuperAdmin(true);
          } else {
            const userDocRef = doc(db, "users", user.email);
            const adminDocRef = doc(db, "admins", user.email);
            const userDocSnap = await getDoc(userDocRef);
            const adminDocSnap = await getDoc(adminDocRef);
            if (userDocSnap.exists() || adminDocSnap.exists()) {
              setUser(user);
              setIsSuperAdmin(false);
            } else {
              setUser(null);
              setIsSuperAdmin(false);
            }
          }
        } else {
          setUser(null);
          setIsSuperAdmin(false);
        }
      });
    }
    fetchUserData();
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} isSuperAdmin={isSuperAdmin} />
      <Routes>
        <Route path="/" element={user ? <Navigate replace to="/profile" /> : <Navigate replace to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate replace to="/login" />} />
        <Route path="/community" element={user ? <Posts /> : <Navigate replace to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate replace to="/login" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate replace to="/profile" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/profile" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}