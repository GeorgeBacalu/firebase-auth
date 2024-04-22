import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function Login() {
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
      setEmailIsValid(emailRegex.test(email));
      setPasswordIsValid(passwordRegex.test(password));
      setFormIsValid(emailRegex.test(email) && passwordRegex.test(password));
    }, 500);
    return () => clearTimeout(identifier)
  }, [email, password]);

  const handleLogin = event => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/profile");
        toast.success("User logged in successfully", { autoClose: 2000 });
        console.log("User logged in successfully", auth.currentUser);
      })
      .catch(error => {
        const errorMessages = {
            "auth/invalid-email": "The email address is not valid!",
            "auth/invalid-credential": "The email address and/or password are not valid!",
            "auth/user-disabled": "This account has been disabled by an administrator!",
            "auth/user-not-found": "No user corresponds to the provided email!",
            "auth/wrong-password": "Wrong password! Please try again!",
            "auth/network-request-failed": "Check your internet connection and try again!"
        };
        const message = errorMessages[error.code] || "An unexpected login error occurred. Please try again!";
        toast.error(message, { autoClose: 2000 });
        console.error("Login error:", error.message);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="card w-50">
          <div className="card-body">
            <h5 className="card-title text-center">Login</h5>
            <form onSubmit={handleLogin}>
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
              <button type="submit" className="btn btn-primary mb-2" disabled={!formIsValid}>Login</button>
              <p>Do not have an account? <Link to="/register">Register here!</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}