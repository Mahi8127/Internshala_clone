import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { logout } from "@/Feature/Userslice";
import { UseDispatch } from "react-redux";

interface User {
  name: string;
  email: string;
  photo: string;
}

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectuser);
  const handlelogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("logged in successfully");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }

    // setUser({
    //   name: "Rahul",
    //   email: "xyz@gmail.com",
    //   photo:
    //     "http://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces,",
    // });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());
    toast.success("Logged out successfully");
    window.location.href = "/";
  };
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsProfileDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  console.log("Redux User: ", user);
  return (
    <div className="relative">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex shrink-0">
              <a href="/" className="text-xl font-bold text-blue-600">
                <img src="/logo.png" alt="logo" className="h-16" />
              </a>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Link href="/internship">Internships</Link>
              </button>

              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Link href="/job">Jobs</Link>
              </button>

              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search size={16} className="text-gray-600" />

                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="ml-2 w-48 bg-transparent text-black placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md object-cover cursor-pointer hover:scale-105 transition duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg uppercase cursor-pointer hover:scale-105 transition duration-200">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow hover:bg-red-600 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <>
                    <Link
                      href="/login"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 bg-white font-semibold shadow-sm hover:bg-blue-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Register
                    </Link>

                    <Link
                      href="/adminlogin"
                      className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white font-semibold shadow-md hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Admin
                    </Link>
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
