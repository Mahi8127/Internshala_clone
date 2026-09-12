import { BarChart, Briefcase, Mail, Send, Settings, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const index = () => {
  const stats = [
    {
      label: "Total Applications",
      value: "2,345",
      change: "+12%",
      changeType: "positive",
    },
    {
      label: "Active Jobs",
      value: "45",
      change: "+3%",
      changeType: "positive",
    },
    {
      label: "Active Internships",
      value: "89",
      change: "+24%",
      changeType: "positive",
    },
    {
      label: "Conversion Rate",
      value: "5.25%",
      change: "-1.3%",
      changeType: "negative",
    },
  ];

  const menuItems = [
    {
      title: "View Applications",
      description: "View and manage all applications from candidates",
      icon: Mail,
      link: "/applications",
      color: "bg-blue-600",
    },
    {
      title: "Post Job",
      description: "Create and publish new job opportunities",
      icon: Briefcase,
      link: "/postJob",
      color: "bg-green-600",
    },
    {
      title: "Post Internship",
      description: "Create and manage internship positions",
      icon: Send,
      link: "/postInternship",
      color: "bg-purple-600",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      link: "/users",
      color: "bg-orange-600",
    },
    {
      title: "Analytics",
      description: "View detailed reports and statistics",
      icon: BarChart,
      link: "/analytics",
      color: "bg-red-600",
    },
    {
      title: "Settings",
      description: "Configure system preferences",
      icon: Settings,
      link: "/settings",
      color: "bg-gray-600",
    },
  ];
  return(
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
                <p className="mt-3 text-lg text-gray-900">Manage your jobs, internships, and applications from one place</p>
            </div>

            {/* stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat,index)=>(
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:translate-y-2 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">{stat.label}</p>
                        <h2 className="mt-3 text-4xl font-bold text-blue-600">{stat.value}</h2>
                      </div>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        stat.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Dashboard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item, index)=>(
                  <Link key={index} href={item.link} className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-2-2 transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-center gap-5">
                        <div className={`${item.color} p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="h-8 w-8 text-white"/>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
        </div>
    </div>
  );
};

export default index;
