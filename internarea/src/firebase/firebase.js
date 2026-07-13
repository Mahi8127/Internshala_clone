// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlt9XB2qLFWnganWGctLaolLZKcG6gwf8",
  authDomain: "internarea-da4af.firebaseapp.com",
  projectId: "internarea-da4af",
  storageBucket: "internarea-da4af.firebasestorage.app",
  messagingSenderId: "305476977815",
  appId: "1:305476977815:web:4988c98fac9c711c8295d2",
  measurementId: "G-4FY0M6MTZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth,provider};