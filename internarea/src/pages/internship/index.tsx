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
} from "lucide-react";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [filteredInternship, setFilteredInternship] = useState<any[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filter, setFilters] = useState({
    category: "",
    location: "",
    workFromHome: false,
    partTime: false,
    stipend: 50,
  });

  const [internshipData, setInternship] = useState<any[]>([]);

  /* ================= FETCH INTERNSHIPS ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/internship"
        );

        setInternship(res.data);
        setFilteredInternship(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  /* ================= FILTER ================= */

  useEffect(() => {
    const filtered = internshipData.filter((internship: any) => {
      const category = internship.category || "";
      const location = internship.location || "";

      const matchesCategory = category
        .toLowerCase()
        .includes(filter.category.toLowerCase());

      const matchesLocation = location
        .toLowerCase()
        .includes(filter.location.toLowerCase());

      return matchesCategory && matchesLocation;
    });

    setFilteredInternship(filtered);
  }, [filter, internshipData]);

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
      stipend: 50,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= PAGE HEADER ================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Search size={14} />
              {t("internshipPage.badge")}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("internshipPage.title")}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              {t("internshipPage.description")}
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
                      {t("internshipPage.filters")}
                    </h2>

                    <p className="text-xs text-slate-400">
                      {t("internshipPage.refineResults")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  {t("internshipPage.clear")}
                </button>
              </div>

              <div className="space-y-6">

                {/* Category */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("internshipPage.category")}
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
                      placeholder={t("internshipPage.categoryPlaceholder")}
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
                    {t("internshipPage.location")}
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
                      placeholder={t("internshipPage.locationPlaceholder")}
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

                {/* Checkboxes */}

                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("internshipPage.workPreferences")}
                  </label>

                  <div className="space-y-3">

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50">
                      <input
                        type="checkbox"
                        name="workFromHome"
                        checked={filter.workFromHome}
                        onChange={handleFilterChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {t("internshipPage.workFromHome")}
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
                        {t("internshipPage.partTime")}
                      </span>
                    </label>

                  </div>
                </div>

                {/* Stipend */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {t("internshipPage.monthlyStipend")}
                    </label>

                    <span className="text-xs font-bold text-blue-600">
                      ₹{filter.stipend}K
                    </span>
                  </div>

                  <input
                    type="range"
                    name="stipend"
                    min="0"
                    max="100"
                    value={filter.stipend}
                    onChange={handleFilterChange}
                    className="w-full accent-blue-600"
                  />

                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>₹0</span>
                    <span>₹50K</span>
                    <span>₹100K</span>
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* ================= RESULTS ================= */}

          <main className="min-w-0 flex-1">

            {/* Mobile Filter Button */}

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

                <span>{t("internshipPage.filters")}</span>

                <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  {filteredInternship.length}
                </span>
              </button>

            </div>

            {/* Results Header */}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {filteredInternship.length} {filteredInternship.length === 1 ? t("internshipPage.foundSingular") : t("internshipPage.foundPlural")}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {t("internshipPage.resultsSubtitle")}
                </p>
              </div>

              {(filter.category || filter.location) && (
                <button
                  onClick={clearFilters}
                  className="
                    self-start
                    rounded-lg
                    bg-blue-50
                    px-3 py-2
                    text-xs font-semibold text-blue-600
                    transition hover:bg-blue-100
                    sm:self-auto
                  "
                >
                  {t("internshipPage.clearFilters")}
                </button>
              )}

            </div>

            {/* ================= INTERNSHIP LIST ================= */}

            <div className="space-y-4">

              {filteredInternship.length > 0 ? (
                filteredInternship.map((internship: any) => (

                  <article
                    key={internship._id}
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

                    {/* Top Row */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                          <ArrowUpRight size={13} />
                          {t("internshipPage.activelyHiring")}
                        </div>

                        <h2 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                          {internship.title}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {internship.company}
                        </p>

                      </div>

                      <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {t("internshipPage.internship")}
                      </span>

                    </div>

                    {/* Details */}

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
                            {t("internshipPage.startDate")}
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {internship.startDate || t("internshipPage.notSpecified")}
                          </p>
                        </div>

                      </div>

                      {/* Location */}

                      <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <FaLocationDot
                            className="text-blue-600"
                            size={15}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {t("internshipPage.location")}
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {internship.location || t("internshipPage.notSpecified")}
                          </p>
                        </div>

                      </div>

                      {/* Stipend */}

                      <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <DollarSign
                            size={17}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            {t("internshipPage.stipend")}
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {internship.stipend || t("internshipPage.notSpecified")}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Bottom Row */}

                    <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {t("internshipPage.internship")}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <Clock size={14} />
                          {t("internshipPage.postedRecently")}
                        </div>

                      </div>

                      <Link
                        href={`/detailInternship/${internship._id}`}
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
                        {t("internshipPage.viewDetails")}
                        <ArrowUpRight size={16} />
                      </Link>

                    </div>

                  </article>

                ))
              ) : (

                /* ================= EMPTY STATE ================= */

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                    <Search
                      size={24}
                      className="text-blue-600"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {t("internshipPage.emptyTitle")}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {t("internshipPage.emptyDescription")}
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
                    {t("internshipPage.clearFilters")}
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
            aria-label={t("internshipPage.closeFilters")}
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

            {/* Drawer Header */}

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
                    {t("internshipPage.filters")}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {t("internshipPage.refineSearch")}
                  </p>
                </div>

              </div>

              <button
                onClick={() => setIsFilterVisible(false)}
                aria-label={t("internshipPage.closeFilters")}
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
                  {t("internshipPage.category")}
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
                    placeholder={t("internshipPage.categoryPlaceholder")}
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
                  {t("internshipPage.location")}
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
                    placeholder={t("internshipPage.locationPlaceholder")}
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

              {/* Work Preferences */}

              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t("internshipPage.workPreferences")}
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
                      {t("internshipPage.workFromHome")}
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
                      {t("internshipPage.partTime")}
                    </span>
                  </label>

                </div>
              </div>

              {/* Stipend */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t("internshipPage.monthlyStipend")}
                  </label>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                    ₹{filter.stipend}K
                  </span>

                </div>

                <input
                  type="range"
                  name="stipend"
                  min="0"
                  max="100"
                  value={filter.stipend}
                  onChange={handleFilterChange}
                  className="w-full accent-blue-600"
                />

                <div className="mt-1 flex justify-between text-xs text-slate-400">
                  <span>₹0</span>
                  <span>₹50K</span>
                  <span>₹100K</span>
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
                  {t("internshipPage.clearAll")}
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
                  {t("internshipPage.showResults")}
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