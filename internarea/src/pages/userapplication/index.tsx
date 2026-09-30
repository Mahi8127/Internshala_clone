import { selectuser } from "@/Feature/Userslice";
import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";
import {
  Building2,
  Calendar,
  Clock3,
  Mail,
  Search,
  Tag,
  User,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const getStatusColor = (status: string = "") => {
  switch (status.toLowerCase()) {
    case "accepted":
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const getStatusDot = (status: string = "") => {
  switch (status.toLowerCase()) {
    case "accepted":
    case "approved":
      return "bg-emerald-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-amber-500";
  }
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  try {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const UserApplication = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const user = useSelector(selectuser);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusLabel = (statusStr: string = "") => {
    switch (statusStr.toLowerCase()) {
      case "accepted":
      case "approved":
        return t("application.app6");
      case "rejected":
        return t("application.app7");
      case "pending":
        return t("application.app5");
      default:
        return statusStr;
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://internshala-backend-5ycp.onrender.com/api/application");
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  const userApplications = useMemo(() => {
    if (!user?.name && !user?.email) return [];
    return data.filter(
      (app: any) =>
        (user?.name && app.user?.name?.toLowerCase() === user.name.toLowerCase()) ||
        (user?.email && app.user?.email?.toLowerCase() === user.email.toLowerCase())
    );
  }, [data, user]);

  const filteredApplications = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    return userApplications.filter((application: any) => {
      const company = application.company?.toLowerCase() || "";
      const category = application.category?.toLowerCase() || "";
      const searchMatch =
        !search || company.includes(search) || category.includes(search);
      if (filter === "all") return searchMatch;
      const status = application.status?.toLowerCase() || "pending";
      return searchMatch && status === filter;
    });
  }, [userApplications, searchTerm, filter]);

  const FilterButton = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => {
    const active = filter === value;
    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        className={`flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all shrink-0 ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <BriefcaseBusiness className="h-4 w-4" />
              {t("application.app1")}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {t("application.app2")}
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              {t("application.app3")}
            </p>
          </div>

          {/* Search + Filter */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("application.app8")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <FilterButton value="all" label={t("application.app4")} />
              <FilterButton value="pending" label={t("application.app5")} />
              <FilterButton value="accepted" label={t("application.app6")} />
              <FilterButton value="rejected" label={t("application.app7")} />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("application.app9")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("application.app10")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("application.app11")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("application.app12")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t("application.app13")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredApplications.map((application: any) => {
                  const status = application.status || "pending";
                  return (
                    <tr key={application._id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {application.company || t("application.app14")}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                              <Tag className="h-3 w-3" />
                              {application.category || t("application.app15")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {application.user?.name || user?.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {application.user?.email || user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(application.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusColor(
                            status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              status
                            )}`}
                          />
                          {getStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/detailapplication/${application._id}`}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                        >
                          {t("application.app18")}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredApplications.map((application: any) => {
              const status = application.status || "pending";
              return (
                <div key={application._id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900">
                          {application.company || t("application.app14")}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <Tag className="h-3 w-3" />
                          <span className="truncate">
                            {application.category || t("application.app15")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${getStatusColor(
                        status
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                          status
                        )}`}
                      />
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    {t("application.app19")} {formatDate(application.createdAt)}
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/detailapplication/${application._id}`}
                      className="flex min-h-10 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      {t("application.app20")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {!loading && filteredApplications.length === 0 && (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <BriefcaseBusiness className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">
                {t("application.app23")}
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                {searchTerm
                  ? t("application.emptyFiltered")
                  : t("application.emptyDefault")}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  {t("application.app24")}
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserApplication;
