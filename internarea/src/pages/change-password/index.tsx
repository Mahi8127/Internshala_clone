import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const index = () => {
  const user = useSelector(selectuser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Password do no match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/change-password",
        {
          userId: user.id,
          currentPassword,
          newPassword,
        },
      );
      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went Wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Profile
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="bg-red-100 p-3 rounded-full">
              <Lock className="text-red-600 h-7 w-7" />
            </div>

            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
              <p className="text-gray-500">
                Update your account password securely
              </p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-900">Current Password</label>
              <input
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 text-gray-800"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-900">New Password</label>
              <input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 text-gray-800"
                placeholder="Enter New password"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-900">Confirm Password</label>
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 text-gray-800"
                placeholder="Confirm New password"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                {loading ? "Updating...":"Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
