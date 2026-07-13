import axios from "axios";
import { Building2, Calendar, FileText, Loader2, User } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState<any>({});
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setloading(true);
        const res = await axios.get(
          `https://internshala-clone-6qrv.onrender.com/api/application/${id}`,
        );
        setdata(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchdata();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">
          Loading application details...
        </span>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border">
        {/* Header */}
        <div className="border-b p-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={data?.user?.photo}
            alt="Applicant"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-gray-900">
              {data?.user?.name}
            </h1>

            <p className="text-gray-500 mt-1">Internship Application</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.status === "accepted"
                ? "bg-green-100 text-green-700"
                : data.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {data.status}
          </span>
        </div>

        {/* Information */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Building2 size={18} />
              <span>Company</span>
            </div>

            <p className="text-lg font-medium text-gray-900">{data.company}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Calendar size={18} />
              <span>Applied On</span>
            </div>

            <p className="text-lg font-medium text-gray-900">
              {data.createdAt && new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="border-t border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <FileText size={20} className="text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              Cover Letter
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <p className="text-gray-800 text-[16px] leading-8 whitespace-pre-wrap font-normal">
              {data.coverLetter}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
