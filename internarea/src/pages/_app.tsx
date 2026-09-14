import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Script from "next/script";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Fotter";
import { auth } from "@/firebase/firebase";
import { login } from "@/Feature/Userslice";
import { store } from "../store/store";

import { Toaster } from "react-hot-toast";

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore previously logged-in user
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        dispatch(login(JSON.parse(savedUser)));
      } catch (error) {
        console.error("Failed to restore saved user:", error);
        localStorage.removeItem("user");
      }
    }

    // Firebase authentication listener
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log("Firebase authentication active");
      } else {
        console.log("Firebase user signed out");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return (
    <Provider store={store}>
      <AuthListener />

      <div className="min-h-screen flex flex-col bg-white">

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

        {/* Razorpay Checkout */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        {/* Navbar */}
        <header className="shrink-0">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full">
          <Component {...pageProps} />
        </main>

        {/* Footer */}
        <footer className="shrink-0">
          <Footer />
        </footer>

      </div>
    </Provider>
  );
}