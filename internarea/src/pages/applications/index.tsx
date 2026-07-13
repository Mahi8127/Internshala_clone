import axios from "axios";
import { Building2, Calendar, CheckCircle2, Mail, Tag, User, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// const Applications = [
//   {
//     _id: "1",
//     company: "Tech Corp",
//     category: "Software",
//     user: { name: "John Doe", email: "john@example.com" },
//     createAt: "2024-03-10T12:00:00Z",
//     status: "approved",
//   },
//   {
//     _id: "2",
//     company: "Health Solutions",
//     category: "Healthcare",
//     user: { name: "Jane Smith", email: "jane@example.com" },
//     createAt: "2024-03-08T10:30:00Z",
//     status: "pending",
//   },
//   {
//     _id: "3",
//     company: "EduLearn",
//     category: "Education",
//     user: { name: "Alice Johnson", email: "alice@example.com" },
//     createAt: "2024-03-05T09:15:00Z",
//     status: "rejected",
//   },
// ];

const getStatusColor = (status: any) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};
const index = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [data, setdata] = useState<any>([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("https://internshala-clone-6qrv.onrender.com/api/application");
        setdata(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);
  const filteredapplications = data.filter((application:any) => {
    const searchmatch =
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return searchmatch;
    return searchmatch && application.status.toLowerCase() === filter;
  });
  
  const handelacceptandreject = async(id:any, action:any)=>{
    try{
      const res = await axios.put(`https://internshala-clone-6qrv.onrender.com/api/application/${id}`,{action})
      const updateapplication= data.map((app:any)=>
        app._id === id ? res.data.data:app)
      setdata(updateapplication)
      toast.success("Updated Sucessfully")
    }catch(error){
      console.log(error)
      toast.error("Error Updating")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="mt-1 text-ssm text-gray-500">
              Manage and review all applications
            </p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setsearchTerm(e.target.value)}
                    placeholder="Search by company, category, or applicant...."
                    className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="absolute top-3 left-3 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("accepted")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "accpeted"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  accepted
                </button>
                <button
                  onClick={() => setFilter("rejected")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Application List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Company & category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applied Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredapplications.map((application:any) => (
                <tr key={application._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.company}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Tag className="h-4 w-4 mr-1" />
                          {application.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(application.createdAt).toISOString().split("T")[0]}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Link href={`/detailapplication/${application._id}`} className="text-blue-600 hover:text-blue-900">View Details</Link>
                      <button onClick={()=> {handelacceptandreject(application._id,"accepted")}} className="text-green-600 hover:text-green-900">
                        <CheckCircle2 className="h-5 w-5"/>
                      </button>
                      <button onClick={()=> {handelacceptandreject(application._id,"rejected")}} className="text-red-600 hover:text-red-900">
                        <XCircle className="h-5 w-5"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default index;
