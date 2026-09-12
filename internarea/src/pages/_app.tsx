import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Fotter";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout } from "@/Feature/Userslice";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { UseDispatch } from "react-redux";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  function AuthListener() {
    const dispatch = useDispatch();

    useEffect(() => {
      const savedUser = localStorage.getItem("user");

      console.log("Saved User:", savedUser);

      if (savedUser) {
        dispatch(login(JSON.parse(savedUser)));
        console.log("Dispatched login");
      }

      const unsubscribe = auth.onAuthStateChanged((authuser) => {
        console.log("Firebase user:", authuser);

        if (authuser) {
          console.log("Firebase logged in");
        } else {
          console.log("Firebase NOT logged in");
        }
      });

      return () => unsubscribe();
    }, []);

    return null;
  }

  return (
    <Provider store={store}>
      <AuthListener />
      <div className="bg-white">
        <Toaster position="top-right" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js"/>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
  );
}
