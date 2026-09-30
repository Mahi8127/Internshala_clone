"use client";

import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowRight,
  ExternalLink,
  History,
  Mail,
  Lock,
  User,
  FileText,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Index = () => {
  const user = useSelector(selectuser);

  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://internshala-backend-5ycp.onrender.com/api/resume/${user.id}`
        );

        setResume(response.data.resume);
      } catch (error) {
        console.log("Resume not found");
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [user]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Cover */}
          <div className="relative h-28 sm:h-36 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-20 w-60 h-60 rounded-full border-[40px] border-white" />
            </div>

            {/* Profile Image */}
            <div className="absolute left-1/2 -bottom-12 -translate-x-1/2">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name || "Profile"}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl object-cover bg-gray-100"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="pt-16 sm:pt-20 px-5 sm:px-8 pb-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {user?.name || "User"}
              </h1>

              <div className="mt-2 flex items-center justify-center gap-2 text-gray-500 text-sm sm:text-base break-all">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{user?.email || "No email available"}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 mt-8">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 sm:p-5 text-center">
                <span className="block text-2xl sm:text-3xl font-bold text-blue-600">
                  0
                </span>

                <p className="mt-1 text-xs sm:text-sm font-medium text-blue-600">
                  Active Applications
                </p>
              </div>

              <div className="rounded-xl bg-green-50 border border-green-100 p-4 sm:p-5 text-center">
                <span className="block text-2xl sm:text-3xl font-bold text-green-600">
                  0
                </span>

                <p className="mt-1 text-xs sm:text-sm font-medium text-green-600">
                  Accepted Applications
                </p>
              </div>
            </div>

            {/* Applications */}
            <section className="mt-8 border-t border-gray-100 pt-7">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Applications
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Track your internship and job applications.
                  </p>
                </div>
              </div>

              <Link
                href="/userapplication"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition active:scale-[0.99]"
              >
                View Applications
                <ExternalLink className="w-4 h-4" />
              </Link>
            </section>

            {/* Resume */}
            <section className="mt-8 border-t border-gray-100 pt-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Resume
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage your professional resume.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 text-center">
                  <p className="text-sm text-gray-500">
                    Checking resume...
                  </p>
                </div>
              ) : resume ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/resume/view"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                  >
                    View Resume
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/resume/edit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                  >
                    Edit Resume
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 text-center">
                  <FileText className="mx-auto w-9 h-9 text-gray-400 mb-3" />

                  <p className="text-gray-600 font-medium">
                    No resume created yet.
                  </p>

                  <p className="text-sm text-gray-400 mt-1 mb-4">
                    Create a resume before applying to opportunities.
                  </p>

                  <Link
                    href="/resume"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    Create Resume
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </section>

            {/* Security */}
            <section className="mt-8 border-t border-gray-100 pt-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Security
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage your account security.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Login History */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                        <History className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          Login History
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          View browser, operating system, device, IP address
                          and login time.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/login-history"
                      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                    >
                      View
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Change Password */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-lg bg-red-50">
                        <Lock className="h-5 w-5 text-red-600" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          Change Password
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          Update your password to keep your account secure.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/change-password"
                      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                    >
                      Change
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;