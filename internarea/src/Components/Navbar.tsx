import React, { useState } from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { Search, Users, Menu, X } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectuser, logout } from "@/Feature/Userslice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectuser);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full">
      <nav className="w-full border-b border-gray-200 bg-white shadow-sm">

        {/* ================= MAIN NAVBAR ================= */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex h-[72px] items-center justify-between gap-4">

            {/* ================= LOGO ================= */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex min-w-0 shrink-0 items-center"
            >
              <img
                src="/logo.png"
                alt="Internship Platform"
                className="
                  block
                  h-12
                  w-[150px]
                  max-w-full
                  object-contain
                  object-left
                  sm:h-14
                  sm:w-[175px]
                  lg:h-14
                  lg:w-[190px]
                "
              />
            </Link>

            {/* ================= DESKTOP NAVIGATION ================= */}
            <div className="hidden items-center gap-1 lg:flex">

              {/* Internships */}
              <Link
                href="/internship"
                className="
                  group relative
                  rounded-lg
                  px-4 py-2.5
                  text-sm font-semibold text-gray-700
                  transition-all duration-200
                  hover:bg-blue-50 hover:text-blue-600
                "
              >
                Internships

                <span
                  className="
                    absolute bottom-1 left-4 right-4
                    h-0.5 scale-x-0
                    rounded-full bg-blue-600
                    transition-transform duration-200
                    group-hover:scale-x-100
                  "
                />
              </Link>

              {/* Jobs */}
              <Link
                href="/job"
                className="
                  group relative
                  rounded-lg
                  px-4 py-2.5
                  text-sm font-semibold text-gray-700
                  transition-all duration-200
                  hover:bg-blue-50 hover:text-blue-600
                "
              >
                Jobs

                <span
                  className="
                    absolute bottom-1 left-4 right-4
                    h-0.5 scale-x-0
                    rounded-full bg-blue-600
                    transition-transform duration-200
                    group-hover:scale-x-100
                  "
                />
              </Link>

              {/* Public Space */}
              <Link
                href="/public-space"
                className="
                  flex items-center gap-2
                  rounded-lg
                  px-4 py-2.5
                  text-sm font-semibold text-gray-700
                  transition-all duration-200
                  hover:bg-blue-50 hover:text-blue-600
                "
              >
                <Users
                  size={17}
                  className="text-gray-500 transition-colors group-hover:text-blue-600"
                />

                <span>Public Space</span>
              </Link>

              {/* Plans */}
              {user && (
                <Link
                  href="/subscription"
                  className="
                    ml-1
                    rounded-full
                    bg-blue-600
                    px-5 py-2.5
                    text-sm font-bold text-white
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-blue-700
                    hover:shadow-md
                  "
                >
                  Plans
                </Link>
              )}
            </div>

            {/* ================= SEARCH ================= */}
            <div className="hidden xl:flex">
              <div
                className="
                  flex items-center
                  rounded-full
                  border border-gray-200
                  bg-gray-50
                  px-4 py-2.5
                  transition-all duration-200
                  focus-within:border-blue-300
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-blue-50
                "
              >
                <Search
                  size={18}
                  className="shrink-0 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="
                    ml-2
                    w-48
                    bg-transparent
                    text-sm
                    text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />
              </div>
            </div>

            {/* ================= DESKTOP AUTH ================= */}
            <div className="hidden shrink-0 lg:flex items-center">

              {user ? (
                <div className="flex items-center gap-3">

                  {/* Profile */}
                  <Link href="/profile">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt="Profile"
                        className="
                          h-10 w-10
                          rounded-full
                          border-2 border-blue-500
                          object-cover
                          shadow-sm
                          transition-transform duration-200
                          hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex h-10 w-10
                          items-center justify-center
                          rounded-full
                          bg-blue-600
                          text-base font-bold
                          uppercase text-white
                          shadow-sm
                          transition-transform duration-200
                          hover:scale-105
                        "
                      >
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="
                      rounded-lg
                      bg-red-500
                      px-4 py-2
                      text-sm font-semibold text-white
                      shadow-sm
                      transition-all duration-200
                      hover:bg-red-600
                      hover:shadow-md
                    "
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">

                  <Link
                    href="/login"
                    className="
                      rounded-lg
                      bg-blue-600
                      px-5 py-2.5
                      text-sm font-semibold text-white
                      shadow-sm
                      transition-all duration-200
                      hover:bg-blue-700
                    "
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="
                      rounded-lg
                      border border-blue-600
                      bg-white
                      px-5 py-2.5
                      text-sm font-semibold text-blue-600
                      transition-all duration-200
                      hover:bg-blue-600
                      hover:text-white
                    "
                  >
                    Register
                  </Link>

                  <Link
                    href="/adminlogin"
                    className="
                      rounded-lg
                      border border-gray-300
                      bg-white
                      px-5 py-2.5
                      text-sm font-semibold text-gray-700
                      transition-all duration-200
                      hover:bg-gray-100
                    "
                  >
                    Admin
                  </Link>
                </div>
              )}
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-lg
                border border-gray-200
                bg-white
                text-gray-700
                shadow-sm
                transition-all duration-200
                hover:bg-gray-50
                lg:hidden
              "
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div
            className="
              border-t border-gray-100
              bg-white
              shadow-lg
              lg:hidden
            "
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

              {/* Mobile Search */}
              <div
                className="
                  mb-4 flex items-center
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4 py-3
                  focus-within:border-blue-300
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-blue-50
                "
              >
                <Search
                  size={18}
                  className="shrink-0 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="
                    ml-2
                    min-w-0 flex-1
                    bg-transparent
                    text-sm text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1">

                <Link
                  href="/internship"
                  onClick={closeMobileMenu}
                  className="
                    rounded-xl
                    px-4 py-3
                    text-sm font-semibold text-gray-700
                    transition-colors
                    hover:bg-blue-50 hover:text-blue-600
                  "
                >
                  Internships
                </Link>

                <Link
                  href="/job"
                  onClick={closeMobileMenu}
                  className="
                    rounded-xl
                    px-4 py-3
                    text-sm font-semibold text-gray-700
                    transition-colors
                    hover:bg-blue-50 hover:text-blue-600
                  "
                >
                  Jobs
                </Link>

                <Link
                  href="/public-space"
                  onClick={closeMobileMenu}
                  className="
                    flex items-center gap-3
                    rounded-xl
                    px-4 py-3
                    text-sm font-semibold text-gray-700
                    transition-colors
                    hover:bg-blue-50 hover:text-blue-600
                  "
                >
                  <Users size={18} />
                  Public Space
                </Link>

                {user && (
                  <Link
                    href="/subscription"
                    onClick={closeMobileMenu}
                    className="
                      mt-1
                      rounded-xl
                      bg-blue-600
                      px-4 py-3
                      text-center
                      text-sm font-bold text-white
                      transition-colors
                      hover:bg-blue-700
                    "
                  >
                    Plans
                  </Link>
                )}
              </div>

              {/* Mobile Auth */}
              <div className="mt-4 border-t border-gray-100 pt-4">

                {user ? (
                  <div className="flex items-center justify-between gap-3">

                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="
                        flex min-w-0 flex-1
                        items-center gap-3
                        rounded-xl
                        bg-gray-50
                        px-4 py-3
                        transition-colors
                        hover:bg-blue-50
                      "
                    >
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt="Profile"
                          className="
                            h-9 w-9
                            shrink-0
                            rounded-full
                            border-2 border-blue-500
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex h-9 w-9
                            shrink-0
                            items-center justify-center
                            rounded-full
                            bg-blue-600
                            text-sm font-bold
                            uppercase text-white
                          "
                        >
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}

                      <span className="truncate text-sm font-semibold text-gray-700">
                        {user.name || "My Profile"}
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                        shrink-0
                        rounded-xl
                        bg-red-500
                        px-4 py-3
                        text-sm font-semibold text-white
                        transition-colors
                        hover:bg-red-600
                      "
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="
                        rounded-xl
                        bg-blue-600
                        px-4 py-3
                        text-center
                        text-sm font-semibold text-white
                        hover:bg-blue-700
                      "
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="
                        rounded-xl
                        border border-blue-600
                        px-4 py-3
                        text-center
                        text-sm font-semibold text-blue-600
                        hover:bg-blue-50
                      "
                    >
                      Register
                    </Link>

                    <Link
                      href="/adminlogin"
                      onClick={closeMobileMenu}
                      className="
                        rounded-xl
                        border border-gray-300
                        px-4 py-3
                        text-center
                        text-sm font-semibold text-gray-700
                        hover:bg-gray-50
                      "
                    >
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;