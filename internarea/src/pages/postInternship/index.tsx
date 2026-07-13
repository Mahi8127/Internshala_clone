import axios from "axios";
import {
  User,
  Lock,
  Briefcase,
  Building2,
  MapPin,
  Tags,
  Info,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const index = () => {
  const [formData, setformdata] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    aboutCompany: "",
    aboutInternship: "",
    whoCanApply: "",
    perks: "",
    numberOfOpening: "",
    stipend: "",
    startDate: "",
    additionalInfo: "",
  });
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const router = useRouter();
  const [isloading, setisloading] = useState(false);

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasemptyfields = Object.values(formData).some((val) => !val.trim());
    if (hasemptyfields) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      setisloading(true);

      const res = await axios.post(
        "https://internshala-clone-6qrv.onrender.com/api/internship",
        formData,
      );

      toast.success("Internsship posted successfully");

      setTimeout(() => {
        router.push("/adminpanel");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Error posting internship");
    } finally {
      setisloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Post New Internship
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a new internship opportunity for students
            </p>
          </div>

          <form className="space-y-6" onSubmit={handlesubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Briefcase className="h-4 w-4 mr-1" />
                      Title*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Frontend Developer Intern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      Company Name*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Tech Solution Inc"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Mumbai, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center mb-1">
                      <Tags className="h-4 w-4 mr-1" />
                      Category*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handlechange}
                    className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. Software Development"
                  />
                </div>
              </div>
            </div>
            {/* Company & Internship Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    About Company*
                  </div>
                </label>
                <textarea
                  name="aboutCompany"
                  value={formData.aboutCompany}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe your company..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    About Internship*
                  </div>
                </label>
                <textarea
                  name="aboutInternship"
                  value={formData.aboutInternship}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe the internship role..."
                />
              </div>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    Who Can Apply*
                  </div>
                </label>
                <textarea
                  name="whoCanApply"
                  value={formData.whoCanApply}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Eligibility criteria..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    Perks*
                  </div>
                </label>
                <textarea
                  name="perks"
                  value={formData.perks}
                  onChange={handlechange}
                  rows={4}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="List the perks..."
                />
              </div>
            </div>

            {/* Final Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    Number of Opening*
                  </div>
                </label>
                <input
                  type="number"
                  name="numberOfOpening"
                  value={formData.numberOfOpening}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Stipend*
                  </div>
                </label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. ₹15,000/month"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Start Date*
                  </div>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1" />
                    Additional Information*
                  </div>
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handlechange}
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isloading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition"
              >
                {isloading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isloading ? "Posting Internship..." : "Post Internship"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;
