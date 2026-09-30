import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import {
  Search,
  Users,
  Menu,
  X,
  Globe2,
  ChevronDown,
  Lock,
} from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectuser, logout } from "@/Feature/Userslice";
import { useLanguage } from "@/context/LanguageContext";
import LanguageOtpModal from "@/Components/LanguageOtpModal";

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();

  const dispatch = useDispatch();
  const user = useSelector(selectuser);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const [mobileLanguageOpen, setMobileLanguageOpen] =
    useState(false);

  const [languageOtpOpen, setLanguageOtpOpen] =
    useState(false);

  const [sendingLanguageOtp, setSendingLanguageOtp] =
    useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const desktopLangRef =
    useRef<HTMLDivElement>(null);

  /*
    Close dropdowns on outside click or escape key
  */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopLangRef.current &&
        !desktopLangRef.current.contains(
          event.target as Node
        )
      ) {
        setLanguageOpen(false);
      }

      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node
        )
      ) {
        setMobileMenuOpen(false);
        setMobileLanguageOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setMobileMenuOpen(false);
        setMobileLanguageOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /*
    Available languages
  */
  const languages = [
    {
      name: "English",
      code: "en",
      flag: "🇬🇧",
      locked: false,
    },
    {
      name: "Español",
      code: "es",
      flag: "🇪🇸",
      locked: false,
    },
    {
      name: "हिन्दी",
      code: "hi",
      flag: "🇮🇳",
      locked: false,
    },
    {
      name: "Português",
      code: "pt",
      flag: "🇧🇷",
      locked: false,
    },
    {
      name: "中文",
      code: "zh",
      flag: "🇨🇳",
      locked: false,
    },
    {
      name: "Français",
      code: "fr",
      flag: "🇫🇷",
      locked: true,
    },
  ];

  /*
    Get language name from current language code.
  */
  const currentLanguage =
    languages.find(
      (item) => item.code === language
    ) || languages[0];

  /*
    Login
  */
  const handlelogin = async () => {
    try {
      await signInWithPopup(auth, provider);

      toast.success(
        t("navbar.loginSuccess")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("navbar.loginFailed")
      );
    }
  };

  /*
    Logout
  */
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout());

    toast.success(
      t("navbar.logoutSuccess")
    );

    window.location.href = "/";
  };

  /*
    Close mobile menu
  */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileLanguageOpen(false);
  };

  /*
    Send French language OTP
  */
  const sendFrenchOTP = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please log in before switching to French."
      );
      return;
    }

    try {
      setSendingLanguageOtp(true);

      const response = await fetch(
        "http://internshala-backend-5ycp.onrender.com//api/language/send-otp",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            "Failed to send verification OTP."
        );
        return;
      }

      if (data.success) {
        setLanguageOpen(false);
        setMobileLanguageOpen(false);

        setLanguageOtpOpen(true);

        toast.success(
          "Verification code sent to your email."
        );
      }
    } catch (error) {
      console.error(
        "Send language OTP error:",
        error
      );

      toast.error(
        "Unable to send verification code."
      );
    } finally {
      setSendingLanguageOtp(false);
    }
  };

  /*
    Handle language selection
  */
  const handleLanguageSelect = async (selected: {
    name: string;
    code: string;
    flag: string;
    locked: boolean;
  }) => {
    /*
      French requires email verification.
    */
    if (selected.locked) {
      await sendFrenchOTP();
      return;
    }

    /*
      Update global language.
    */
    setLanguage(
      selected.code as
        | "en"
        | "es"
        | "hi"
        | "pt"
        | "zh"
        | "fr"
    );

    setLanguageOpen(false);
    setMobileLanguageOpen(false);

    toast.success(`${selected.name}`);
  };

  return (
    <header
      ref={headerRef}
      className="relative z-50 w-full"
    >
      <nav className="w-full border-b border-gray-200 bg-white shadow-sm">
        {/* ================= MAIN NAVBAR ================= */}

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">

            {/* ================= LOGO ================= */}

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex h-10 shrink-0 items-center overflow-hidden sm:h-12 lg:h-14"
            >
              <img
                src="/logo.png"
                alt="Internship Platform"
                className="
                  h-full
                  w-auto
                  max-h-10
                  max-w-[130px]
                  object-contain
                  object-left
                  sm:max-h-12
                  sm:max-w-[160px]
                  lg:max-h-14
                  lg:max-w-[185px]
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
                {t("navbar.opt1")}

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
                {t("navbar.opt2")}

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
                  className="text-gray-500"
                />

                <span>
                  {t("navbar.opt3")}
                </span>
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
                  {t("navbar.opt4")}
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
                  placeholder={t("navbar.search")}
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

            {/* ================= DESKTOP LANGUAGE ================= */}

            <div
              ref={desktopLangRef}
              className="relative hidden shrink-0 lg:block"
            >
              <button
                type="button"
                onClick={() =>
                  setLanguageOpen(
                    !languageOpen
                  )
                }
                className="
                  flex items-center gap-2
                  rounded-lg
                  border border-gray-200
                  bg-white
                  px-3 py-2.5
                  text-sm font-semibold text-gray-700
                  shadow-sm
                  transition-all duration-200
                  hover:border-blue-300
                  hover:bg-blue-50
                  hover:text-blue-600
                "
              >
                <Globe2 size={18} />

                <span>
                  {currentLanguage.flag}{" "}
                  {currentLanguage.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`
                    transition-transform duration-200
                    ${
                      languageOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {languageOpen && (
                <div
                  className="
                    absolute right-0 top-full mt-2
                    w-56
                    overflow-hidden
                    rounded-xl
                    border border-gray-200
                    bg-white
                    shadow-xl
                  "
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {t("navbar.lan")}
                    </p>
                  </div>

                  <div className="p-2">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() =>
                          handleLanguageSelect(item)
                        }
                        disabled={
                          sendingLanguageOtp
                        }
                        className={`
                          flex w-full items-center justify-between
                          rounded-lg
                          px-3 py-2.5
                          text-left
                          transition-colors
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          ${
                            item.locked
                              ? "text-gray-500 hover:bg-gray-50"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">
                            {item.flag}
                          </span>

                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </span>

                        {item.locked && (
                          <Lock
                            size={15}
                            className="text-gray-400"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ================= DESKTOP AUTH ================= */}

            <div className="hidden shrink-0 items-center lg:flex">
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
                        {user.name?.charAt(0) ||
                          "U"}
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
                    {t("navbar.logout")}
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
                    {t("navbar.signin")}
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
                    {t("navbar.register")}
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
                    {t("navbar.admin")}
                  </Link>
                </div>
              )}
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              aria-label={t(
                "navbar.toggleMenu"
              )}
              aria-expanded={
                mobileMenuOpen
              }
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
                  placeholder={t(
                    "navbar.search"
                  )}
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
                  {t("navbar.opt1")}
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
                  {t("navbar.opt2")}
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

                  {t("navbar.opt3")}
                </Link>

                {/* Mobile Language */}

                <div className="mt-1">

                  <button
                    type="button"
                    onClick={() =>
                      setMobileLanguageOpen(
                        !mobileLanguageOpen
                      )
                    }
                    className="
                      flex w-full items-center justify-between
                      rounded-xl
                      px-4 py-3
                      text-sm font-semibold text-gray-700
                      transition-colors
                      hover:bg-blue-50 hover:text-blue-600
                    "
                  >
                    <span className="flex items-center gap-3">
                      <Globe2 size={18} />

                      <span>
                        {t("navbar.opt5")}:{" "}
                        {currentLanguage.name}
                      </span>
                    </span>

                    <ChevronDown
                      size={18}
                      className={`
                        transition-transform duration-200
                        ${
                          mobileLanguageOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {mobileLanguageOpen && (
                    <div
                      className="
                        mt-1
                        rounded-xl
                        border border-gray-200
                        bg-gray-50
                        p-2
                      "
                    >
                      {languages.map(
                        (item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() =>
                              handleLanguageSelect(
                                item
                              )
                            }
                            disabled={
                              sendingLanguageOtp
                            }
                            className="
                              flex w-full items-center
                              justify-between
                              rounded-lg
                              px-3 py-3
                              text-left
                              text-sm
                              transition-colors
                              hover:bg-white
                              disabled:cursor-not-allowed
                              disabled:opacity-60
                            "
                          >
                            <span className="flex items-center gap-3">

                              <span className="text-lg">
                                {item.flag}
                              </span>

                              <span className="font-medium text-gray-700">
                                {item.name}
                              </span>

                            </span>

                            {item.locked && (
                              <Lock
                                size={15}
                                className="text-gray-400"
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {user && (
                  <Link
                    href="/subscription"
                    onClick={
                      closeMobileMenu
                    }
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
                    {t("navbar.opt4")}
                  </Link>
                )}
              </div>

              {/* Mobile Auth */}

              <div className="mt-4 border-t border-gray-100 pt-4">

                {user ? (
                  <div className="flex items-center justify-between gap-3">

                    <Link
                      href="/profile"
                      onClick={
                        closeMobileMenu
                      }
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
                          {user.name?.charAt(
                            0
                          ) || "U"}
                        </div>
                      )}

                      <span className="truncate text-sm font-semibold text-gray-700">
                        {user.name ||
                          t(
                            "navbar.myProfile"
                          )}
                      </span>
                    </Link>

                    <button
                      onClick={
                        handleLogout
                      }
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
                      {t("navbar.logout")}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

                    <Link
                      href="/login"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        rounded-xl
                        bg-blue-600
                        px-4 py-3
                        text-center
                        text-sm font-semibold text-white
                        hover:bg-blue-700
                      "
                    >
                      {t("navbar.signin")}
                    </Link>

                    <Link
                      href="/register"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        rounded-xl
                        border border-blue-600
                        px-4 py-3
                        text-center
                        text-sm font-semibold text-blue-600
                        hover:bg-blue-50
                      "
                    >
                      {t("navbar.register")}
                    </Link>

                    <Link
                      href="/adminlogin"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        rounded-xl
                        border border-gray-300
                        px-4 py-3
                        text-center
                        text-sm font-semibold text-gray-700
                        hover:bg-gray-50
                      "
                    >
                      {t("navbar.admin")}
                    </Link>

                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ================= FRENCH OTP MODAL ================= */}

      {languageOtpOpen && (
        <LanguageOtpModal
          onClose={() => {
            setLanguageOtpOpen(false);
          }}
          onVerified={() => {
            setLanguage("fr");
            setLanguageOtpOpen(false);

            toast.success(
              "French language selected."
            );
          }}
        />
      )}
    </header>
  );
};

export default Navbar;