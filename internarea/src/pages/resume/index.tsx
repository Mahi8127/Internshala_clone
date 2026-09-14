"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Code2,
  Award,
  Languages,
  Heart,
  Plus,
  Trash2,
  Upload,
  FileText,
  Link as LinkIcon,
  Save,
} from "lucide-react";

interface Education {
  college: string;
  degree: string;
  branch: string;
  cgpa: string;
  startYear: string;
  endYear: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  github: string;
}

const inputClass =
  "w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60";

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-y";

const sectionClass =
  "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden";

const Resume = () => {
  const router = useRouter();
  const user = useSelector(selectuser);

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    objective: "",
    skills: "",
    certification: "",
    languages: "",
    interests: "",

    education: [
      {
        degree: "",
        college: "",
        cgpa: "",
        branch: "",
        startYear: "",
        endYear: "",
      },
    ] as Education[],

    experience: [
      {
        company: "",
        position: "",
        duration: "",
        description: "",
      },
    ] as Experience[],

    projects: [
      {
        title: "",
        description: "",
        github: "",
      },
    ] as Project[],
  });

  /* ---------------- PHOTO PREVIEW ---------------- */

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photo]);

  /* ---------------- BASIC INPUT ---------------- */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------- EDUCATION ---------------- */

  const handleEducationChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...formData.education];

    values[index] = {
      ...values[index],
      [e.target.name]: e.target.value,
    };

    setFormData((prev) => ({
      ...prev,
      education: values,
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          college: "",
          cgpa: "",
          branch: "",
          startYear: "",
          endYear: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- EXPERIENCE ---------------- */

  const handleExperienceChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const values = [...formData.experience];

    values[index] = {
      ...values[index],
      [e.target.name]: e.target.value,
    };

    setFormData((prev) => ({
      ...prev,
      experience: values,
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          duration: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- PROJECTS ---------------- */

  const handleProjectChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const values = [...formData.projects];

    values[index] = {
      ...values[index],
      [e.target.name]: e.target.value,
    };

    setFormData((prev) => ({
      ...prev,
      projects: values,
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
          github: "",
        },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Please login before creating your resume");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("user", user.id);
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("linkedin", formData.linkedin);
      data.append("github", formData.github);
      data.append("portfolio", formData.portfolio);
      data.append("objective", formData.objective);

      data.append("education", JSON.stringify(formData.education));
      data.append("experience", JSON.stringify(formData.experience));
      data.append("projects", JSON.stringify(formData.projects));

      data.append(
        "skills",
        JSON.stringify(
          formData.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      data.append(
        "certification",
        JSON.stringify(
          formData.certification
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      data.append(
        "languages",
        JSON.stringify(
          formData.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      data.append("interests", formData.interests);

      if (photo) {
        data.append("photo", photo);
      }

      const response = await axios.post(
        "http://localhost:5000/api/resume",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      router.push("/profile");
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SECTION HEADER ---------------- */

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
    action,
  }: {
    icon: any;
    title: string;
    description?: string;
    action?: React.ReactNode;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-7 py-5 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h2>

          {description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );

  /* ---------------- ADD BUTTON ---------------- */

  const AddButton = ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition active:scale-[0.98]"
    >
      <Plus size={17} />
      {children}
    </button>
  );

  /* ---------------- RENDER ---------------- */

  return (
    <main className="min-h-screen bg-gray-50 px-3 sm:px-5 py-6 sm:py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl mx-auto space-y-5 sm:space-y-7"
      >
        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-600">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Resume Builder
              </h1>

              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Create a professional resume that helps you stand out.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
            <p className="text-xs sm:text-sm text-blue-700">
              Fill in your details below. You can add multiple education,
              experience and project entries.
            </p>
          </div>
        </div>

        {/* PROFILE PHOTO */}
        <section className={sectionClass}>
          <SectionHeader
            icon={User}
            title="Profile Photo"
            description="Add a professional profile picture"
          />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-dashed border-blue-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-3">
                    <User className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="text-xs text-gray-400 mt-2">
                      No Photo
                    </p>
                  </div>
                )}
              </div>

              <label className="mt-5 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition active:scale-[0.98]">
                <Upload size={18} />
                {photo ? "Change Photo" : "Choose Photo"}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setPhoto(file);
                    }
                  }}
                />
              </label>

              <p className="text-xs text-gray-400 mt-2 text-center">
                JPG, PNG or other image formats
              </p>
            </div>
          </div>
        </section>

        {/* PERSONAL INFORMATION */}
        <section className={sectionClass}>
          <SectionHeader
            icon={User}
            title="Personal Information"
            description="Basic information for your resume"
          />

          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Full Name *</label>
              <input
                type="text"
                name="fullname"
                placeholder="Enter full name"
                required
                value={formData.fullname}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="field-label">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="field-label">Phone *</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="field-label">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="field-label">LinkedIn</label>
              <div className="relative">
                <LinkIcon
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn profile URL"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="field-label">GitHub</label>
              <div className="relative">
                <LinkIcon
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="github"
                  placeholder="GitHub profile URL"
                  value={formData.github}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Portfolio</label>
              <div className="relative">
                <LinkIcon
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="portfolio"
                  placeholder="Portfolio website URL"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CAREER OBJECTIVE */}
        <section className={sectionClass}>
          <SectionHeader
            icon={Briefcase}
            title="Career Objective"
            description="Briefly describe your career goals"
          />

          <div className="p-5 sm:p-7">
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              rows={5}
              placeholder="Write your career objective..."
              className={textareaClass}
            />
          </div>
        </section>

        {/* EDUCATION */}
        <section className={sectionClass}>
          <SectionHeader
            icon={GraduationCap}
            title="Education"
            description="Add your academic background"
            action={
              <AddButton onClick={addEducation}>
                Add Education
              </AddButton>
            }
          />

          <div className="p-5 sm:p-7 space-y-4">
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Education {index + 1}
                  </h3>

                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="field-label">College / University</label>
                    <input
                      type="text"
                      name="college"
                      value={edu.college}
                      placeholder="College or university"
                      onChange={(e) =>
                        handleEducationChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={edu.degree}
                      placeholder="B.Tech, BCA, MBA..."
                      onChange={(e) =>
                        handleEducationChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={edu.branch}
                      placeholder="Computer Science..."
                      onChange={(e) =>
                        handleEducationChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">CGPA</label>
                    <input
                      type="text"
                      name="cgpa"
                      value={edu.cgpa}
                      placeholder="8.5"
                      onChange={(e) =>
                        handleEducationChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">Start Year</label>
                    <input
                      type="text"
                      name="startYear"
                      value={edu.startYear}
                      placeholder="2022"
                      onChange={(e) =>
                        handleEducationChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">End Year</label>
                    <input
                      type="text"
                      name="endYear"
                      value={edu.endYear}
                      placeholder="2026"
                      onChange={(e) =>
                        handleEducationChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className={sectionClass}>
          <SectionHeader
            icon={Briefcase}
            title="Experience"
            description="Add your work experience"
            action={
              <AddButton onClick={addExperience}>
                Add Experience
              </AddButton>
            }
          />

          <div className="p-5 sm:p-7 space-y-4">
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Experience {index + 1}
                  </h3>

                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      placeholder="Company name"
                      onChange={(e) =>
                        handleExperienceChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">Job Position</label>
                    <input
                      type="text"
                      name="position"
                      value={exp.position}
                      placeholder="Software Developer"
                      onChange={(e) =>
                        handleExperienceChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={exp.duration}
                      placeholder="Jan 2026 - Apr 2026"
                      onChange={(e) =>
                        handleExperienceChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="field-label">Description</label>
                    <textarea
                      name="description"
                      value={exp.description}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                      onChange={(e) =>
                        handleExperienceChange(index, e)
                      }
                      className={textareaClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className={sectionClass}>
          <SectionHeader
            icon={FolderGit2}
            title="Projects"
            description="Showcase your best projects"
            action={
              <AddButton onClick={addProject}>
                Add Project
              </AddButton>
            }
          />

          <div className="p-5 sm:p-7 space-y-4">
            {formData.projects.map((pro, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Project {index + 1}
                  </h3>

                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="field-label">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      value={pro.title}
                      placeholder="Project title"
                      onChange={(e) =>
                        handleProjectChange(index, e)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">Description</label>
                    <textarea
                      name="description"
                      value={pro.description}
                      placeholder="Describe your project..."
                      rows={4}
                      onChange={(e) =>
                        handleProjectChange(index, e)
                      }
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      GitHub Repository
                    </label>

                    <div className="relative">
                      <LinkIcon
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="github"
                        value={pro.github}
                        placeholder="https://github.com/username/project"
                        onChange={(e) =>
                          handleProjectChange(index, e)
                        }
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section className={sectionClass}>
          <SectionHeader
            icon={Code2}
            title="Skills"
            description="List your technical and professional skills"
          />

          <div className="p-5 sm:p-7">
            <input
              type="text"
              name="skills"
              value={formData.skills}
              placeholder="React, Node.js, MongoDB"
              onChange={handleChange}
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-400">
              Separate multiple skills with commas.
            </p>
          </div>
        </section>

        {/* CERTIFICATION */}
        <section className={sectionClass}>
          <SectionHeader
            icon={Award}
            title="Certification"
            description="Add your certifications"
          />

          <div className="p-5 sm:p-7">
            <input
              type="text"
              name="certification"
              value={formData.certification}
              placeholder="AWS, Coursera..."
              onChange={handleChange}
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-400">
              Separate multiple certifications with commas.
            </p>
          </div>
        </section>

        {/* LANGUAGES */}
        <section className={sectionClass}>
          <SectionHeader
            icon={Languages}
            title="Languages"
            description="Mention the languages you know"
          />

          <div className="p-5 sm:p-7">
            <input
              type="text"
              name="languages"
              value={formData.languages}
              placeholder="English, Hindi"
              onChange={handleChange}
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-400">
              Separate multiple languages with commas.
            </p>
          </div>
        </section>

        {/* INTERESTS */}
        <section className={sectionClass}>
          <SectionHeader
            icon={Heart}
            title="Interests"
            description="Add your professional or personal interests"
          />

          <div className="p-5 sm:p-7">
            <input
              type="text"
              name="interests"
              value={formData.interests}
              placeholder="Web Development, UI Design"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </section>

        {/* SAVE */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-13 sm:h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={20} />

            {loading ? "Saving Resume..." : "Save Resume"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Your resume will be saved to your profile.
          </p>
        </div>
      </form>
    </main>
  );
};

export default Resume;