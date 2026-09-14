import axios from "axios";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Mail,
  Search,
  Tag,
  User,
  XCircle,
  Clock3,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface Application {
  _id: string;
  company?: string;
  category?: string;
  user?: {
    name?: string;
    email?: string;
  };
  createdAt?: string;
  status?: string;
}

const getStatusColor = (status: string = "") => {
  switch (status.toLowerCase()) {
    case "accepted":
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
      return "bg-emerald-500";

    case "rejected":
      return "bg-red-500";

    default:
      return "bg-amber-500";
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
    month: "short",
    year: "numeric",
  });
};

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --------------------------------------------------
  // Fetch applications
  // --------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:5000/api/application"
        );

        setData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Unable to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --------------------------------------------------
  // Filter applications
  // --------------------------------------------------

  const filteredApplications = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return data.filter((application) => {
      const company = application.company?.toLowerCase() || "";
      const category = application.category?.toLowerCase() || "";
      const applicant = application.user?.name?.toLowerCase() || "";
      const status = application.status?.toLowerCase() || "";

      const searchMatch =
        !search ||
        company.includes(search) ||
        category.includes(search) ||
        applicant.includes(search);

      if (filter === "all") {
        return searchMatch;
      }

      return searchMatch && status === filter;
    });
  }, [data, searchTerm, filter]);

  // --------------------------------------------------
  // Counts
  // --------------------------------------------------

  const counts = useMemo(() => {
    return {
      all: data.length,
      pending: data.filter(
        (item) => item.status?.toLowerCase() === "pending"
      ).length,
      accepted: data.filter(
        (item) => item.status?.toLowerCase() === "accepted"
      ).length,
      rejected: data.filter(
        (item) => item.status?.toLowerCase() === "rejected"
      ).length,
    };
  }, [data]);

  // --------------------------------------------------
  // Accept / Reject
  // --------------------------------------------------

  const handleAcceptAndReject = async (
    id: string,
    action: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingId(id);

      const res = await axios.put(
        `http://localhost:5000/api/application/${id}`,
        { action }
      );

      setData((prev) =>
        prev.map((application) =>
          application._id === id
            ? res.data.data
            : application
        )
      );

      toast.success(
        action === "accepted"
          ? "Application accepted"
          : "Application rejected"
      );
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Error updating application");
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------------------------
  // Filter button
  // --------------------------------------------------

  const FilterButton = ({
    value,
    label,
    count,
  }: {
    value: string;
    label: string;
    count: number;
  }) => {
    const active = filter === value;

    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        className={`flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        {label}

        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            active
              ? "bg-white/20 text-white"
              : "bg-white text-slate-500"
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-36 animate-pulse rounded-3xl bg-slate-200" />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 px-3 py-6 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            Header
        ================================================== */}

        <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                Application Management
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Applications
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Manage and review internship and job applications
                from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-200">Total</p>
                <p className="mt-1 text-2xl font-bold">{counts.all}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-200">Pending</p>
                <p className="mt-1 text-2xl font-bold">{counts.pending}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-200">Accepted</p>
                <p className="mt-1 text-2xl font-bold">{counts.accepted}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-200">Rejected</p>
                <p className="mt-1 text-2xl font-bold">{counts.rejected}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            Main Container
        ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Search + Filters */}

          <div className="border-b border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4">

              {/* Search */}

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search company, category, or applicant..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Filters */}

              <div className="flex gap-2 overflow-x-auto pb-1">
                <FilterButton
                  value="all"
                  label="All"
                  count={counts.all}
                />

                <FilterButton
                  value="pending"
                  label="Pending"
                  count={counts.pending}
                />

                <FilterButton
                  value="accepted"
                  label="Accepted"
                  count={counts.accepted}
                />

                <FilterButton
                  value="rejected"
                  label="Rejected"
                  count={counts.rejected}
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              Desktop Table
          ================================================== */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applied Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((application) => {
                  const status = application.status || "pending";
                  const isUpdating =
                    updatingId === application._id;

                  return (
                    <tr
                      key={application._id}
                      className="transition hover:bg-blue-50/40"
                    >
                      {/* Company */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {application.company || "Unknown Company"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                              <Tag className="h-3.5 w-3.5" />
                              {application.category || "Uncategorized"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Applicant */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {application.user?.name || "Unknown User"}
                            </p>

                            <p className="mt-0.5 text-sm text-slate-500">
                              {application.user?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(application.createdAt)}
                        </div>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusColor(
                            status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              status
                            )}`}
                          />

                          {status}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/detailapplication/${application._id}`}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleAcceptAndReject(
                                application._id,
                                "accepted"
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Accept application"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleAcceptAndReject(
                                application._id,
                                "rejected"
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Reject application"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ==================================================
              Mobile Cards
          ================================================== */}

          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredApplications.map((application) => {
              const status = application.status || "pending";
              const isUpdating =
                updatingId === application._id;

              return (
                <div
                  key={application._id}
                  className="p-4 sm:p-5"
                >
                  {/* Top */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900">
                          {application.company || "Unknown Company"}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Tag className="h-3.5 w-3.5" />

                          <span className="truncate">
                            {application.category || "Uncategorized"}
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

                      {status}
                    </span>
                  </div>

                  {/* Applicant */}

                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {application.user?.name || "Unknown User"}
                        </p>

                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />

                          <span className="truncate">
                            {application.user?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date */}

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Clock3 className="h-4 w-4" />
                    Applied {formatDate(application.createdAt)}
                  </div>

                  {/* Actions */}

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/detailapplication/${application._id}`}
                      className="flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        handleAcceptAndReject(
                          application._id,
                          "accepted"
                        )
                      }
                      className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Accept
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        handleAcceptAndReject(
                          application._id,
                          "rejected"
                        )
                      }
                      className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-red-50 px-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==================================================
              Empty State
          ================================================== */}

          {!loading && filteredApplications.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <BriefcaseBusiness className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No applications found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {searchTerm
                  ? "Try changing your search term or selected filter."
                  : "There are currently no applications matching this filter."}
              </p>

              {(searchTerm || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* Result count */}

        {filteredApplications.length > 0 && (
          <p className="mt-4 px-1 text-xs font-medium text-slate-500">
            Showing {filteredApplications.length} of {data.length} applications
          </p>
        )}
      </div>
    </main>
  );
};

export default Applications;