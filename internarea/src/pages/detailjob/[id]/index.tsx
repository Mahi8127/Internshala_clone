import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const index = () => {
  const router = useRouter();
  const { id } = router.query;

  const [jobData, setjob] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);

  const user = useSelector(selectuser);

  // Subscription
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  // Application modal
  const [availability, setAvailability] = useState(
    "Yes, I am available to join immediately"
  );
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  // --------------------------------------------------
  // FETCH JOB
  // --------------------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchdata = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/job/${id}`
        );

        setjob(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load job");
      }
    };

    fetchdata();
  }, [id]);

  // --------------------------------------------------
  // FETCH RESUME
  // --------------------------------------------------
  useEffect(() => {
    if (!user?.id) return;

    const fetchResume = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/resume/${user.id}`
        );

        setResume(res.data.resume);
      } catch (error: any) {
        console.log(
          "Resume Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchResume();
  }, [user]);

  // --------------------------------------------------
  // FETCH SUBSCRIPTION
  // --------------------------------------------------
  useEffect(() => {
    if (!user?.id) {
      setSubscriptionLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/payment/subscription/${user.id}`
        );

        if (res.data.success) {
          setSubscription(res.data.subscription);
        }
      } catch (error) {
        console.error("Subscription fetch error:", error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // --------------------------------------------------
  // CHECK APPLICATION LIMIT
  // --------------------------------------------------
  const limitReached =
    !!subscription &&
    subscription.monthlyApplicationLimit !== null &&
    subscription.applicationsUsed >=
      subscription.monthlyApplicationLimit;

  // --------------------------------------------------
  // APPLY BUTTON
  // --------------------------------------------------
  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please login first to apply.");
      setIsModelOpen(true);
      return;
    }

    if (subscriptionLoading) {
      toast("Checking your subscription...");
      return;
    }

    setIsModelOpen(true);
  };

  // --------------------------------------------------
  // SUBMIT APPLICATION
  // --------------------------------------------------
  const handlesubmitapplication = async () => {
    // Login check
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    // Subscription check
    if (!subscription) {
      toast.error(
        "Unable to verify your subscription. Please try again."
      );
      return;
    }

    // Application limit
    if (limitReached) {
      toast.error(
        `Monthly application limit reached for your ${subscription.plan} plan.`
      );
      return;
    }

    // Resume check
    if (!resume?.resumeUrl) {
      toast.error("Please create/generate your resume first.");
      return;
    }

    // Cover letter
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter.");
      return;
    }

    // Availability
    if (!availability) {
      toast.error("Please select your availability.");
      return;
    }

    try {
      const applicationdata = {
        category: jobData.category,
        company: jobData.company,
        coverLetter: coverLetter,
        user: user,
        resume: resume.resumeUrl,
        Application: id,
        availability,
      };

      await axios.post(
        "http://localhost:5000/api/application",
        applicationdata
      );

      toast.success("Application submitted successfully!");

      // Update local usage
      setSubscription((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          applicationsUsed: prev.applicationsUsed + 1,
        };
      });

      setIsModelOpen(false);
      setCoverLetter("");

      router.push("/job");
    } catch (error: any) {
      console.error(error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      // Backend subscription limit
      if (status === 403) {
        toast.error(
          message || "Monthly application limit reached."
        );

        // Refresh subscription
        try {
          const res = await axios.get(
            `http://localhost:5000/api/payment/subscription/${user.id}`
          );

          if (res.data.success) {
            setSubscription(res.data.subscription);
          }
        } catch (subscriptionError) {
          console.error(subscriptionError);
        }

        return;
      }

      toast.error(
        message || "Failed to submit application."
      );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <ArrowUpRight className="h-5 w-5" />
            <span className="font-medium">
              Actively Hiring
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {jobData.title}
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            {jobData.company}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{jobData.location}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>CTC {jobData.CTC}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{jobData.startDate}</span>
            </div>

          </div>

          <div className="mt-4 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />

            <span className="text-green-500 text-sm">
              Posted on {jobData?.createdAt?.split("T")[0]}
            </span>
          </div>
        </div>

        {/* Company Section */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About {jobData.company}
          </h2>

          <div className="flex items-center space-x-2 mb-4">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Visit Company Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-gray-600">
            {jobData.aboutCompany}
          </p>
        </div>

        {/* Job Details */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About the Job
          </h2>

          <p className="text-gray-600 mb-6">
            {jobData.aboutJob}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Who can apply
          </h3>

          <p className="text-gray-600 mb-6">
            {jobData.whoCanApply}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Perks
          </h3>

          <p className="text-gray-600 mb-6">
            {jobData.perks}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Additional Information
          </h3>

          <p className="text-gray-600 mb-6">
            {jobData.AdditionalInfo}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Number of Opening
          </h3>

          <p className="text-gray-600 mb-6">
            {jobData.numberofopening}
          </p>
        </div>

        {/* Apply Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={handleApplyClick}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {isModelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold text-gray-900">
                  Apply to {jobData.company}
                </h2>

                <button
                  onClick={() => setIsModelOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>

              </div>
            </div>

            <div className="p-6 px-8 space-y-6">

              {/* Login Required */}
              {!user ? (
                <div className="border rounded-lg p-6 bg-blue-50 text-center">

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Login Required
                  </h3>

                  <p className="text-gray-600 mb-4">
                    Please login or create an account before applying.
                  </p>

                  <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign up / Login
                  </Link>

                </div>
              ) : (
                <>
                  {/* Subscription Usage */}
                  <div className="border rounded-lg p-4 bg-blue-50">

                    <div className="flex justify-between items-center">

                      <div>
                        <p className="text-sm text-gray-500">
                          Current Plan
                        </p>

                        <p className="text-lg font-bold text-gray-900 capitalize">
                          {subscriptionLoading
                            ? "Checking..."
                            : subscription?.plan || "Free"}
                        </p>
                      </div>

                      <div className="text-right">

                        <p className="text-sm text-gray-500">
                          Applications
                        </p>

                        {subscriptionLoading ? (
                          <p className="font-semibold text-gray-900">
                            Checking...
                          </p>
                        ) : subscription?.monthlyApplicationLimit ===
                          null ? (
                          <p className="font-semibold text-green-600">
                            Unlimited
                          </p>
                        ) : (
                          <p
                            className={`font-semibold ${
                              limitReached
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {subscription?.applicationsUsed || 0} /{" "}
                            {subscription?.monthlyApplicationLimit || 0}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* Limit Reached */}
                    {limitReached && (
                      <div className="mt-4 border-t pt-4">

                        <p className="text-red-600 font-medium mb-3">
                          You have reached your monthly application
                          limit.
                        </p>

                        <Link
                          href="/subscription"
                          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Upgrade Plan
                        </Link>

                      </div>
                    )}

                  </div>

                  {/* Resume Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your Resume
                    </h3>

                    {resume?.resumeUrl ? (
                      <div className="border rounded-lg p-4 flex justify-between items-center bg-gray-50">

                        <div>
                          <p className="font-semibold text-gray-800">
                            {resume.fullname}'s Resume
                          </p>

                          <p className="text-sm text-green-600">
                            Generated resume attached
                          </p>
                        </div>

                        <a
                          href={`http://localhost:5000/uploads/resume/${resume.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          View Resume
                        </a>

                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-red-50">
                        <p className="text-red-600">
                          No generated resume found.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Cover Letter
                    </h3>

                    <p className="text-gray-600 mb-2">
                      Why should you be selected for this job?
                    </p>

                    <textarea
                      value={coverLetter}
                      onChange={(e) =>
                        setCoverLetter(e.target.value)
                      }
                      placeholder="Write your cover letter here"
                      className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your Availability
                    </h3>

                    <div className="space-y-3">

                      {[
                        "Yes, I am available to join immediately",
                        "No, I am currently on notice period",
                        "No, I will have to serve notice period",
                        "Other",
                      ].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="availability"
                            value={option}
                            checked={availability === option}
                            onChange={(e) =>
                              setAvailability(e.target.value)
                            }
                            className="h-4 w-4 text-blue-600"
                          />

                          <span className="text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}

                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-4">

                    {limitReached ? (
                      <Link
                        href="/subscription"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Upgrade Plan
                      </Link>
                    ) : (
                      <button
                        className={`px-6 py-2 rounded-lg ${
                          subscriptionLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                        onClick={handlesubmitapplication}
                        disabled={subscriptionLoading}
                      >
                        {subscriptionLoading
                          ? "Checking Plan..."
                          : "Submit Application"}
                      </button>
                    )}

                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;