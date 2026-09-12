import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import { ArrowLeft, Clock, Globe, MapPin, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const index = () => {
  const user = useSelector(selectuser);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/login-history/${user.id}`,
        );
        setHistory(response.data.history);
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
      <div className="min-h-screen flex justify-center items-center text-2xl text-gray-900">
        Loading...
      </div>
    );
  }
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
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Login History
          </h1>

          <p className="text-gray-500 mb-8">
            View all devices that have accessed your account
          </p>

          {history?.length === 0 ? (
            <div className="text-center text-gray-500">
              No Login History Found.
            </div>
          ) : (
            <div className="space-y-5">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center font-semibold text-lg text-gray-700">
                        <Globe className="mr-2 text-blue-600" />
                        {item.browser} {item.browserVersion}
                      </div>

                      <div className="flex items-center mt-2 text-gray-600">
                        {item.deviceType === "Mobile" ? (
                          <Smartphone className="mr-2 h-5 w-5" />
                        ) : (
                          <Monitor className="mr-2 h-5 w-5" />
                        )}

                        {item.deviceName}
                      </div>

                      <div className="mt-2 text-gray-600">
                        {item.os} {item.osVersion}
                      </div>

                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        {item.ipAddress}
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center justify-end">
                        <Clock className="mr-2 h-4 w-4" />
                        {new Date(item.loginTime).toLocaleString()}
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
  );
};

export default index;
