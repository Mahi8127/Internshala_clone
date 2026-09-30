"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Phone, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!identifier.trim()) {
      toast.error(t("auth.forgotPassword.enterIdentifier"));
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://internshala-backend-5ycp.onrender.com//api/forgot-password",
        {
          identifier: identifier.trim(),
        }
      );

      toast.success(response.data.message);
      setNewPassword(response.data.password);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t("auth.forgotPassword.somethingWrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Back */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-6"
          >
            <ArrowLeft size={17} />
            {t("auth.forgotPassword.backToLogin")}
          </Link>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Lock size={26} className="text-gray-800" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("auth.forgotPassword.title")}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed">
              {t("auth.forgotPassword.subtitle")}
            </p>
          </div>

          {/* Identifier */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("auth.forgotPassword.identifierLabel")}
            </label>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>

              <input
                type="text"
                placeholder={t("auth.forgotPassword.identifierPlaceholder")}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleReset();
                  }
                }}
                disabled={loading}
                className="w-full h-12 border border-gray-200 rounded-xl pl-10 pr-4 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full h-12 bg-black text-white rounded-xl font-semibold text-sm sm:text-base transition hover:bg-gray-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
          </button>

          {/* New Password */}
          {newPassword && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={17} className="text-green-700" />

                <p className="font-semibold text-green-800">
                  {t("auth.forgotPassword.resetSuccess")}
                </p>
              </div>

              <p className="text-sm text-green-700 mb-3">
                {t("auth.forgotPassword.newPasswordIs")}
              </p>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  readOnly
                  className="w-full h-11 rounded-lg border border-green-200 bg-white px-3 pr-11 text-green-950 font-semibold outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  aria-label={
                    showPassword ? t("auth.forgotPassword.hidePassword") : t("auth.forgotPassword.showPassword")
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-3 text-xs text-green-700">
                {t("auth.forgotPassword.saveSecurely")}
              </p>
            </div>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-500">
              {t("auth.forgotPassword.rememberPassword")}{" "}
            </span>

            <Link
              href="/login"
              className="text-sm font-semibold text-black hover:underline"
            >
              {t("auth.forgotPassword.loginLink")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
