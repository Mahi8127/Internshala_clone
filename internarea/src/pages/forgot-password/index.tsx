"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!identifier) {
      toast.error("Please enter email or phone number");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        {
          identifier,
        },
      );
      toast.success(response.data.message);
      setNewPassword(response.data.password);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Forgot Password
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your register email or phone number
        </p>

        <input
          type="text"
          placeholder="Enter Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 placeholder:text-gray-400 text-gray-900"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {newPassword && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg">
            <p className="font-semibold text-green-800">Your new password:</p>

            <p className="text-xl mt-2 text-green-950">{newPassword}</p>
          </div>
        )}
      </div>
    </div>
  );
}
