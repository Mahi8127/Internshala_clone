import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* ================= MAIN FOOTER ================= */}
        <div className="py-12 sm:py-14">

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            {/* Internship by places */}
            <FooterSection
              title="Internship by Places"
              items={[
                "New York",
                "Los Angeles",
                "Chicago",
                "San Francisco",
                "Miami",
                "Seattle",
              ]}
            />

            {/* Internship by stream */}
            <FooterSection
              title="Internship by Stream"
              items={[
                "About us",
                "Careers",
                "Press",
                "News",
                "Media kit",
                "Contact",
              ]}
            />

            {/* Job Places */}
            <FooterSection
              title="Job Places"
              items={[
                "Blog",
                "Newsletter",
                "Events",
                "Help center",
                "Tutorials",
                "Support",
              ]}
              links
            />

            {/* Jobs by streams */}
            <FooterSection
              title="Jobs by Streams"
              items={[
                "Startups",
                "Enterprise",
                "Government",
                "SaaS",
                "Marketplaces",
                "Ecommerce",
              ]}
              links
            />

          </div>

          {/* ================= DIVIDER ================= */}
          <div className="my-10 border-t border-slate-700" />

          {/* ================= SECONDARY LINKS ================= */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

            <FooterSection
              title="About Us"
              items={[
                "Startups",
                "Enterprise",
              ]}
              links
            />

            <FooterSection
              title="Team Diary"
              items={[
                "Startups",
                "Enterprise",
              ]}
              links
            />

            <FooterSection
              title="Terms & Conditions"
              items={[
                "Startups",
                "Enterprise",
              ]}
              links
            />

            <FooterSection
              title="Sitemap"
              items={[
                "Startups",
              ]}
              links
            />

          </div>
        </div>

        {/* ================= BOTTOM FOOTER ================= */}
        <div className="border-t border-slate-700 py-7">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            {/* Android App */}
            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-3 border border-slate-500 px-5 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-400 transition-all duration-200"
            >
              <span className="text-lg">▶</span>
              <span>Get Android App</span>
            </button>

            {/* Social Media */}
            <div className="flex items-center gap-4">

              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <FaFacebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-sky-500 hover:text-white transition-all duration-200"
              >
                <FaTwitter className="w-5 h-5" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-pink-500 hover:text-white transition-all duration-200"
              >
                <FaInstagram className="w-5 h-5" />
              </a>

            </div>

            {/* Copyright */}
            <p className="text-sm text-slate-400 text-center lg:text-right">
              © Copyright 2025. All Rights Reserved.
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER SECTION
   ========================================================= */

function FooterSection({
  title,
  items,
  links,
}: {
  title: string;
  items: string[];
  links?: boolean;
}) {
  return (
    <div className="min-w-0">

      <h3 className="text-sm font-bold uppercase tracking-wide text-white">
        {title}
      </h3>

      <div className="mt-5 flex flex-col items-start gap-3">

        {items.map((item, index) =>
          links ? (
            <a
              key={index}
              href="/"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
            >
              {item}
            </a>
          ) : (
            <p
              key={index}
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
            >
              {item}
            </p>
          )
        )}

      </div>
    </div>
  );
}