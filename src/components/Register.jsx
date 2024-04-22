import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [fullNameIsValid, setFullNameIsValid] = useState(false);
  const [fullNameWasFocused, setFullNameWasFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [emailWasFocused, setEmailWasFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordWasFocused, setPasswordWasFocused] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    const passwordRegex = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+-=()])(?=\\S+$).{8,30}$");
    const identifier = setTimeout(() => {
      setFullNameIsValid(fullName.length > 0);
      setEmailIsValid(emailRegex.test(email));
      setPasswordIsValid(passwordRegex.test(password));
      setFormIsValid(fullName.length > 0 && emailRegex.test(email) && passwordRegex.test(password));
    }, 500);
    return () => clearTimeout(identifier)
  }, [fullName, email, password]);

  const handleRegister = event => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;
        if (user) {
          setDoc(doc(db, "users", user.uid), { fullName: fullName, email: user.email })
            .then(() => console.log("Doc updated successfully"))
            .catch(error => console.error("Error updating doc", error.message));
        }
        navigate("/profile");
        toast.success("User signed up successfully", { autoClose: 2000 });
        console.log("User signed up successfully", user);
      })
      .catch(error => {
        const errorMessages = {
            "auth/email-already-in-use": "This email is already in use by another account!",
            "auth/invalid-email": "The email address is not valid!",
            "auth/operation-not-allowed": "Registration is currently disabled! Please try later!",
            "auth/weak-password": "The password is too weak! Please use a stronger password!"
        };
        toast.error(errorMessages[error.code] || "An unexpected registration error occurred. Please try again!", { autoClose: 2000 });
        console.error("Registration error:", error.message);
      });
  };

  const handleGoogleSignUp = event => {
    event.preventDefault();
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        if (user) {
          setDoc(doc(db, "users", user.uid), { email: user.email })
            .then(() => console.log("Doc updated successfully"))
            .catch(error => console.error("Error updating doc", error.message));
        }
        navigate("/profile");
        toast.success("User signed up successfully", { autoClose: 2000 });
        console.log("User signed up successfully", user);
      })
      .catch(error => {
        const errorMessages = {
          "auth/email-already-in-use": "This email is already in use by another account!",
          "auth/invalid-email": "The email address is not valid!",
          "auth/operation-not-allowed": "Registration is currently disabled! Please try later!",
          "auth/weak-password": "The password is too weak! Please use a stronger password!"
        };
        toast.error(errorMessages[error.code] || "An unexpected registration error occurred. Please try again!", { autoClose: 2000 });
        console.error("Google sign up failed:", error.message);
      });
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="card w-50">
          <div className="card-body">
            <h5 className="card-title text-center">Register</h5>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Name</label>
                <input type="fullName" id="fullName" value={fullName} onChange={event => setFullName(event.target.value)} onBlur={() => setFullNameWasFocused(true)} placeholder="Enter your full name" className="form-control" required />
                {!fullNameIsValid && fullNameWasFocused && <p className="mt-1 text-danger">You must enter your name!</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)} onBlur={() => setEmailWasFocused(true)} placeholder="Enter your email" className="form-control" required />
                {!emailIsValid && emailWasFocused && <p className="mt-1 text-danger">Invalid email format!</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} onBlur={() => setPasswordWasFocused(true)} placeholder="Enter your password" className="form-control" required />
                {!passwordIsValid && passwordWasFocused && <p className="mt-1 text-danger">Invalid password format!</p>}
              </div>
              <button type="submit" className="btn btn-primary mb-2 d-block" disabled={!formIsValid}>Register</button>
              <button type="button" className="btn btn-secondary mb-2" onClick={handleGoogleSignUp}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Sign Up With Google
              </button>
              <p>Already have an account? <Link to="/login">Login here!</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}