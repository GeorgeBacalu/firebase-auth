import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
        toast.success("User registered successfully", { autoClose: 2000 });
        console.log("User registered successfully", user);
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
              <button type="submit" className="btn btn-primary mb-2" disabled={!formIsValid}>Register</button>
              <p>Already have an account? <Link to="/login">Login here!</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}