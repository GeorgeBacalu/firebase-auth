import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () =>
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
          } else {
            navigate("/login");
          }
        }
      });
    fetchUserData();
  }, [navigate]);

  const handleLogout = event => {
    event.preventDefault();
    auth.signOut()
      .then(() => {
        setUserInfo(null);
        navigate("/login");
        toast.success("User logged out", { autoClose: 2000 });
        console.log("User logged out");
      })
      .catch(error => {
        const errorMessages = {
          "auth/network-request-failed": "Check your internet connection and try again!",
          "auth/internal-error": "Internal error occurred, please try again later!"
        };
        toast.error(errorMessages[error.code] || "An unexpected error occurred. Please try again!", { autoClose: 2000 });
        console.error("Logout error:", error.message);
      });
  };

  return (
    <div className="container mt-5">
      {userInfo ? (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Welcome {userInfo.fullName}</h3>
            <p className="card-text">Email: {userInfo.email}</p>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}