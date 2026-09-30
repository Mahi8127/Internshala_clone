import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  ArrowUpRight,
  Banknote,
  Calendar,
  ChevronRight,
  MapPin,
  Search,
  BriefcaseBusiness,
} from "lucide-react";

import Link from "next/link";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";

export default function SvgSlider() {
  const { t } = useLanguage();

  const categories = [
    { id: "Big Brands", key: "home.categories.bigBrands" },
    { id: "Work From Home", key: "home.categories.workFromHome" },
    { id: "Part-time", key: "home.categories.partTime" },
    { id: "MBA", key: "home.categories.mba" },
    { id: "Engineering", key: "home.categories.engineering" },
    { id: "Media", key: "home.categories.media" },
    { id: "Design", key: "home.categories.design" },
    { id: "Data Science", key: "home.categories.dataScience" },
  ];

  const slides = [
    {
      pattern: "pattern-1",
      titleKey: "home.slides.slide1Title",
      subtitleKey: "home.slides.slide1Subtitle",
      bgColor: "bg-indigo-600",
    },
    {
      pattern: "pattern-2",
      titleKey: "home.slides.slide2Title",
      subtitleKey: "home.slides.slide2Subtitle",
      bgColor: "bg-blue-600",
    },
    {
      pattern: "pattern-3",
      titleKey: "home.slides.slide3Title",
      subtitleKey: "home.slides.slide3Subtitle",
      bgColor: "bg-purple-600",
    },
    {
      pattern: "pattern-4",
      titleKey: "home.slides.slide4Title",
      subtitleKey: "home.slides.slide4Subtitle",
      bgColor: "bg-teal-600",
    },
  ];

  const [internships, setinternship] = useState<any[]>([]);
  const [jobs, setjob] = useState<any[]>([]);
  const [SlectedCategory, setSelectedCategory] = useState("");

  // --------------------------------------------------
  // FETCH INTERNSHIPS + JOBS
  // --------------------------------------------------
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const [internshipres, jobres] = await Promise.all([
          axios.get("http://internshala-backend-5ycp.onrender.com//api/internship"),
          axios.get("http://internshala-backend-5ycp.onrender.com//api/job"),
        ]);

        setinternship(internshipres.data);
        setjob(jobres.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  // --------------------------------------------------
  // FILTER DATA
  // --------------------------------------------------
  const filteredInternships = internships.filter(
    (item: any) =>
      !SlectedCategory || item.category === SlectedCategory
  );

  const filteredJobs = jobs.filter(
    (item: any) =>
      !SlectedCategory || item.category === SlectedCategory
  );

  const stats = [
    {
      number: "300K+",
      labelKey: "home.stats.companiesHiring",
    },
    {
      number: "10K+",
      labelKey: "home.stats.newOpenings",
    },
    {
      number: "21Mn+",
      labelKey: "home.stats.activeStudents",
    },
    {
      number: "600K+",
      labelKey: "home.stats.learners",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HERO
      ================================================= */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="py-12 sm:py-16 lg:py-20 text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-5">
              <BriefcaseBusiness size={16} />
              {t("home.hero.badge")}
            </div>

            <h1 className="max-w-4xl mx-auto text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              {t("home.hero.title")}{" "}
              <span className="text-blue-600">{t("home.hero.titleHighlight")}</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              {t("home.hero.subtitle")}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">

              <Link
                href="/internship"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("home.hero.exploreInternships")}
                <ChevronRight size={18} />
              </Link>

              <Link
                href="/job"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
              >
                {t("home.hero.exploreJobs")}
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          HERO SLIDER
      ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>

              <div
                className={`relative min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] ${slide.bgColor} overflow-hidden`}
              >

                {/* SVG Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">

                  <svg
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    {slide.pattern === "pattern-1" && (
                      <pattern
                        id="pattern-1"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="3"
                          fill="white"
                        />
                      </pattern>
                    )}

                    {slide.pattern === "pattern-2" && (
                      <pattern
                        id="pattern-2"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          x="15"
                          y="15"
                          width="10"
                          height="10"
                          fill="white"
                        />
                      </pattern>
                    )}

                    {slide.pattern === "pattern-3" && (
                      <pattern
                        id="pattern-3"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M0 20 L20 0 L40 20 L20 40 Z"
                          fill="white"
                        />
                      </pattern>
                    )}

                    {slide.pattern === "pattern-4" && (
                      <pattern
                        id="pattern-4"
                        x="0"
                        y="0"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M30 5 L55 30 L30 55 L5 30 Z"
                          fill="white"
                        />
                      </pattern>
                    )}

                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill={`url(#${slide.pattern})`}
                    />

                  </svg>
                </div>

                {/* Slider Content */}
                <div className="relative z-10 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] flex items-center justify-center px-6 sm:px-10">

                  <div className="text-center max-w-3xl">

                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-sm mb-5">
                      <ArrowUpRight
                        className="text-white"
                        size={28}
                      />
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {t(slide.titleKey)}
                    </h2>

                    <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/85 max-w-xl mx-auto">
                      {t(slide.subtitleKey)}
                    </p>

                  </div>

                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                {t("home.categories.eyebrow")}
              </p>

              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                {t("home.categories.title")}
              </h2>
            </div>

            {SlectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="self-start lg:self-auto text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {t("home.categories.clearFilter")}
              </button>
            )}

          </div>

          <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">

            <button
              onClick={() => setSelectedCategory("")}
              className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                SlectedCategory === ""
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t("home.categories.all")}
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  SlectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t(category.key)}
              </button>
            ))}

          </div>
        </div>

      </section>

      {/* =================================================
          INTERNSHIPS
      ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <SectionHeader
          eyebrow={t("home.internships.eyebrow")}
          title={t("home.internships.title")}
          description={t("home.internships.description")}
          href="/internship"
          viewAllText={t("home.sections.viewAll")}
        />

        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-7">

            {filteredInternships.map(
              (internship: any, index: number) => (
                <OpportunityCard
                  key={internship._id || index}
                  type="Internship"
                  title={internship.title}
                  company={internship.company}
                  location={internship.location}
                  amount={internship.stipend}
                  secondary={internship.duration}
                  href={`/detailInternship/${internship._id}`}
                />
              )
            )}

          </div>
        ) : (
          <EmptyState text={t("home.internships.empty")} />
        )}

      </section>

      {/* =================================================
          JOBS
      ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        <SectionHeader
          eyebrow={t("home.jobs.eyebrow")}
          title={t("home.jobs.title")}
          description={t("home.jobs.description")}
          href="/job"
          viewAllText={t("home.sections.viewAll")}
        />

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-7">

            {filteredJobs.map((job: any, index: number) => (
              <OpportunityCard
                key={job._id || index}
                type="Job"
                title={job.title}
                company={job.company}
                location={job.location}
                amount={job.CTC}
                secondary={job.Experience}
                href={`/detailJob/${job._id}`}
              />
            ))}

          </div>
        ) : (
          <EmptyState text={t("home.jobs.empty")} />
        )}

      </section>

      {/* =================================================
          STATS
      ================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">

          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-200">

            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>

                <div className="mt-2 text-xs sm:text-sm lg:text-base text-slate-600">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}

          </div>
        </div>

      </section>

    </div>
  );
}

/* =========================================================
   SECTION HEADER
   ========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  viewAllText,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  viewAllText?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

      <div>
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm sm:text-base text-slate-500">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
      >
        {viewAllText || t("home.sections.viewAll")}
        <ChevronRight size={17} />
      </Link>

    </div>
  );
}

/* =========================================================
   OPPORTUNITY CARD
   ========================================================= */

function OpportunityCard({
  type,
  title,
  company,
  location,
  amount,
  secondary,
  href,
}: {
  type: "Job" | "Internship";
  title: string;
  company: string;
  location: string;
  amount: string;
  secondary: string;
  href: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Badge */}
      <div className="flex items-center justify-between gap-3 mb-5">

        <div className="inline-flex items-center gap-2 text-blue-600">

          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
            <ArrowUpRight size={17} />
          </span>

          <span className="text-sm font-semibold">
            {t("home.cards.activelyHiring")}
          </span>

        </div>

        <span className="shrink-0 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          {type === "Job" ? t("home.cards.job") : t("home.cards.internship")}
        </span>

      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      {/* Company */}
      <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">
        {company}
      </p>

      {/* Details */}
      <div className="mt-5 space-y-3">

        <DetailRow
          icon={<MapPin size={17} />}
          text={location}
          fallbackText={t("home.cards.notSpecified")}
        />

        <DetailRow
          icon={<Banknote size={17} />}
          text={amount}
          fallbackText={t("home.cards.notSpecified")}
        />

        <DetailRow
          icon={<Calendar size={17} />}
          text={secondary}
          fallbackText={t("home.cards.notSpecified")}
        />

      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end">

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {t("home.cards.viewDetails")}
          <ChevronRight
            size={17}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>

      </div>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
   ========================================================= */

function DetailRow({
  icon,
  text,
  fallbackText,
}: {
  icon: React.ReactNode;
  text: string;
  fallbackText?: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-600 min-w-0">

      <span className="text-slate-400 shrink-0 mt-0.5">
        {icon}
      </span>

      <span className="break-words line-clamp-2">
        {text || fallbackText || "Not specified"}
      </span>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-7 bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">

      <Search
        size={32}
        className="mx-auto text-slate-300"
      />

      <p className="mt-3 text-slate-500">
        {text}
      </p>

    </div>
  );
}