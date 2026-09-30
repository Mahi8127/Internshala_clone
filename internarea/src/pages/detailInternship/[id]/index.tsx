import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const DetailInternship = () => {
  const router = useRouter();
  const { id } = router.query;

  const user = useSelector(selectuser);

  const [internshipData, setInternship] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);

  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const [availability, setAvailability] = useState(
    "Yes, I am available to join immediately"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ==================================================
  // FETCH INTERNSHIP
  // ==================================================

  useEffect(() => {
    if (!id) return;

    const fetchInternship = async () => {
      try {
        const res = await axios.get(
          `http://internshala-backend-5ycp.onrender.com/api/internship/${id}`
        );

        setInternship(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load internship");
      }
    };

    fetchInternship();
  }, [id]);

  // ==================================================
  // FETCH RESUME
  // ==================================================

  useEffect(() => {
    if (!user?.id) return;

    const fetchResume = async () => {
      try {
        const res = await axios.get(
          `http://internshala-backend-5ycp.onrender.com/api/resume/${user.id}`
        );

        setResume(res.data.resume);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResume();
  }, [user]);

  // ==================================================
  // FETCH SUBSCRIPTION
  // ==================================================

  useEffect(() => {
    if (!user?.id) {
      setSubscriptionLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const res = await axios.get(
          `http://internshala-backend-5ycp.onrender.com/api/payment/subscription/${user.id}`
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

  // ==================================================
  // APPLICATION LIMIT
  // ==================================================

  const limitReached =
    !!subscription &&
    subscription.monthlyApplicationLimit !== null &&
    subscription.applicationsUsed >=
      subscription.monthlyApplicationLimit;

  // ==================================================
  // APPLY CLICK
  // ==================================================

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please login first to apply.");
      setIsModalOpen(true);
      return;
    }

    if (subscriptionLoading) {
      toast("Checking your subscription...");
      return;
    }

    setIsModalOpen(true);
  };

  // ==================================================
  // SUBMIT APPLICATION
  // ==================================================

  const handleSubmitApplication = async () => {
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

      const applicationData = {
        category: internshipData.category,
        company: internshipData.company,
        coverLetter,
        user,
        Application: id,
        availability,
        resume: resume.resumeUrl,
      };

      await axios.post(
        "http://internshala-backend-5ycp.onrender.com/api/application",
        applicationData
      );

      toast.success("Application submitted successfully!");

      setSubscription((prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          applicationsUsed: prev.applicationsUsed + 1,
        };
      });

      setIsModalOpen(false);
      setCoverLetter("");

      router.push("/internship");
    } catch (error: any) {
      console.error(error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 403) {
        toast.error(
          message || "Monthly application limit reached."
        );

        try {
          const res = await axios.get(
            `http://internshala-backend-5ycp.onrender.com/api/payment/subscription/${user.id}`
          );

          if (res.data.success) {
            setSubscription(res.data.subscription);
          }
        } catch (subscriptionError) {
          console.error(subscriptionError);
        }

        return;
      }

      toast.error(message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (!internshipData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-800">
            Loading internship
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fetching internship details...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 px-3 py-6 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            Back
        ================================================== */}

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* ==================================================
            Main Card
        ================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          {/* ==================================================
              Hero
          ================================================== */}

          <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 px-5 py-7 text-white sm:px-8 sm:py-10 lg:px-10">
            
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Actively Hiring
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    {internshipData.title}
                  </h1>

                  <p className="mt-3 text-lg font-medium text-blue-200">
                    {internshipData.company}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-blue-100 backdrop-blur">
                      <MapPin className="h-4 w-4" />
                      {internshipData.location || "Location not specified"}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-blue-100 backdrop-blur">
                      <DollarSign className="h-4 w-4" />
                      {internshipData.stipend || "Unpaid"}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-blue-100 backdrop-blur">
                      <Calendar className="h-4 w-4" />
                      {internshipData.startDate || "Flexible"}
                    </div>
                  </div>

                  {internshipData.createdAt && (
                    <div className="mt-5 flex items-center gap-2 text-xs text-blue-200">
                      <Clock className="h-4 w-4" />
                      Posted on{" "}
                      {new Date(
                        internshipData.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:block">
                  <ArrowUpRight className="h-9 w-9 text-blue-200" />
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              Quick Info
          ================================================== */}

          <section className="grid grid-cols-1 gap-3 border-b border-slate-200 p-5 sm:grid-cols-3 sm:p-8">
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Location"
              value={internshipData.location}
            />

            <InfoCard
              icon={<DollarSign className="h-5 w-5" />}
              title="Stipend"
              value={internshipData.stipend}
            />

            <InfoCard
              icon={<Users className="h-5 w-5" />}
              title="Openings"
              value={internshipData.numberOfOpening}
            />
          </section>

          {/* ==================================================
              About Company
          ================================================== */}

          <ContentSection
            icon={<Building2Icon />}
            title={`About ${internshipData.company}`}
          >
            {internshipData.aboutCompany || "No company information provided."}

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
            >
              Visit Company Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </ContentSection>

          {/* ==================================================
              Internship Details
          ================================================== */}

          <section className="border-b border-slate-200 p-5 sm:p-8 lg:p-10">
            <SectionTitle
              icon={<BriefcaseIcon />}
              title="About the Internship"
            />

            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              {internshipData.aboutInternship ||
                "No internship description provided."}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <InfoBlock
                title="Who can apply"
                text={internshipData.whoCanApply}
              />

              <InfoBlock
                title="Perks"
                text={internshipData.perks}
              />

              <InfoBlock
                title="Additional Information"
                text={internshipData.additionalInfo}
              />

              <InfoBlock
                title="Number of Openings"
                text={internshipData.numberOfOpening}
              />
            </div>
          </section>

          {/* ==================================================
              Apply CTA
          ================================================== */}

          <section className="bg-slate-50 p-5 sm:p-8">
            <div className="flex flex-col gap-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Interested in this internship?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Submit your resume and application to get started.
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyClick}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Apply Now
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ==================================================
          Apply Modal
      ================================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="shrink-0 bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-5 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Application
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                    Apply to {internshipData.company}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    {internshipData.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close application modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}

            <div className="overflow-y-auto p-5 sm:p-7">

              {/* Not logged in */}

              {!user ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                    <ShieldCheck className="h-7 w-7 text-blue-600" />
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    Login Required
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Please login or create an account before applying
                    for this internship.
                  </p>

                  <Link
                    href="/login"
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Login / Create Account
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">

                  {/* Subscription */}

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Current Plan
                        </p>

                        <p className="mt-1 text-xl font-extrabold capitalize text-slate-900">
                          {subscriptionLoading
                            ? "Checking..."
                            : subscription?.plan || "Free"}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Monthly Applications
                        </p>

                        {subscriptionLoading ? (
                          <p className="mt-1 font-bold text-slate-800">
                            Checking...
                          </p>
                        ) : subscription?.monthlyApplicationLimit ===
                          null ? (
                          <p className="mt-1 font-bold text-emerald-600">
                            Unlimited
                          </p>
                        ) : (
                          <p
                            className={`mt-1 font-bold ${
                              limitReached
                                ? "text-red-600"
                                : "text-slate-800"
                            }`}
                          >
                            {subscription?.applicationsUsed || 0} /{" "}
                            {subscription?.monthlyApplicationLimit || 0}
                          </p>
                        )}
                      </div>
                    </div>

                    {limitReached && (
                      <div className="mt-4 border-t border-blue-100 pt-4">
                        <p className="text-sm font-semibold text-red-600">
                          You have reached your monthly application
                          limit.
                        </p>

                        <Link
                          href="/subscription"
                          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          Upgrade Plan
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Resume */}

                  <div>
                    <SectionTitle
                      icon={<FileText className="h-5 w-5" />}
                      title="Your Resume"
                      small
                    />

                    {resume?.resumeUrl ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-slate-800">
                              {resume.fullname || "Your Resume"}
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" />
                              Generated resume attached
                            </p>
                          </div>

                          <a
                            href={`http://internshala-backend-5ycp.onrender.com/uploads/resume/${resume.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-600">
                          No generated resume found. Please create your
                          resume before applying.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter */}

                  <div>
                    <SectionTitle
                      icon={<FileText className="h-5 w-5" />}
                      title="Cover Letter"
                      small
                    />

                    <p className="mb-3 text-sm text-slate-500">
                      Why should you be selected for this internship?
                    </p>

                    <textarea
                      value={coverLetter}
                      onChange={(e) =>
                        setCoverLetter(e.target.value)
                      }
                      placeholder="Write your cover letter here..."
                      rows={7}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <p className="mt-2 text-right text-xs text-slate-400">
                      {coverLetter.length} characters
                    </p>
                  </div>

                  {/* Availability */}

                  <div>
                    <SectionTitle
                      icon={<UserCheck className="h-5 w-5" />}
                      title="Your Availability"
                      small
                    />

                    <div className="space-y-2">
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
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
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
                            className="mt-0.5 h-4 w-4 accent-blue-600"
                          />

                          <span className="text-sm leading-5 text-slate-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}

                  <div className="border-t border-slate-200 pt-5">
                    {limitReached ? (
                      <Link
                        href="/subscription"
                        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        Upgrade Plan to Apply
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitApplication}
                        disabled={
                          subscriptionLoading || submitting
                        }
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting && (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        )}

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
    </main>
  );
};

// ==================================================
// Reusable Components
// ==================================================

const InfoCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value?: any;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-800">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  </div>
);

const ContentSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="border-b border-slate-200 p-5 sm:p-8 lg:p-10">
    <SectionTitle icon={icon} title={title} />

    <p className="text-sm leading-7 text-slate-600 sm:text-base">
      {children}
    </p>
  </section>
);

const InfoBlock = ({
  title,
  text,
}: {
  title: string;
  text?: any;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 className="font-bold text-slate-900">{title}</h3>

    <p className="mt-2 text-sm leading-6 text-slate-600">
      {text || "Not specified."}
    </p>
  </div>
);

const SectionTitle = ({
  icon,
  title,
  small = false,
}: {
  icon: React.ReactNode;
  title: string;
  small?: boolean;
}) => (
  <div className={`flex items-center gap-3 ${small ? "mb-3" : "mb-5"}`}>
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ${
        small ? "h-9 w-9" : "h-10 w-10"
      }`}
    >
      {icon}
    </div>

    <h2
      className={`font-bold text-slate-900 ${
        small ? "text-lg" : "text-xl sm:text-2xl"
      }`}
    >
      {title}
    </h2>
  </div>
);

const Building2Icon = () => (
  <Building2 className="h-5 w-5" />
);

const BriefcaseIcon = () => (
  <Briefcase className="h-5 w-5" />
);

export default DetailInternship;