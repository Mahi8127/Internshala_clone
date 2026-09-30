import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const getStatusStyles = (status: string = "") => {
  switch (status.toLowerCase()) {
    case "accepted":
      return {
        wrapper: "border-emerald-200 bg-emerald-50",
        text: "text-emerald-700",
        icon: CheckCircle2,
      };

    case "rejected":
      return {
        wrapper: "border-red-200 bg-red-50",
        text: "text-red-700",
        icon: XCircle,
      };

    default:
      return {
        wrapper: "border-amber-200 bg-amber-50",
        text: "text-amber-700",
        icon: Loader2,
      };
  }
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const DetailApplication = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const getStatusLabel = (statusStr: string = "") => {
    switch (statusStr.toLowerCase()) {
      case "accepted":
        return t("application.app6");
      case "rejected":
        return t("application.app7");
      case "pending":
        return t("application.app5");
      default:
        return statusStr;
    }
  };

  // --------------------------------------------------
  // Fetch application
  // --------------------------------------------------

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/application/${id}`
        );

        setData(res.data);
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-800">
            {t("detailapplication.loading")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("detailapplication.fetching")}
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // No data
  // --------------------------------------------------

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <FileText className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {t("detailapplication.notFound")}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {t("detailapplication.notFoundDesc")}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("detailapplication.goBack")}
          </button>
        </div>
      </main>
    );
  }

  const status = data.status || "pending";
  const statusStyles = getStatusStyles(status);
  const StatusIcon = statusStyles.icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 px-3 py-6 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            Back Button
        ================================================== */}

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("detailapplication.back")}
        </button>

        {/* ==================================================
            Header
        ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          <div className="relative bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 px-5 py-7 text-white sm:px-8 sm:py-9">
            
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Applicant photo */}

              <div className="mx-auto shrink-0 sm:mx-0">
                {data?.user?.photo ? (
                  <img
                    src={data.user.photo}
                    alt={data?.user?.name || t("detailapplication.applicantResume")}
                    className="h-24 w-24 rounded-2xl border-4 border-white/20 object-cover shadow-xl sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white/10 bg-white/10 sm:h-28 sm:w-28">
                    <User className="h-10 w-10 text-blue-200" />
                  </div>
                )}
              </div>

              {/* Applicant information */}

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  {t("detailapplication.title")}
                </p>

                <h1 className="mt-1 truncate text-2xl font-extrabold sm:text-3xl">
                  {data?.user?.name || t("application.app16")}
                </h1>

                <div className="mt-3 flex flex-col gap-2 text-sm text-blue-100 sm:flex-row sm:flex-wrap">
                  {data?.user?.email && (
                    <span className="inline-flex items-center justify-center gap-2 sm:justify-start">
                      <Mail className="h-4 w-4" />
                      {data.user.email}
                    </span>
                  )}

                  {data?.company && (
                    <span className="inline-flex items-center justify-center gap-2 sm:justify-start">
                      <Building2 className="h-4 w-4" />
                      {data.company}
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}

              <div className="flex justify-center sm:justify-end">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold capitalize ${statusStyles.wrapper} ${statusStyles.text}`}
                >
                  <StatusIcon
                    className={`h-4 w-4 ${
                      status === "pending" ? "animate-pulse" : ""
                    }`}
                  />

                  {getStatusLabel(status)}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              Application Information
          ================================================== */}

          <div className="grid grid-cols-1 gap-4 border-b border-slate-200 p-5 sm:grid-cols-2 sm:p-8">

            {/* Company */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t("application.app9")}
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {data.company || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Applied Date */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t("application.app11")}
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formatDate(data.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              Cover Letter
          ================================================== */}

          <section className="border-b border-slate-200 p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                <FileText className="h-5 w-5 text-violet-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("detailapplication.coverLetter")}
                </h2>

                <p className="text-xs text-slate-500">
                  {t("detailapplication.coverLetterDesc")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
              {data.coverLetter ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:text-base">
                  {data.coverLetter}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">
                  {t("detailapplication.noCoverLetter")}
                </p>
              )}
            </div>
          </section>

          {/* ==================================================
              Resume
          ================================================== */}

          <section className="p-5 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("detailapplication.attachedResume")}
                </h2>

                <p className="text-xs text-slate-500">
                  {t("detailapplication.resumeDesc")}
                </p>
              </div>
            </div>

            {data?.resume ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {data.resume.fullname || t("detailapplication.applicantResume")}
                    </h3>

                    {data.resume.email && (
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="h-4 w-4" />
                        {data.resume.email}
                      </p>
                    )}

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {t("detailapplication.resumeAttached")}
                    </div>
                  </div>

                  <a
                    href={`http://localhost:5000/uploads/resume/${data.resume.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
                  >
                    <FileText className="h-4 w-4" />
                    {t("detailapplication.viewResume")}
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500" />

                  <p className="text-sm font-semibold text-red-700">
                    {t("detailapplication.noResume")}
                  </p>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* Bottom spacing */}

        <div className="h-6" />
      </div>
    </main>
  );
};

export default DetailApplication;