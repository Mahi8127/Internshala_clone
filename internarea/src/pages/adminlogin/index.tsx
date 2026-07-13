import axios from "axios";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const index = () => {
  const [formdata, setformdata] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [isloading, setisloading] = useState(false);
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formdata.username || !formdata.password) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      setisloading(true);

      const res = await axios.post(
        "https://internshala-clone-6qrv.onrender.com/api/admin/adminlogin",
        formdata,
      );

      toast.success("Logged in successfully");

      setTimeout(() => {
        router.push("/adminpanel");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    } finally {
      setisloading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-500">
            Access the admin dashboard to manage internships and applications
          </p>
        </div>

        <form className="space-y-6" onSubmit={handlesubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="username"
                name="username"
                value={formdata.username}
                onChange={handlechange}
                placeholder="Enter Your Username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                id="password"
                name="password"
                value={formdata.password}
                onChange={handlechange}
                placeholder="Enter Your Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isloading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition"
            >
              {isloading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isloading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default index;
