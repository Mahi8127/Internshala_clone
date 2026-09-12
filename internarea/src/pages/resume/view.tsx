import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { pdf } from "@react-pdf/renderer";
import ResumeDocument from "../pdf/ResumeDocument";
import { Key } from "lucide-react";
import handler from "../api/hello";
import toast from "react-hot-toast";

const view = () => {
  const router = useRouter();
  const user = useSelector(selectuser);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [showOtpModel, setShowOtpModel] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [paymentEmail, setPaymentEmail] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/resume/${user.id}`,
        );
        setResume(res.data.resume);
        setIsPaid(res.data.resume.PaymentStatus);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchResume();
    }
  }, [user]);

  const downloadPDF = async () => {
    try {
      let photo = null;

      if (resume.photo) {
        const response = await fetch(
          `http://localhost:5000/uploads/profilePhoto/${resume.photo}`,
        );

        const blob = await response.blob();

        photo = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      console.log(ResumeDocument);
      const blob = await pdf(
        <ResumeDocument
          resume={{
            ...resume,
            photo,
          }}
        />,
      ).toBlob();

      const formData = new FormData();

      formData.append(
        "resume",
        new File([blob], `${resume.fullname}_Resume.pdf`, {
          type: "application/pdf",
        }),
      );

      formData.append("userId", user.id);

      await axios.post(
        "http://localhost:5000/api/resume/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.fullname}_Resume.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/send-otp",
        {
          userId: user.id,
        },
      );
      if (res.data.success) {
        setPaymentEmail(res.data.email);
        setShowOtpModel(true);
        toast.success("OTP sent to your registered email");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtpAndPay = async () => {
    try {
      const verifyOtp = await axios.post(
        "http://localhost:5000/api/payment/verify-otp",
        {
          email: paymentEmail,
          otp: otp.join(""),
        },
      );
      if (!verifyOtp.data.success) {
        toast.error("Invalid OTP");
        return;
      }
      setShowOtpModel(false);

      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          userId: user.id,
        },
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
              "http://localhost:5000/api/payment/verify-payment",
              {
                ...response,
                userId: user.id,
              },
            );
            if (verify.data.success) {
              toast.success("Payment Successful!");
              const res = await axios.get(
                `http://localhost:5000/api/resume/${user.id}`,
              );
              setResume(res.data.resume);
              setIsPaid(true);
              toast.success("Payment Successful!");
            }
          } catch (error) {
            console.error(error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: resume.fullname,
          email: resume.email,
          contact: resume.phone,
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="bg-white shadow-2xl rounded-2xl px-10 py-8 flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            Loading Resume...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your resume.
          </p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="bg-white shadow-xl rounded-2xl px-10 py-10 text-center max-w-md">
          <div className="text-6xl mb-4">📄</div>

          <h2 className="text-3xl font-bold text-gray-800">No Resume Found</h2>
          <p className="text-gray-500 mt-3 mb-6">
            You haven't created a resume yet. Build one to showcase your skills
            and experience.
          </p>
          <button
            onClick={() => (window.location.href = "/resume")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-12 px-4">
      <div className="max-w-5xl mx-auto flex justify-end mb-5">
        {isPaid ? (
          <button
            onClick={downloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Download Resume
          </button>
        ) : (
          <button
            onClick={handlePayment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Pay ₹50
          </button>
        )}
      </div>
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-3">
          {/* LEFT */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-700 text-white p-8">
            <div className="flex justify-center mb-8">
              {resume.photo ? (
                <img
                  src={`http://localhost:5000/uploads/profilePhoto/${resume.photo}`}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className=" flex w-40 h-40 rounded-full bg-slate-500 justify-center items-center">
                  <p className="text-gray-200">Profile Picture</p>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-400 pb-2 mb-4 text-sl">
                Contact
              </h2>

              <div className="space-y-2 text-sm text-gray-200 wrap-break-word">
                <p>{resume.email}</p>
                <p>{resume.phone}</p>
                <p>{resume.address}</p>
                <p>{resume.linkedin}</p>
                <p>{resume.github}</p>
                <p>{resume.portfolio}</p>
              </div>
            </div>

            {/* SKILLS */}
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 pb-2 mb-4">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill: any, i: any) => (
                  <span
                    key={i}
                    className="bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 pb-2 mb-4">
                Languages
              </h2>

              {resume.languages.map((lan: any, i: any) => (
                <p className="mb-1" key={i}>
                  • {lan}
                </p>
              ))}
            </div>

            {/* Interests */}
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 pb-2 mb-4">
                Interests
              </h2>
              {resume.interests.split(",").map((interests: any, i: any) => (
                <p key={i} className="mb-1">
                  • {interests}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 p-10">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                {resume.fullname}
              </h1>
              <div className="h-1 bg-blue-600 w-32 rounded-full"></div>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-5">
                Career Objective
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resume.objective}
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-5">
                Education
              </h2>
              {resume.education.map((edu: any, i: any) => (
                <div key={i} className="mb-6 pl-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-slate-900">
                    {edu.college}
                  </h3>

                  <p className="text-slate-800">{edu.degree}</p>
                  <p className="text-slate-800">{edu.branch}</p>
                  <p className="text-slate-800">CGPA: {edu.cgpa}</p>
                  <p className="text-slate-800">
                    {edu.startYear} - {edu.endYear}
                  </p>
                </div>
              ))}
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-5">
                Experience
              </h2>

              {resume.experience.map((exp: any, i: any) => (
                <div key={i} className="mb-6 pl-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-slate-900">
                    {exp.company}
                  </h3>
                  <p className="text-slate-800">{exp.position}</p>
                  <p className="text-slate-800">{exp.duration}</p>
                  <p className="text-slate-800">{exp.description}</p>
                </div>
              ))}
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-5">
                Projects
              </h2>

              {resume.projects.map((proj: any, i: any) => (
                <div key={i} className="mb-6 pl-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-slate-900">
                    {proj.title}
                  </h3>

                  <p className="text-slate-800">{proj.description}</p>
                  <p className="text-slate-800 hover:text-blue-600">
                    {proj.github}
                  </p>
                </div>
              ))}
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-5">
                Certifications
              </h2>
              {resume.certification.map((cert: any, i: any) => (
                <p key={i} className="text-slate-800">
                  • {cert}
                </p>
              ))}
            </section>
          </div>
        </div>
      </div>
      {showOtpModel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                📧
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                Email Verification
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                We've sent a 6-digit OTP to your registered email.
              </p>

              <p className="text-blue-600 font-medium text-sm mt-1">
                {paymentEmail}
              </p>
            </div>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-3 mt-8 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");

                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);

                    if (value && index < 5) {
                      const next = document.getElementById(
                        `otp-${index + 1}`,
                      ) as HTMLInputElement;

                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      const prev = document.getElementById(
                        `otp-${index - 1}`,
                      ) as HTMLInputElement;

                      prev?.focus();
                    }
                  }}
                  className="text-gray-800 w-12 h-14 border-2 border-gray-300 rounded-xl text-center text-xl font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={verifyOtpAndPay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Verify & Continue
              </button>

              <button
                onClick={() => {
                  setShowOtpModel(false);
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold transition text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default view;
