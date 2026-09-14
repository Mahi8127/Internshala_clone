import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";

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

interface ResumeFormData {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  objective: string;
  skills: string;
  certification: string;
  languages: string;
  interests: string;
  photo: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

const textareaClass =
  "w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const emptyEducation = (): Education => ({
  college: "",
  degree: "",
  branch: "",
  cgpa: "",
  startYear: "",
  endYear: "",
});

const emptyExperience = (): Experience => ({
  company: "",
  position: "",
  duration: "",
  description: "",
});

const emptyProject = (): Project => ({
  title: "",
  description: "",
  github: "",
});

const SectionHeader = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) => (
  <div className="mb-6 flex items-start gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
      {number}
    </div>

    <div>
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  </div>
);

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const Resume = () => {
  const router = useRouter();
  const user = useSelector(selectuser);

  const [resumeId, setResumeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState<ResumeFormData>({
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
    photo: "",
    education: [emptyEducation()],
    experience: [emptyExperience()],
    projects: [emptyProject()],
  });

  // --------------------------------------------------
  // Photo preview
  // --------------------------------------------------

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // --------------------------------------------------
  // Fetch existing resume
  // --------------------------------------------------

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/resume/${user.id}`
        );

        const resume = res.data.resume;

        setResumeId(resume._id);

        setFormData({
          fullname: resume.fullname || "",
          email: resume.email || "",
          phone: resume.phone || "",
          address: resume.address || "",
          linkedin: resume.linkedin || "",
          github: resume.github || "",
          portfolio: resume.portfolio || "",
          photo: resume.photo || "",
          objective: resume.objective || "",

          skills: Array.isArray(resume.skills)
            ? resume.skills.join(", ")
            : "",

          certification: Array.isArray(resume.certification)
            ? resume.certification.join(", ")
            : "",

          languages: Array.isArray(resume.languages)
            ? resume.languages.join(", ")
            : "",

          interests: resume.interests || "",

          education:
            Array.isArray(resume.education) && resume.education.length > 0
              ? resume.education
              : [emptyEducation()],

          experience:
            Array.isArray(resume.experience) && resume.experience.length > 0
              ? resume.experience
              : [emptyExperience()],

          projects:
            Array.isArray(resume.projects) && resume.projects.length > 0
              ? resume.projects
              : [emptyProject()],
        });
      } catch (error) {
        console.error("Failed to fetch resume:", error);
        toast.error("Unable to load your resume");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchResume();
    }
  }, [user]);

  // --------------------------------------------------
  // Authentication guard
  // --------------------------------------------------

  useEffect(() => {
    if (!loading && !user?.id) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [loading, user, router]);

  // --------------------------------------------------
  // Basic field change
  // --------------------------------------------------

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Education
  // --------------------------------------------------

  const handleEducationChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const education = [...prev.education];

      education[index] = {
        ...education[index],
        [name]: value,
      };

      return {
        ...prev,
        education,
      };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, emptyEducation()],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => {
      if (prev.education.length <= 1) return prev;

      return {
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      };
    });
  };

  // --------------------------------------------------
  // Experience
  // --------------------------------------------------

  const handleExperienceChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const experience = [...prev.experience];

      experience[index] = {
        ...experience[index],
        [name]: value,
      };

      return {
        ...prev,
        experience,
      };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, emptyExperience()],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => {
      if (prev.experience.length <= 1) return prev;

      return {
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index),
      };
    });
  };

  // --------------------------------------------------
  // Projects
  // --------------------------------------------------

  const handleProjectChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const projects = [...prev.projects];

      projects[index] = {
        ...projects[index],
        [name]: value,
      };

      return {
        ...prev,
        projects,
      };
    });
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, emptyProject()],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => {
      if (prev.projects.length <= 1) return prev;

      return {
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      };
    });
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!resumeId) {
      toast.error("Resume is still loading");
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

      const response = await axios.put(
        `http://localhost:5000/api/resume/${resumeId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Resume updated successfully");

      router.push("/profile");
    } catch (error: any) {
      console.error("Resume update error:", error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const existingPhoto = useMemo(() => {
    if (!formData.photo) return "";

    return `http://localhost:5000/uploads/profilePhoto/${formData.photo}`;
  }, [formData.photo]);

  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (loading && !resumeId) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <h2 className="text-lg font-bold text-slate-800">
            Loading your resume...
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while we fetch your information.
          </p>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 px-3 py-8 sm:px-5 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* --------------------------------------------------
            Page Header
        -------------------------------------------------- */}

        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                Resume Builder
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Edit Resume
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Update your profile, education, experience and projects.
                Keep your resume complete and professional.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="w-full rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
            >
              ← Back to Profile
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* --------------------------------------------------
              Profile Photo
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="01"
              title="Profile Photo"
              description="Use a clear and professional profile picture."
            />

            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8">
              <div className="mb-5 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="New profile preview"
                    className="h-32 w-32 object-cover sm:h-40 sm:w-40"
                  />
                ) : existingPhoto ? (
                  <img
                    src={existingPhoto}
                    alt="Current profile"
                    className="h-32 w-32 object-cover sm:h-40 sm:w-40"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center text-sm font-medium text-slate-500 sm:h-40 sm:w-40">
                    No Photo
                  </div>
                )}
              </div>

              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]">
                Choose New Photo

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

              <p className="mt-3 text-center text-xs text-slate-500">
                JPG, PNG or other supported image formats
              </p>
            </div>
          </section>

          {/* --------------------------------------------------
              Personal Information
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="02"
              title="Personal Information"
              description="Keep your contact information accurate."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Full Name">
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </Field>

              <Field label="Phone Number">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </Field>

              <Field label="Address">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={inputClass}
                />
              </Field>

              <Field label="LinkedIn">
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn profile URL"
                  className={inputClass}
                />
              </Field>

              <Field label="GitHub">
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="GitHub profile URL"
                  className={inputClass}
                />
              </Field>

              <Field label="Portfolio" className="md:col-span-2">
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="Portfolio website URL"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {/* --------------------------------------------------
              Career Objective
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="03"
              title="Career Objective"
              description="Briefly describe your professional goal."
            />

            <Field label="Objective">
              <textarea
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                rows={6}
                placeholder="Write your career objective..."
                className={textareaClass}
              />
            </Field>
          </section>

          {/* --------------------------------------------------
              Education
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeader
                number="04"
                title="Education"
                description="Add your academic qualifications."
              />

              <button
                type="button"
                onClick={addEducation}
                className="min-h-11 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
              >
                + Add Education
              </button>
            </div>

            <div className="space-y-5">
              {formData.education.map((edu, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-800">
                      Education #{index + 1}
                    </h3>

                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="College / University" className="md:col-span-2">
                      <input
                        type="text"
                        name="college"
                        value={edu.college}
                        placeholder="College / University"
                        onChange={(e) =>
                          handleEducationChange(index, e)
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Degree">
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
                    </Field>

                    <Field label="Branch">
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
                    </Field>

                    <Field label="CGPA">
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
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Start Year">
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
                      </Field>

                      <Field label="End Year">
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
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------
              Experience
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeader
                number="05"
                title="Experience"
                description="Add internships, jobs or relevant work experience."
              />

              <button
                type="button"
                onClick={addExperience}
                className="min-h-11 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
              >
                + Add Experience
              </button>
            </div>

            <div className="space-y-5">
              {formData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-800">
                      Experience #{index + 1}
                    </h3>

                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Company Name">
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
                    </Field>

                    <Field label="Job Position">
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
                    </Field>

                    <Field label="Duration">
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
                    </Field>

                    <div className="hidden md:block" />

                    <Field
                      label="Description"
                      className="md:col-span-2"
                    >
                      <textarea
                        name="description"
                        value={exp.description}
                        placeholder="Describe your responsibilities, achievements and work..."
                        rows={5}
                        onChange={(e) =>
                          handleExperienceChange(index, e)
                        }
                        className={textareaClass}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------
              Projects
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeader
                number="06"
                title="Projects"
                description="Showcase projects that demonstrate your skills."
              />

              <button
                type="button"
                onClick={addProject}
                className="min-h-11 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
              >
                + Add Project
              </button>
            </div>

            <div className="space-y-5">
              {formData.projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-800">
                      Project #{index + 1}
                    </h3>

                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <Field label="Project Title">
                      <input
                        type="text"
                        name="title"
                        value={project.title}
                        placeholder="Project title"
                        onChange={(e) =>
                          handleProjectChange(index, e)
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Project Description">
                      <textarea
                        name="description"
                        value={project.description}
                        placeholder="Describe what you built, the technologies used and your contribution..."
                        rows={5}
                        onChange={(e) =>
                          handleProjectChange(index, e)
                        }
                        className={textareaClass}
                      />
                    </Field>

                    <Field label="GitHub Repository">
                      <input
                        type="text"
                        name="github"
                        value={project.github}
                        placeholder="https://github.com/username/project"
                        onChange={(e) =>
                          handleProjectChange(index, e)
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------
              Skills
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="07"
              title="Skills"
              description="Separate multiple skills using commas."
            />

            <Field label="Skills">
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Python"
                className={inputClass}
              />
            </Field>
          </section>

          {/* --------------------------------------------------
              Certifications
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="08"
              title="Certifications"
              description="Add relevant certifications and courses."
            />

            <Field label="Certifications">
              <input
                type="text"
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                placeholder="AWS, Google Cloud, Coursera..."
                className={inputClass}
              />
            </Field>
          </section>

          {/* --------------------------------------------------
              Languages
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="09"
              title="Languages"
              description="List the languages you can communicate in."
            />

            <Field label="Languages">
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Hindi, Gujarati"
                className={inputClass}
              />
            </Field>
          </section>

          {/* --------------------------------------------------
              Interests
          -------------------------------------------------- */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <SectionHeader
              number="10"
              title="Interests"
              description="Add professional or personal interests."
            />

            <Field label="Interests">
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Web Development, UI Design, AI..."
                className={inputClass}
              />
            </Field>
          </section>

          {/* --------------------------------------------------
              Submit
          -------------------------------------------------- */}

          <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-4 text-base font-extrabold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
              {loading ? (
                <>
                  <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Resume...
                </>
              ) : (
                "Update Resume"
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};

export default Resume;