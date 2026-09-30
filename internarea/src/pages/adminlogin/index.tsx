import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";
import { User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const {t} = useLanguage()
  const [formdata, setformdata] = useState({
    username: "",
    password: "",
  });

  const [isloading, setisloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formdata.username || !formdata.password) {
      toast.error(t("adminlogin.fillAll"));
      return;
    }

    try {
      setisloading(true);

      await axios.post("http://internshala-backend-5ycp.onrender.com//api/admin/adminlogin", formdata);

      toast.success(t("adminlogin.loginSuccess"));

      setTimeout(() => {
        router.push("/adminpanel");
      }, 1000);
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(t("adminlogin.invalidCredentials"));
    } finally {
      setisloading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      {/* Background decoration */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      {/* Login Card */}

      <div className="relative w-full max-w-md">
        {/* Security badge */}

        <div className="mb-5 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
            <ShieldCheck className="h-4 w-4" />
            {t("adminlogin.adminportal")}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
          {/* Header */}

          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 py-8 text-center text-white sm:px-8 sm:py-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("adminlogin.adminlogi")}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-blue-100">
              {t("adminlogin.admindescription")}
            </p>
          </div>

          {/* Form */}

          <div className="p-5 sm:p-8">
            <form className="space-y-5" onSubmit={handlesubmit}>
              {/* Username */}

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {t("adminlogin.username")}
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formdata.username}
                    onChange={handlechange}
                    placeholder={t("adminlogin.usernamedesc")}
                    autoComplete="username"
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {t("adminlogin.password")}
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formdata.password}
                    onChange={handlechange}
                    placeholder={t("adminlogin.passworddesc")}
                    autoComplete="current-password"
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? t("adminlogin.hidePassword")
                        : t("adminlogin.showPassword")
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={isloading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {isloading && (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}

                {isloading ? t("adminlogin.isloading") : t("adminlogin.loading")}
              </button>
            </form>

            {/* Security note */}

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                <p className="text-xs leading-5 text-slate-500">
                  {t("adminlogin.adminsecure")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">{t("adminlogin.adminportalname")}</p>
      </div>
    </main>
  );
};

export default AdminLogin;
