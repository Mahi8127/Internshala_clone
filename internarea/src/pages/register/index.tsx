import axios, { AxiosError } from "axios";
import { Mail, Phone, User, Lock, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

const index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });
  const [showpassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
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
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Your Account
          </h1>
          <p className="text-gray-500 mt-2">Register to get started</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div>
            <label className="font-medium text-gray-700">Full Name</label>
            <div className="relative mt-2">
              <User
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="text-gray-600 w-full border rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="font-medium text-gray-700">Email</label>
            <div className="relative mt-2">
              <Mail
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="text-gray-600 w-full border rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="font-medium text-gray-700">Phone Number</label>
            <div className="relative mt-2">
              <Phone
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="text-gray-600 w-full border rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-gray-700">Password</label>
            <div className="relative mt-2">
              <Lock
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type={showpassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="text-gray-600 w-full border rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showpassword)}
                className="absolute right-3 top-4 text-gray-700"
              >
                {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <Lock
                size={20}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                placeholder="Enter your password"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="text-gray-600 w-full border rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-4 text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?
            <Link
              className="text-blue-600 font-semibold hover:underline"
              href={""}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default index;
