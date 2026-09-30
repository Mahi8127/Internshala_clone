"use client";

import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Index = () => {
  const user = useSelector(selectuser);

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://internshala-backend-5ycp.onrender.com//api/login-history/${user.id}`
        );

        setHistory(response.data.history || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />

          <p className="text-gray-600 font-medium">
            Loading login history...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Login History
                </h1>

                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  View all devices that have accessed your account.
                </p>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="p-5 sm:p-8">
            {history.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <Clock className="h-7 w-7 text-gray-400" />
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  No Login History Found
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your account login activity will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition bg-white"
                  >
                    {/* Top section */}
                    <div className="flex flex-col gap-4">
                      {/* Browser */}
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                            {item.browser || "Unknown Browser"}{" "}
                            {item.browserVersion || ""}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Browser
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Device */}
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <div className="flex items-center gap-2">
                            {item.deviceType === "Mobile" ? (
                              <Smartphone className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Monitor className="h-4 w-4 text-gray-600" />
                            )}

                            <span className="text-xs font-medium text-gray-500">
                              Device
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-gray-800 break-words">
                            {item.deviceName || "Unknown Device"}
                          </p>

                          {item.deviceType && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.deviceType}
                            </p>
                          )}
                        </div>

                        {/* Operating System */}
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-600" />

                            <span className="text-xs font-medium text-gray-500">
                              Operating System
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-gray-800 break-words">
                            {item.os || "Unknown OS"}{" "}
                            {item.osVersion || ""}
                          </p>
                        </div>

                        {/* IP Address */}
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-600" />

                            <span className="text-xs font-medium text-gray-500">
                              IP Address
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-gray-800 break-all">
                            {item.ipAddress || "Unknown"}
                          </p>
                        </div>

                        {/* Login Time */}
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-600" />

                            <span className="text-xs font-medium text-gray-500">
                              Login Time
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-gray-800 break-words">
                            {item.loginTime
                              ? new Date(item.loginTime).toLocaleString()
                              : "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;