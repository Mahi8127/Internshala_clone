"use client";

import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const user = useSelector(selectuser);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (currentPassword === newPassword) {
      return toast.error(
        "New password must be different from current password"
      );
    }

    try {
      setLoading(true);

      const response = await axios.put(
        "https://internshala-backend-5ycp.onrender.com/api/change-password",
        {
          userId: user.id,
          currentPassword,
          newPassword,
        }
      );

      toast.success(response.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    label,
    placeholder,
    value,
    onChange,
    show,
    setShow,
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    setShow: (value: boolean) => void;
  }) => {
    return (
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-800">
          {label}
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-10 pr-12 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-50"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-red-50">
                <Lock className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Change Password
                </h1>

                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Update your account password securely.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleChangePassword}
            className="p-6 sm:p-8 space-y-5"
          >
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              setShow={setShowNew}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              setShow={setShowConfirm}
            />

            {/* Password requirements */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-gray-700" />

                <p className="text-sm font-semibold text-gray-800">
                  Password requirements
                </p>
              </div>

              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• At least 6 characters</li>
                <li>• New and confirm passwords must match</li>
                <li>• New password should be different from the current password</li>
              </ul>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-semibold text-sm sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;