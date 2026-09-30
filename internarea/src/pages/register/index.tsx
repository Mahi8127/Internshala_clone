import axios from "axios";
import {
  Mail,
  Phone,
  User,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmpassword
    ) {
      toast.error(t("auth.register.fillAllFields"));
      return;
    }

    if (
      formData.password !==
      formData.confirmpassword
    ) {
      toast.error(t("auth.register.passwordsMismatch"));
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://internshala-backend-5ycp.onrender.com//api/register",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      toast.success(response.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmpassword: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            t("auth.register.somethingWrong")
        );
      } else {
        toast.error(t("auth.register.somethingWrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto flex w-full max-w-md items-center justify-center">

        <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">

          {/* ================= TOP ACCENT ================= */}

          <div className="h-1.5 w-full bg-blue-600" />

          <div className="p-5 sm:p-8">

            {/* ================= HEADER ================= */}

            <div className="mb-7 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <UserPlus
                  size={26}
                  className="text-blue-600"
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t("auth.register.title")}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {t("auth.register.subtitle")}
              </p>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* ================= NAME ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("auth.register.fullNameLabel")}
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder={t("auth.register.fullNamePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5 pl-11 pr-4
                      text-sm text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                </div>

              </div>

              {/* ================= EMAIL ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("auth.register.emailLabel")}
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder={t("auth.register.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5 pl-11 pr-4
                      text-sm text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                </div>

              </div>

              {/* ================= PHONE ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("auth.register.phoneLabel")}
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder={t("auth.register.phonePlaceholder")}
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="tel"
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5 pl-11 pr-4
                      text-sm text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                </div>

              </div>

              {/* ================= PASSWORD ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("auth.register.passwordLabel")}
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder={t("auth.register.passwordPlaceholder")}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5 pl-11 pr-12
                      text-sm text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? t("auth.register.hidePassword")
                        : t("auth.register.showPassword")
                    }
                    className="
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition
                      hover:text-slate-700
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* ================= CONFIRM PASSWORD ================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("auth.register.confirmPasswordLabel")}
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmpassword"
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    value={formData.confirmpassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3.5 pl-11 pr-12
                      text-sm text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? t("auth.register.hidePassword")
                        : t("auth.register.showPassword")
                    }
                    className="
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition
                      hover:text-slate-700
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* ================= REGISTER BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2
                  flex w-full
                  items-center justify-center gap-2
                  rounded-xl
                  bg-blue-600
                  px-4 py-3.5
                  text-sm font-bold text-white
                  shadow-sm
                  transition-all duration-200
                  hover:bg-blue-700
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading
                  ? t("auth.register.submitting")
                  : t("auth.register.submit")}

                {!loading && (
                  <ArrowRight size={17} />
                )}
              </button>

            </form>

            {/* ================= LOGIN ================= */}

            <div className="mt-7 text-center">

              <p className="text-sm text-slate-500">

                {t("auth.register.haveAccount")}{" "}

                <Link
                  href="/login"
                  className="
                    font-bold
                    text-blue-600
                    transition
                    hover:text-blue-700
                    hover:underline
                  "
                >
                  {t("auth.register.loginLink")}
                </Link>

              </p>

            </div>

          </div>
        </div>

      </div>

    </main>
  );
};

export default Index;