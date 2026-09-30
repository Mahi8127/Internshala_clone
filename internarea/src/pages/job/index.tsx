import axios from "axios";
import {
  ArrowUpRight,
  DollarSign,
  Filter,
  Clock,
  PlayCircle,
  X,
  Search,
  MapPin,
  SlidersHorizontal,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [jobData, setJobData] = useState<any[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filter, setFilters] = useState({
    category: "",
    location: "",
    workFromHome: false,
    partTime: false,
    salary: 50,
    experience: "",
  });

  /* ================= FETCH JOBS ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://internshala-backend-5ycp.onrender.com/api/job"
        );

        setJobData(res.data);
        setFilteredJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  /* ================= FILTER ================= */

  useEffect(() => {
    const filtered = jobData.filter((job: any) => {
      const category = job.category || "";
      const location = job.location || "";

      const matchesCategory = category
        .toLowerCase()
        .includes(filter.category.toLowerCase());

      const matchesLocation = location
        .toLowerCase()
        .includes(filter.location.toLowerCase());

      return matchesCategory && matchesLocation;
    });

    setFilteredJobs(filtered);
  }, [filter, jobData]);

  /* ================= FILTER CHANGE ================= */

  const handleFilterChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= CLEAR FILTERS ================= */

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      workFromHome: false,
      partTime: false,
      salary: 50,
      experience: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= PAGE HEADER ================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <BriefcaseBusiness size={14} />
              {t("jobPage.badge")}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("jobPage.title")}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              {t("jobPage.description")}
            </p>

          </div>

        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ================= DESKTOP FILTER ================= */}

          <aside className="hidden w-64 shrink-0 lg:block">

            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              {/* Filter Header */}

              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                    <Filter
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {t("jobPage.filters")}
                    </h2>

                    <p className="text-xs text-slate-400">
                      {t("jobPage.refineResults")}
                    </p>
                  </div>

                </div>

                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  {t("jobPage.clear")}
                </button>

              </div>

              <div className="space-y-6">

                {/* Category */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("jobPage.category")}
                  </label>

                  <div className="relative">

                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="category"
                      value={filter.category}
                      onChange={handleFilterChange}
                      placeholder={t("jobPage.categoryPlaceholder")}
                      className="
                        w-full rounded-xl
                        border border-gray-200
                        bg-gray-50
                        py-2.5 pl-9 pr-3
                        text-sm text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-50
                      "
                    />

                  </div>

                </div>

                {/* Location */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("jobPage.location")}
                  </label>

                  <div className="relative">

                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="location"
                      value={filter.location}
                      onChange={handleFilterChange}
                      placeholder={t("jobPage.locationPlaceholder")}
                      className="
                        w-full rounded-xl
                        border border-gray-200
                        bg-gray-50
                        py-2.5 pl-9 pr-3
                        text-sm text-slate-700
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-50
                      "
                    />

                  </div>

                </div>

                {/* Experience */}

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("jobPage.experience")}
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={filter.experience}
                    onChange={handleFilterChange}
                    placeholder={t("jobPage.experiencePlaceholder")}
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      px-3 py-2.5
                      text-sm text-slate-700
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                </div>

                {/* Work Preferences */}

                <div>

                  <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("jobPage.workPreferences")}
                  </label>

                  <div className="space-y-2">

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50">

                      <input
                        type="checkbox"
                        name="workFromHome"
                        checked={filter.workFromHome}
                        onChange={handleFilterChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {t("jobPage.workFromHome")}
                      </span>

                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50">

                      <input
                        type="checkbox"
                        name="partTime"
                        checked={filter.partTime}
                        onChange={handleFilterChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {t("jobPage.partTime")}
                      </span>

                    </label>

                  </div>

                </div>

                {/* Salary */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {t("jobPage.annualSalary")}
                    </label>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                      ₹{filter.salary}L
                    </span>

                  </div>

                  <input
                    type="range"
                    name="salary"
                    min="0"
                    max="100"
                    value={filter.salary}
                    onChange={handleFilterChange}
                    className="w-full accent-blue-600"
                  />

                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>₹0L</span>
                    <span>₹50L</span>
                    <span>₹100L</span>
                  </div>

                </div>

              </div>

            </div>

          </aside>

          {/* ================= RESULTS ================= */}

          <main className="min-w-0 flex-1">

            {/* Mobile Filters */}

            <div className="mb-4 lg:hidden">

              <button
                onClick={() => setIsFilterVisible(true)}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4 py-3
                  text-sm font-semibold text-slate-700
                  shadow-sm
                  transition
                  hover:border-blue-300
                  hover:text-blue-600
                "
              >

                <SlidersHorizontal size={18} />

                <span>{t("jobPage.filters")}</span>

                <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  {filteredJobs.length}
                </span>

              </button>

            </div>

            {/* Results Header */}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  {filteredJobs.length} {filteredJobs.length === 1 ? t("jobPage.foundSingular") : t("jobPage.foundPlural")}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {t("jobPage.resultsSubtitle")}
                </p>

              </div>

              {(filter.category ||
                filter.location ||
                filter.experience) && (
                <button
                  onClick={clearFilters}
                  className="
                    self-start
                    rounded-lg
                    bg-blue-50
                    px-3 py-2
                    text-xs font-semibold text-blue-600
                    transition
                    hover:bg-blue-100
                    sm:self-auto
                  "
                >
                  {t("jobPage.clearFilters")}
                </button>
              )}

            </div>

            {/* ================= JOB LIST ================= */}

            <div className="space-y-4">

              {filteredJobs.length > 0 ? (

                filteredJobs.map((job: any) => (

                  <article
                    key={job._id}
                    className="
                      group
                      rounded-2xl
                      border border-gray-200
                      bg-white
                      p-4
                      shadow-sm
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:border-blue-200
                      hover:shadow-md
                      sm:p-5
                    "
                  >

                    {/* Top Section */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">

                          <ArrowUpRight size={13} />

                          {t("jobPage.activelyHiring")}

                        </div>

                        <h2 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                          {job.title}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {job.company}
                        </p>

                      </div>

                      <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {t("jobPage.job")}
                      </span>

                    </div>

                    {/* Job Details */}

                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">

                      {/* Start Date */}

                      <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                          <PlayCircle
                            size={17}
                            className="text-blue-600"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {t("jobPage.startDate")}
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {job.startDate || t("jobPage.notSpecified")}
                          </p>

                        </div>

                      </div>

                      {/* Location */}

                      <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                          <FaLocationDot
                            size={15}
                            className="text-blue-600"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {t("jobPage.location")}
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {job.location || t("jobPage.notSpecified")}
                          </p>

                        </div>

                      </div>

                      {/* CTC */}

                      <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                          <DollarSign
                            size={17}
                            className="text-blue-600"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {t("jobPage.ctc")}
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {job.CTC || t("jobPage.notSpecified")}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Bottom */}

                    <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {t("jobPage.job")}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">

                          <Clock size={14} />

                          {t("jobPage.postedRecently")}

                        </div>

                      </div>

                      <Link
                        href={`/detailJob/${job._id}`}
                        className="
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          gap-1
                          rounded-xl
                          bg-blue-600
                          px-4 py-2.5
                          text-sm font-semibold text-white
                          transition-all duration-200
                          hover:bg-blue-700
                          sm:w-auto
                        "
                      >
                        {t("jobPage.viewDetails")}
                        <ArrowUpRight size={16} />
                      </Link>

                    </div>

                  </article>

                ))

              ) : (

                /* ================= EMPTY STATE ================= */

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">

                    <BriefcaseBusiness
                      size={24}
                      className="text-blue-600"
                    />

                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {t("jobPage.emptyTitle")}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {t("jobPage.emptyDescription")}
                  </p>

                  <button
                    onClick={clearFilters}
                    className="
                      mt-5
                      rounded-xl
                      bg-blue-600
                      px-5 py-2.5
                      text-sm font-semibold text-white
                      transition
                      hover:bg-blue-700
                    "
                  >
                    {t("jobPage.clearFilters")}
                  </button>

                </div>

              )}

            </div>

          </main>

        </div>

      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}

      {isFilterVisible && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Overlay */}

          <button
            type="button"
            aria-label={t("jobPage.closeFilters")}
            onClick={() => setIsFilterVisible(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
          />

          {/* Drawer */}

          <div
            className="
              absolute right-0 top-0
              h-full
              w-[88%]
              max-w-sm
              overflow-y-auto
              bg-white
              shadow-2xl
              sm:w-[380px]
            "
          >

            {/* Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">

                  <Filter
                    size={18}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <h2 className="text-base font-bold text-slate-900">
                    {t("jobPage.filters")}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {t("jobPage.refineSearch")}
                  </p>

                </div>

              </div>

              <button
                onClick={() => setIsFilterVisible(false)}
                aria-label={t("jobPage.closeFilters")}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-500
                  transition
                  hover:bg-slate-200
                "
              >
                <X size={19} />
              </button>

            </div>

            {/* Drawer Content */}

            <div className="space-y-6 p-5">

              {/* Category */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("jobPage.category")}
                </label>

                <div className="relative">

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="category"
                    value={filter.category}
                    onChange={handleFilterChange}
                    placeholder={t("jobPage.categoryPlaceholder")}
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3 pl-9 pr-3
                      text-sm text-slate-700
                      outline-none
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                </div>

              </div>

              {/* Location */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("jobPage.location")}
                </label>

                <div className="relative">

                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={filter.location}
                    onChange={handleFilterChange}
                    placeholder={t("jobPage.locationPlaceholder")}
                    className="
                      w-full rounded-xl
                      border border-gray-200
                      bg-gray-50
                      py-3 pl-9 pr-3
                      text-sm text-slate-700
                      outline-none
                      focus:border-blue-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-50
                    "
                  />

                </div>

              </div>

              {/* Experience */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("jobPage.experience")}
                </label>

                <input
                  type="text"
                  name="experience"
                  value={filter.experience}
                  onChange={handleFilterChange}
                  placeholder={t("jobPage.experiencePlaceholder")}
                  className="
                    w-full rounded-xl
                    border border-gray-200
                    bg-gray-50
                    py-3 px-3
                    text-sm text-slate-700
                    outline-none
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

              </div>

              {/* Work Preferences */}

              <div>

                <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("jobPage.workPreferences")}
                </label>

                <div className="space-y-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-slate-50">

                    <input
                      type="checkbox"
                      name="workFromHome"
                      checked={filter.workFromHome}
                      onChange={handleFilterChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {t("jobPage.workFromHome")}
                    </span>

                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-slate-50">

                    <input
                      type="checkbox"
                      name="partTime"
                      checked={filter.partTime}
                      onChange={handleFilterChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {t("jobPage.partTime")}
                    </span>

                  </label>

                </div>

              </div>

              {/* Salary */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("jobPage.annualSalary")}
                  </label>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                    ₹{filter.salary}L
                  </span>

                </div>

                <input
                  type="range"
                  name="salary"
                  min="0"
                  max="100"
                  value={filter.salary}
                  onChange={handleFilterChange}
                  className="w-full accent-blue-600"
                />

                <div className="mt-1 flex justify-between text-xs text-slate-400">
                  <span>₹0L</span>
                  <span>₹50L</span>
                  <span>₹100L</span>
                </div>

              </div>

            </div>

            {/* Drawer Footer */}

            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4">

              <div className="flex gap-3">

                <button
                  onClick={clearFilters}
                  className="
                    flex-1
                    rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm font-semibold text-slate-700
                    hover:bg-slate-50
                  "
                >
                  {t("jobPage.clearAll")}
                </button>

                <button
                  onClick={() => setIsFilterVisible(false)}
                  className="
                    flex-1
                    rounded-xl
                    bg-blue-600
                    px-4 py-3
                    text-sm font-semibold text-white
                    hover:bg-blue-700
                  "
                >
                  {t("jobPage.showResults")}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Index;