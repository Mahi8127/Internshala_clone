import axios from "axios";
import {
  Briefcase,
  Building2,
  MapPin,
  Tags,
  Info,
  Users,
  DollarSign,
  Calendar,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const index = () => {
  const router = useRouter();

  const [formData, setformdata] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    aboutCompany: "",
    aboutJob: "",
    whoCanApply: "",
    perks: "",
    numberofopening: "",
    CTC: "",
    startDate: "",
    AdditionalInfo: "",
  });

  const [isloading, setisloading] = useState(false);

  const handlechange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasemptyfields = Object.values(formData).some(
      (val) => !val.trim()
    );

    if (hasemptyfields) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      setisloading(true);

      await axios.post(
        "http://localhost:5000/api/job",
        formData
      );

      toast.success("Job posted successfully");

      setTimeout(() => {
        router.push("/adminpanel");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Error posting job");
    } finally {
      setisloading(false);
    }
  };

  const inputClass =
    "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const textareaClass =
    "mt-2 block w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/adminpanel")}
          className="mb-4 inline-flex min-h-[42px] items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Panel
        </button>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                <Briefcase className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Post New Job
                </h1>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Create a new job opportunity for candidates.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-8 p-5 sm:p-8"
            onSubmit={handlesubmit}
          >
            {/* ==========================================
                BASIC INFORMATION
            ========================================== */}

            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the basic information about the job.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Job Title
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handlechange}
                    className={inputClass}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Company Name
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handlechange}
                    className={inputClass}
                    placeholder="e.g. Tech Solution Inc."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Location
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handlechange}
                    className={inputClass}
                    placeholder="e.g. Mumbai, India"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Tags className="h-4 w-4 text-blue-600" />
                    Category
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handlechange}
                    className={inputClass}
                    placeholder="e.g. Software Development"
                  />
                </div>
              </div>
            </div>

            {/* ==========================================
                COMPANY & JOB DETAILS
            ========================================== */}

            <div className="border-t border-gray-100 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Company & Job Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Provide detailed information candidates need
                  to know.
                </p>
              </div>

              <div className="space-y-5">
                {/* About Company */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Info className="h-4 w-4 text-blue-600" />
                    About Company
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="aboutCompany"
                    value={formData.aboutCompany}
                    onChange={handlechange}
                    rows={5}
                    className={textareaClass}
                    placeholder="Describe your company..."
                  />
                </div>

                {/* About Job */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    About Job
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="aboutJob"
                    value={formData.aboutJob}
                    onChange={handlechange}
                    rows={5}
                    className={textareaClass}
                    placeholder="Describe the job role, responsibilities and work..."
                  />
                </div>
              </div>
            </div>

            {/* ==========================================
                ELIGIBILITY & PERKS
            ========================================== */}

            <div className="border-t border-gray-100 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Eligibility & Perks
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Define candidate eligibility and job benefits.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Who Can Apply */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Users className="h-4 w-4 text-blue-600" />
                    Who Can Apply
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="whoCanApply"
                    value={formData.whoCanApply}
                    onChange={handlechange}
                    rows={5}
                    className={textareaClass}
                    placeholder="Eligibility criteria..."
                  />
                </div>

                {/* Perks */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Info className="h-4 w-4 text-blue-600" />
                    Perks
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="perks"
                    value={formData.perks}
                    onChange={handlechange}
                    rows={5}
                    className={textareaClass}
                    placeholder="List the perks and benefits..."
                  />
                </div>
              </div>
            </div>

            {/* ==========================================
                JOB DETAILS
            ========================================== */}

            <div className="border-t border-gray-100 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Compensation & Availability
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add salary, openings and joining information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Openings */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Users className="h-4 w-4 text-blue-600" />
                    Number of Openings
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="numberofopening"
                    value={formData.numberofopening}
                    onChange={handlechange}
                    min="1"
                    className={inputClass}
                    placeholder="e.g. 5"
                  />
                </div>

                {/* CTC */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    CTC
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="CTC"
                    value={formData.CTC}
                    onChange={handlechange}
                    className={inputClass}
                    placeholder="e.g. ₹10 LPA"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Start Date
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handlechange}
                    className={inputClass}
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Info className="h-4 w-4 text-blue-600" />
                    Additional Information
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="AdditionalInfo"
                    value={formData.AdditionalInfo}
                    onChange={handlechange}
                    rows={4}
                    className={textareaClass}
                    placeholder="Any additional details..."
                  />
                </div>
              </div>
            </div>

            {/* ==========================================
                SUBMIT
            ========================================== */}

            <div className="border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={isloading}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-400 sm:w-auto sm:min-w-[200px]"
              >
                {isloading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Post Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default index;