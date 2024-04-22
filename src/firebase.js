// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx0g3sZYmx2xHc8wLzYeAVQXVygZLruq0",
  authDomain: "react-firebase-auth-ae4b4.firebaseapp.com",
  projectId: "react-firebase-auth-ae4b4",
  storageBucket: "react-firebase-auth-ae4b4.appspot.com",
  messagingSenderId: "990365880730",
  appId: "1:990365880730:web:c6d2452af9244e7b70aa23",
  measurementId: "G-LVW6JLF1B2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);