import React from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { Search, Users } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectuser, logout } from "@/Feature/Userslice";

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
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    toast.success("Logged out successfully");

    window.location.href = "/";
  };

  return (
    <div className="relative">
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* ================= LOGO ================= */}
            <div className="flex shrink-0">
              <Link
                href="/"
                className="flex items-center"
              >
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            {/* ================= NAVIGATION ================= */}
            <div className="hidden md:flex items-center space-x-7">

              {/* Internships */}
              <Link
                href="/internship"
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group"
              >
                Internships

                <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>

              {/* Jobs */}
              <Link
                href="/job"
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group"
              >
                Jobs

                <span className="absolute left-0 -bottom-2 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>

              {/* ================= PUBLIC SPACE ================= */}
              <Link
                href="/public-space"
                className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 font-semibold transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <Users
                  size={17}
                  className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200"
                />

                <span>Public Space</span>
              </Link>

              {/* ================= PLANS ================= */}
              {user && (
                <Link
                  href="/subscription"
                  className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Plans
                </Link>
              )}

              {/* ================= SEARCH ================= */}
              <div className="flex items-center bg-gray-100 border border-transparent rounded-full px-4 py-2.5 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                <Search
                  size={17}
                  className="text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="ml-2 w-44 bg-transparent text-black placeholder:text-gray-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* ================= AUTH BUTTONS ================= */}
            <div className="flex items-center space-x-4">

              {user ? (
                <div className="flex items-center gap-3">

                  {/* Profile */}
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

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow-sm hover:bg-red-600 hover:shadow-md transition-all duration-200"
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <div className="flex items-center gap-3">

                  {/* Sign In */}
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Sign In
                  </Link>

                  {/* Register */}
                  <Link
                    href="/register"
                    className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 bg-white font-semibold shadow-sm hover:bg-blue-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Register
                  </Link>

                  {/* Admin */}
                  <Link
                    href="/adminlogin"
                    className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white font-semibold shadow-md hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Admin
                  </Link>

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