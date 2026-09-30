import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  IndianRupee,
  MapPin,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <div className="mt-0.5 shrink-0 text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="border-b border-gray-100 p-5 sm:p-6 lg:p-7 last:border-b-0">
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
        {title}
      </h2>

      <div className="text-sm leading-7 text-gray-600 sm:text-base">
        {children}
      </div>
    </section>
  );
};

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
  const [submitting, setSubmitting] = useState(false);

  // --------------------------------------------------
  // FETCH JOB
  // --------------------------------------------------
  useEffect(() => {
    if (!id) return;

    const fetchdata = async () => {
      try {
        const res = await axios.get(
          `https://internshala-backend-5ycp.onrender.com/api/job/${id}`
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
          `https://internshala-backend-5ycp.onrender.com/api/resume/${user.id}`
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
          `https://internshala-backend-5ycp.onrender.com/api/payment/subscription/${user.id}`
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
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (!subscription) {
      toast.error(
        "Unable to verify your subscription. Please try again."
      );
      return;
    }

    if (limitReached) {
      toast.error(
        `Monthly application limit reached for your ${subscription.plan} plan.`
      );
      return;
    }

    if (!resume?.resumeUrl) {
      toast.error("Please create/generate your resume first.");
      return;
    }

    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter.");
      return;
    }

    if (!availability) {
      toast.error("Please select your availability.");
      return;
    }

    try {
      setSubmitting(true);

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
        "https://internshala-backend-5ycp.onrender.com/api/application",
        applicationdata
      );

      toast.success("Application submitted successfully!");

      // Update local usage
      setSubscription((prev: any) => {
        if (!prev) return prev;

        // Keep unlimited plans unchanged
        if (prev.monthlyApplicationLimit === null) {
          return prev;
        }

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
            `https://internshala-backend-5ycp.onrender.com/api/payment/subscription/${user.id}`
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
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (!jobData) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm font-medium text-gray-600">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  const postedDate = jobData?.createdAt
    ? jobData.createdAt.split("T")[0]
    : "Not specified";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --------------------------------------------------
          TOP BACK BAR
      -------------------------------------------------- */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* --------------------------------------------------
            HERO
        -------------------------------------------------- */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5 sm:p-7 lg:p-9">
            {/* Hiring badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Actively Hiring
            </div>

            {/* Title */}
            <div className="max-w-4xl">
              <h1 className="text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl lg:text-4xl">
                {jobData.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                <Building2 className="h-5 w-5 text-gray-500" />

                <span className="text-base font-semibold text-gray-700 sm:text-lg">
                  {jobData.company}
                </span>
              </div>
            </div>

            {/* Quick details */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={jobData.location}
              />

              <DetailItem
                icon={<IndianRupee className="h-5 w-5" />}
                label="CTC"
                value={jobData.CTC}
              />

              <DetailItem
                icon={<Calendar className="h-5 w-5" />}
                label="Start Date"
                value={jobData.startDate}
              />

              <DetailItem
                icon={<Users className="h-5 w-5" />}
                label="Openings"
                value={jobData.numberofopening}
              />
            </div>

            {/* Posted date */}
            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />

              <span>
                Posted on{" "}
                <span className="font-medium text-gray-700">
                  {postedDate}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            MAIN CONTENT
        -------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
          {/* LEFT CONTENT */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Company */}
            <Section title={`About ${jobData.company}`}>
              <div className="mb-5">
                <a
                  href="#"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Visit Company Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <p className="whitespace-pre-line">
                {jobData.aboutCompany ||
                  "Company information is not available."}
              </p>
            </Section>

            {/* Job */}
            <Section title="About the Job">
              <p className="whitespace-pre-line">
                {jobData.aboutJob ||
                  "Job description is not available."}
              </p>
            </Section>

            {/* Who can apply */}
            <Section title="Who Can Apply">
              <p className="whitespace-pre-line">
                {jobData.whoCanApply ||
                  "Eligibility information is not available."}
              </p>
            </Section>

            {/* Perks */}
            <Section title="Perks">
              <p className="whitespace-pre-line">
                {jobData.perks ||
                  "No perks have been specified."}
              </p>
            </Section>

            {/* Additional information */}
            <Section title="Additional Information">
              <p className="whitespace-pre-line">
                {jobData.AdditionalInfo ||
                  "No additional information is available."}
              </p>
            </Section>

            {/* Openings */}
            <Section title="Number of Openings">
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 font-semibold text-blue-700">
                <Users className="h-5 w-5" />

                <span>
                  {jobData.numberofopening || "Not specified"}
                </span>
              </div>
            </Section>
          </div>

          {/* RIGHT APPLY CARD */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5 sm:p-6">
                <p className="text-sm font-medium text-gray-500">
                  Interested in this opportunity?
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  Apply for this job
                </h3>

                <div className="my-5 space-y-3 border-y border-gray-100 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Job Type
                    </span>

                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                      <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
                      Full Time
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Location
                    </span>

                    <span className="max-w-[170px] text-right text-sm font-semibold text-gray-900">
                      {jobData.location || "Not specified"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApplyClick}
                  className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  Apply Now
                  <ArrowUpRight className="h-5 w-5" />
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                  You will need a generated resume and cover
                  letter to apply.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ==================================================
          APPLICATION MODAL
      ================================================== */}
      {isModelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5">
          <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div className="min-w-0 pr-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Job Application
                </p>

                <h2 className="mt-1 truncate text-lg font-bold text-gray-900 sm:text-xl">
                  Apply to {jobData.company}
                </h2>
              </div>

              <button
                onClick={() => setIsModelOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto p-5 sm:p-6">
              {/* Login required */}
              {!user ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center sm:p-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <Building2 className="h-7 w-7 text-blue-600" />
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    Login Required
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                    Please login or create an account before
                    applying for this job.
                  </p>

                  <Link
                    href="/login"
                    className="mt-5 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Sign up / Login
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Subscription */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Current Plan
                        </p>

                        <p className="mt-1 text-lg font-bold capitalize text-gray-900">
                          {subscriptionLoading
                            ? "Checking..."
                            : subscription?.plan || "Free"}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Applications
                        </p>

                        {subscriptionLoading ? (
                          <p className="mt-1 font-semibold text-gray-900">
                            Checking...
                          </p>
                        ) : subscription?.monthlyApplicationLimit ===
                          null ? (
                          <p className="mt-1 font-semibold text-green-600">
                            Unlimited
                          </p>
                        ) : (
                          <p
                            className={`mt-1 font-semibold ${
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

                    {/* Limit reached */}
                    {limitReached && (
                      <div className="mt-4 border-t border-blue-100 pt-4">
                        <p className="text-sm font-semibold text-red-600">
                          You have reached your monthly application
                          limit.
                        </p>

                        <Link
                          href="/subscription"
                          className="mt-3 inline-flex min-h-[42px] items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Upgrade Plan
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Resume */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />

                      <h3 className="text-lg font-bold text-gray-900">
                        Your Resume
                      </h3>
                    </div>

                    {resume?.resumeUrl ? (
                      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-gray-800">
                            {resume.fullname || "Your"}'s Resume
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Generated resume attached
                          </div>
                        </div>

                        <a
                          href={`https://internshala-backend-5ycp.onrender.com/uploads/resume/${resume.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          View Resume
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-600">
                          No generated resume found. Please create
                          your resume before applying.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cover letter */}
                  <div>
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Cover Letter
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Why should you be selected for this job?
                      </p>
                    </div>

                    <textarea
                      value={coverLetter}
                      onChange={(e) =>
                        setCoverLetter(e.target.value)
                      }
                      placeholder="Write your cover letter here..."
                      className="min-h-[150px] w-full resize-y rounded-xl border border-gray-300 p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <p className="mt-1 text-right text-xs text-gray-400">
                      {coverLetter.length} characters
                    </p>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Your Availability
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Select the option that best describes your
                      availability.
                    </p>

                    <div className="mt-4 space-y-3">
                      {[
                        "Yes, I am available to join immediately",
                        "No, I am currently on notice period",
                        "No, I will have to serve notice period",
                        "Other",
                      ].map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                            availability === option
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="availability"
                            value={option}
                            checked={availability === option}
                            onChange={(e) =>
                              setAvailability(e.target.value)
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                          />

                          <span className="text-sm leading-5 text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="border-t border-gray-100 pt-5">
                    {limitReached ? (
                      <Link
                        href="/subscription"
                        className="flex min-h-[50px] w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        Upgrade Plan
                      </Link>
                    ) : (
                      <button
                        className={`flex min-h-[50px] w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition ${
                          subscriptionLoading || submitting
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                        }`}
                        onClick={handlesubmitapplication}
                        disabled={
                          subscriptionLoading || submitting
                        }
                      >
                        {submitting
                          ? "Submitting Application..."
                          : subscriptionLoading
                          ? "Checking Plan..."
                          : "Submit Application"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;