"use client";

import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { pdf } from "@react-pdf/renderer";
import ResumeDocument from "../../Components/Resume/ResumeDocument";
import toast from "react-hot-toast";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Heart,
  Languages,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

const ViewResume = () => {
  const router = useRouter();
  const user = useSelector(selectuser);

  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  const [showOtpModel, setShowOtpModel] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* ---------------- FETCH RESUME ---------------- */

  useEffect(() => {
    const fetchResume = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://internshala-backend-5ycp.onrender.com/api/resume/${user.id}`
        );

        setResume(res.data.resume);
        setIsPaid(Boolean(res.data.resume?.PaymentStatus));
      } catch (error) {
        console.log(error);
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [user]);

  /* ---------------- DOWNLOAD PDF ---------------- */

  const downloadPDF = async () => {
    if (!resume || !user?.id) {
      toast.error("Resume information is missing");
      return;
    }

    try {
      toast.loading("Preparing your resume...", {
        id: "resume-download",
      });

      let photo = null;

      if (resume.photo) {
        const response = await fetch(
          `https://internshala-backend-5ycp.onrender.com/uploads/profilePhoto/${resume.photo}`
        );

        const blob = await response.blob();

        photo = await new Promise((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => resolve(reader.result);

          reader.readAsDataURL(blob);
        });
      }

      const blob = await pdf(
        <ResumeDocument
          resume={{
            ...resume,
            photo,
          }}
        />
      ).toBlob();

      const formData = new FormData();

      formData.append(
        "resume",
        new File([blob], `${resume.fullname}_Resume.pdf`, {
          type: "application/pdf",
        })
      );

      formData.append("userId", user.id);

      await axios.post(
        "https://internshala-backend-5ycp.onrender.com/api/resume/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.fullname}_Resume.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      toast.success("Resume downloaded successfully", {
        id: "resume-download",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to generate or download resume", {
        id: "resume-download",
      });
    }
  };

  /* ---------------- PAYMENT ---------------- */

  const handlePayment = async () => {
    if (!user?.id) {
      toast.error("Please login first");
      return;
    }

    try {
      setPaymentLoading(true);

      const res = await axios.post(
        "https://internshala-backend-5ycp.onrender.com/api/payment/send-otp",
        {
          userId: user.id,
        }
      );

      if (res.data.success) {
        setPaymentEmail(res.data.email);
        setOtp(["", "", "", "", "", ""]);
        setShowOtpModel(true);

        toast.success("OTP sent to your registered email");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyOtpAndPay = async () => {
    if (otp.join("").length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setPaymentLoading(true);

      const verifyOtp = await axios.post(
        "https://internshala-backend-5ycp.onrender.com/api/payment/verify-otp",
        {
          email: paymentEmail,
          otp: otp.join(""),
        }
      );

      if (!verifyOtp.data.success) {
        toast.error("Invalid OTP");
        return;
      }

      setShowOtpModel(false);

      const { data } = await axios.post(
        "https://internshala-backend-5ycp.onrender.com/api/payment/create-order",
        {
          userId: user.id,
        }
      );

      const options = {
        key: "rzp_test_THGu4hzb5NO39H",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "InternArea",
        description: "Resume Purchase",
        order_id: data.order.id,

        handler: async function (response: any) {
          try {
            const verify = await axios.post(
              "https://internshala-backend-5ycp.onrender.com/api/payment/verify-payment",
              {
                ...response,
                userId: user.id,
              }
            );

            if (verify.data.success) {
              toast.success("Payment Successful!");

              const res = await axios.get(
                `https://internshala-backend-5ycp.onrender.com/api/resume/${user.id}`
              );

              setResume(res.data.resume);
              setIsPaid(true);
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: resume?.fullname,
          email: resume?.email,
          contact: resume?.phone,
        },

        theme: {
          color: "#2563EB",
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.open();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-lg p-7 text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Loading Resume...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your resume.
          </p>
        </div>
      </main>
    );
  }

  /* ---------------- NO RESUME ---------------- */

  if (!resume) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg p-7 sm:p-9 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            No Resume Found
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
            You haven't created a resume yet. Build one to showcase
            your skills and experience.
          </p>

          <button
            onClick={() => router.push("/resume")}
            className="mt-6 w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Create Resume
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 sm:px-5 py-6 sm:py-10">
      {/* ACTION BAR */}
      <div className="w-full max-w-5xl mx-auto mb-5">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Resume Preview
                </p>

                <p className="text-xs text-gray-500">
                  {isPaid
                    ? "Your resume is ready to download."
                    : "Purchase access to download your PDF."}
                </p>
              </div>
            </div>

            {isPaid ? (
              <button
                onClick={downloadPDF}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition active:scale-[0.98]"
              >
                <Download size={18} />
                Download Resume
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShieldCheck size={18} />

                {paymentLoading
                  ? "Please wait..."
                  : "Pay ₹50"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RESUME */}
      <div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* LEFT SIDEBAR */}
          <aside className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white p-5 sm:p-7 md:p-8">
            {/* Profile */}
            <div className="flex flex-col items-center mb-8">
              {resume.photo ? (
                <img
                  src={`https://internshala-backend-5ycp.onrender.com/uploads/profilePhoto/${resume.photo}`}
                  alt="Profile"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-700 border-4 border-slate-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-300" />
                </div>
              )}

              <h2 className="mt-4 text-xl font-bold text-center break-words">
                {resume.fullname}
              </h2>
            </div>

            {/* Contact */}
            <SidebarSection title="Contact">
              <div className="space-y-3 text-sm text-slate-200">
                {resume.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="break-all">
                      {resume.email}
                    </span>
                  </div>
                )}

                {resume.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="break-words">
                      {resume.phone}
                    </span>
                  </div>
                )}

                {resume.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="break-words">
                      {resume.address}
                    </span>
                  </div>
                )}

                {resume.linkedin && (
                  <div className="flex items-start gap-2">
                    <LinkIcon className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="break-all">
                      {resume.linkedin}
                    </span>
                  </div>
                )}

                {resume.github && (
                  <div className="flex items-start gap-2">
                    <LinkIcon className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="break-all">
                      {resume.github}
                    </span>
                  </div>
                )}

                {resume.portfolio && (
                  <div className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span className="break-all">
                      {resume.portfolio}
                    </span>
                  </div>
                )}
              </div>
            </SidebarSection>

            {/* Skills */}
            <SidebarSection
              title="Skills"
              icon={<CodeIcon />}
            >
              <div className="flex flex-wrap gap-2">
                {(resume.skills || []).map(
                  (skill: string, i: number) => (
                    <span
                      key={i}
                      className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-100"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </SidebarSection>

            {/* Languages */}
            <SidebarSection
              title="Languages"
              icon={<Languages className="w-4 h-4" />}
            >
              <div className="space-y-1.5 text-sm text-slate-200">
                {(resume.languages || []).map(
                  (language: string, i: number) => (
                    <p key={i}>• {language}</p>
                  )
                )}
              </div>
            </SidebarSection>

            {/* Interests */}
            <SidebarSection
              title="Interests"
              icon={<Heart className="w-4 h-4" />}
            >
              <div className="space-y-1.5 text-sm text-slate-200">
                {(resume.interests || "")
                  .split(",")
                  .map((interest: string, i: number) => {
                    const value = interest.trim();

                    if (!value) return null;

                    return (
                      <p key={i}>• {value}</p>
                    );
                  })}
              </div>
            </SidebarSection>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-2 p-5 sm:p-7 md:p-10">
            {/* Name */}
            <div className="mb-8 sm:mb-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
                Professional Resume
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight break-words">
                {resume.fullname}
              </h1>

              <div className="mt-3 h-1 w-20 sm:w-28 bg-blue-600 rounded-full" />
            </div>

            {/* Objective */}
            <ResumeSection
              title="Career Objective"
            >
              <p className="text-gray-700 leading-7 text-sm sm:text-base">
                {resume.objective || "Not provided."}
              </p>
            </ResumeSection>

            {/* Education */}
            <ResumeSection
              title="Education"
              icon={<GraduationCap className="w-5 h-5" />}
            >
              {(resume.education || []).map(
                (edu: any, i: number) => (
                  <div
                    key={i}
                    className="mb-6 last:mb-0 pl-4 border-l-4 border-blue-500"
                  >
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 break-words">
                      {edu.college}
                    </h3>

                    {edu.degree && (
                      <p className="text-gray-700 mt-1">
                        {edu.degree}
                      </p>
                    )}

                    {edu.branch && (
                      <p className="text-gray-700">
                        {edu.branch}
                      </p>
                    )}

                    {edu.cgpa && (
                      <p className="text-gray-700">
                        CGPA: {edu.cgpa}
                      </p>
                    )}

                    {(edu.startYear || edu.endYear) && (
                      <div className="inline-flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {edu.startYear} - {edu.endYear}
                      </div>
                    )}
                  </div>
                )
              )}
            </ResumeSection>

            {/* Experience */}
            <ResumeSection
              title="Experience"
              icon={<Briefcase className="w-5 h-5" />}
            >
              {(resume.experience || []).map(
                (exp: any, i: number) => (
                  <div
                    key={i}
                    className="mb-6 last:mb-0 pl-4 border-l-4 border-blue-500"
                  >
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">
                      {exp.company}
                    </h3>

                    {exp.position && (
                      <p className="font-medium text-gray-700 mt-1">
                        {exp.position}
                      </p>
                    )}

                    {exp.duration && (
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.duration}
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-gray-700 leading-6 mt-2 text-sm sm:text-base">
                        {exp.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </ResumeSection>

            {/* Projects */}
            <ResumeSection
              title="Projects"
              icon={<FolderGit2 className="w-5 h-5" />}
            >
              {(resume.projects || []).map(
                (project: any, i: number) => (
                  <div
                    key={i}
                    className="mb-6 last:mb-0 pl-4 border-l-4 border-blue-500"
                  >
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-gray-700 leading-6 mt-2 text-sm sm:text-base">
                        {project.description}
                      </p>
                    )}

                    {project.github && (
                      <p className="flex items-start gap-2 text-sm text-blue-600 mt-2 break-all">
                        <LinkIcon className="w-4 h-4 mt-0.5 shrink-0" />
                        {project.github}
                      </p>
                    )}
                  </div>
                )
              )}
            </ResumeSection>

            {/* Certifications */}
            <ResumeSection
              title="Certifications"
              icon={<Award className="w-5 h-5" />}
            >
              <div className="space-y-2 text-gray-700 text-sm sm:text-base">
                {(resume.certification || []).map(
                  (certification: string, i: number) => (
                    <p key={i}>• {certification}</p>
                  )
                )}
              </div>
            </ResumeSection>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 sm:p-7">
            {/* Close */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowOtpModel(false);
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                Email Verification
              </h2>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                We've sent a 6-digit OTP to your registered email.
              </p>

              <p className="text-blue-600 font-semibold text-sm mt-2 break-all">
                {paymentEmail}
              </p>
            </div>

            {/* OTP */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-7 mb-7">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );

                    const newOtp = [...otp];
                    newOtp[index] = value;

                    setOtp(newOtp);

                    if (value && index < 5) {
                      const next = document.getElementById(
                        `otp-${index + 1}`
                      ) as HTMLInputElement;

                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      const prev = document.getElementById(
                        `otp-${index - 1}`
                      ) as HTMLInputElement;

                      prev?.focus();
                    }
                  }}
                  className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-200 rounded-xl text-center text-lg sm:text-xl font-bold text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={verifyOtpAndPay}
                disabled={paymentLoading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paymentLoading
                  ? "Verifying..."
                  : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOtpModel(false);
                  setOtp(["", "", "", "", "", ""]);
                }}
                disabled={paymentLoading}
                className="w-full h-12 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

/* ---------------- SMALL COMPONENTS ---------------- */

const SidebarSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 border-b border-slate-600 pb-2 mb-4">
        {icon && (
          <span className="text-slate-300">
            {icon}
          </span>
        )}

        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
};

const ResumeSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <section className="mb-9 sm:mb-10">
      <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-2 mb-5">
        {icon && (
          <span className="text-blue-600">
            {icon}
          </span>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
};

const CodeIcon = () => (
  <span className="text-xs font-bold">&lt;/&gt;</span>
);

export default ViewResume;