import { useLanguage } from "@/context/LanguageContext";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  Mail,
  Send,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const AdminPanel = () => {
  const {t} = useLanguage()
  const stats = [
    {
      label: t("adminpanel.label1"),
      value: "2,345",
      change: "+12%",
      changeType: t("adminpanel.changeP"),
      icon: Mail,
    },
    {
      label: t("adminpanel.label2"),
      value: "45",
      change: "+3%",
      changeType: t("adminpanel.changeP"),
      icon: Briefcase,
    },
    {
      label: t("adminpanel.label3"),
      value: "89",
      change: "+24%",
      changeType: t("adminpanel.changeP"),
      icon: Send,
    },
    {
      label: t("adminpanel.label4"),
      value: "5.25%",
      change: "-1.3%",
      changeType: t("adminpanel.changeN"),
      icon: BarChart3,
    },
  ];

  const menuItems = [
    {
      title: t("adminpanel.title1"),
      description:t("adminpanel.menuitemdesc1"),
      icon: Mail,
      link: "/applications",
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: t("adminpanel.title2"),
      description:t("adminpanel.menuitemdesc2"),
      icon: Briefcase,
      link: "/postJob",
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: t("adminpanel.title3"),
      description:t("adminpanel.menuitemdesc3"),
      icon: Send,
      link: "/postInternship",
      color: "bg-violet-600",
      lightColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: t("adminpanel.title4"),
      description:t("adminpanel.menuitemdesc4"),
      icon: Users,
      link: "/users",
      color: "bg-orange-600",
      lightColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: t("adminpanel.title5"),
      description:t("adminpanel.menuitemdesc5"),
      icon: BarChart3,
      link: "/analytics",
      color: "bg-red-600",
      lightColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: t("adminpanel.title6"),
      description:t("adminpanel.menuitemdesc6"),
      icon: Settings,
      link: "/settings",
      color: "bg-slate-700",
      lightColor: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 px-3 py-6 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            Dashboard Header
        ================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl sm:mb-8 sm:p-8 lg:p-10">
          
          {/* Background decoration */}

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                {t("adminpanel.admincenter")}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {t("adminpanel.admindashboard")}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                {t("adminpanel.adminmanage")}
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:block">
              <ShieldCheck className="h-9 w-9 text-blue-300" />
            </div>
          </div>
        </section>

        {/* ==================================================
            Statistics
        ================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {t("adminpanel.stat1")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("adminpanel.stat2")}
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold sm:px-3 sm:text-xs ${
                        stat.changeType === "positive"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-slate-900 sm:mt-2 sm:text-4xl">
                    {stat.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            Management
        ================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              {t("adminpanel.managment1")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("adminpanel.managment2")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={index}
                  href={item.link}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl sm:p-6"
                >
                  <div className="flex items-start gap-4">

                    {/* Icon */}

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color} shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14`}
                    >
                      <Icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-lg">
                          {item.title}
                        </h3>

                        <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom action */}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-400 transition-colors group-hover:text-blue-600">
                      {t("adminpanel.managment3")} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            Footer Info
        ================================================== */}

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

            <div>
              <h3 className="text-sm font-bold text-blue-900">
                {t("adminpanel.info1")}
              </h3>

              <p className="mt-1 text-xs leading-5 text-blue-700 sm:text-sm">
                {t("adminpanel.info2")}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default AdminPanel;