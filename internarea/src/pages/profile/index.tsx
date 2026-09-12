import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import { ExternalLink, Mail, PhoneOutgoing, User, History } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface User {
  name: string;
  email: string;
  photo: string;
}

const index = () => {
  // const [user, setUser] = useState<User | null>({
  //   name: "Rahul",
  //   email: "xyz@gmail.com",
  //   photo:
  //     "http://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces,",
  // });

  const user = useSelector(selectuser);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/resume/${user.id}`,
        );
        setResume(response.data.resume);
      } catch (error) {
        console.log("Resume not found");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-linear-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-16 pb-8 px-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <div className="mt-2 flex items-center justify-center text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Profile details */}
            <div className="space-y-6">
              {/* Qucik Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    0
                  </span>
                  <p className="text-blue-600 text-sm mt-1">
                    Active Applications
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <span className="text-green-600 font-semibold text-2xl">
                    0
                  </span>
                  <p className="text-green-600 text-sm mt-1">
                    Acceptedd Applications
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-center pt-4">
                <Link
                  href={"/userapplication"}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View Applications
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Resume */}
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resume</h2>

                {loading ? (
                  <p className="text-gray-500">Checking resume...</p>
                ) : resume ? (
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/resume/view"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      View Resume
                    </Link>
                    <Link
                      href="/resume/edit"
                      className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit Resume
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No resume Created yet.</p>
                    <Link
                      href="/resume"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Resume
                    </Link>
                  </div>
                )}
              </div>

              {/* Security */}
              <div className="mt-10 border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Security
                </h2>
                <div className="space-y-5">
                  {/* LOGIN HISTORY */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-4 rounded-xl">
                        <History className="h-7 w-7 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Login History
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          View every login including browser, operating system,
                          device, IP address and login time.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/login-history"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
                    >
                      View
                    </Link>
                  </div>

                  {/* FORGOT PASSWORD */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 p-4 rounded-xl">
                        <History className="h-7 w-7 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Change Password
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Update your password to keep your account secure.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/change-password"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition"
                    >
                      Change
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
