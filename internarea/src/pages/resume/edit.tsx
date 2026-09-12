import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
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

const Resume = () => {
  const router = useRouter();
  const user = useSelector(selectuser);
  const [resumeId, setResumeId] = useState("");

  console.log("Redux user:", user);
  if (typeof window !== "undefined") {
    console.log(localStorage.getItem("user"));
  }

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/resume/${user.id}`,
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

          skills: resume.skills.join(", ") || "",
          certification: resume.certification.join(", ") || "",
          languages: resume.languages.join(", ") || "",
          interests: resume.interests || "",

          education: resume.education || [],
          experience: resume.experience || [],
          projects: resume.projects || [],
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchResume();
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
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
    photo: "",

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Redux User:", user);
      const data = new FormData();

      data.append("user", user?.id);
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
            .filter(Boolean),
        ),
      );

      data.append(
        "certification",
        JSON.stringify(
          formData.certification
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      data.append(
        "languages",
        JSON.stringify(
          formData.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      data.append("interests", formData.interests);

      if (photo) {
        data.append("photo", photo);
      }

      if (!resumeId) {
        toast.error("Resume not loaded yet");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/resume/${resumeId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(response.data.message);
      console.log(response.data);
      router.push("/profile");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEducationChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const values = [...formData.education];
    values[index][e.target.name as keyof Education] = e.target.value;

    setFormData({
      ...formData,
      education: values,
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          college: "",
          cgpa: "",
          branch: "",
          startYear: "",
          endYear: "",
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const values = [...formData.education];
    values.splice(index, 1);

    setFormData({
      ...formData,
      education: values,
    });
  };

  const handleExperienceChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const values = [...formData.experience];
    values[index][e.target.name as keyof Experience] = e.target.value;

    setFormData({
      ...formData,
      experience: values,
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          company: "",
          position: "",
          duration: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const values = [...formData.experience];
    values.splice(index, 1);

    setFormData({
      ...formData,
      experience: values,
    });
  };

  const handleProjectChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const values = [...formData.projects];
    values[index][e.target.name as keyof Project] = e.target.value;

    setFormData({
      ...formData,
      projects: values,
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          title: "",
          description: "",
          github: "",
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    const values = [...formData.projects];
    values.splice(index, 1);

    setFormData({
      ...formData,
      projects: values,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-16 px-5">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10 space-y-10"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Edit Resume
        </h1>

        <div className="border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Profile Photo
          </h2>
          <div className="flex flex-col items-center gap-5">
            {photo ? (
              <img
                src={URL.createObjectURL(photo)}
                className="w-40 h-40 object-cover"
              />
            ) : formData.photo ? (
              <img
                src={`http://localhost:5000/uploads/profilePhoto/${formData.photo}`}
                className="w-40 h-40 object-cover"
              />
            ) : (
              <span>No Photo</span>
            )}

            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setPhoto(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="fullname"
              placeholder="Enter Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Enter Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none"
            />

            <input
              type="text"
              name="linkedin"
              placeholder="Linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none"
            />

            <input
              type="text"
              name="github"
              placeholder="Github"
              value={formData.github}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none"
            />

            <input
              type="text"
              name="portfolio"
              placeholder="Portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
            />
          </div>
        </div>

        {/* Career Objective */}
        <div className="border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Career Objective
          </h2>

          <textarea
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            rows={5}
            placeholder="Write your career objective..."
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
          />
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
            >
              {" "}
              + Add Education
            </button>
          </div>

          {formData.education.map((edu, index) => (
            <div key={index} className="border rounded-xl p-5 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="college"
                  value={edu.college}
                  placeholder="College"
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  placeholder="Degree"
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="branch"
                  value={edu.branch}
                  placeholder="Branch"
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="cgpa"
                  value={edu.cgpa}
                  placeholder="CGPA"
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="startYear"
                  value={edu.startYear}
                  placeholder="Start Year"
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none "
                />

                <input
                  type="text"
                  name="endYear"
                  value={edu.endYear}
                  placeholder="End Year"
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none "
                />
              </div>
              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 text-red-600 px-4 py-2 font-semibold hover:bg-red-100 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
            >
              {" "}
              + Add Experience
            </button>
          </div>

          {formData.experience.map((exp, index) => (
            <div key={index} className="border rounded-xl p-5 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="company"
                  value={exp.company}
                  placeholder="Company Name"
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="position"
                  value={exp.position}
                  placeholder="Job Position"
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />
                <input
                  type="text"
                  name="description"
                  value={exp.description}
                  placeholder="Describe your work..."
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />
                <input
                  type="text"
                  name="duration"
                  value={exp.duration}
                  placeholder="Jan 2026 - Apr 2026"
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />
              </div>
              {formData.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 text-red-600 px-4 py-2 font-semibold hover:bg-red-100 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Project */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Project</h2>
            <button
              type="button"
              onClick={addProject}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
            >
              {" "}
              + Add Project
            </button>
          </div>

          {formData.projects.map((pro, index) => (
            <div key={index} className="border rounded-xl p-5 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  value={pro.title}
                  placeholder="Project Title"
                  onChange={(e) => handleProjectChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="description"
                  value={pro.description}
                  placeholder="Describe your project..."
                  onChange={(e) => handleProjectChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />

                <input
                  type="text"
                  name="github"
                  value={pro.github}
                  placeholder="Github Repository URL"
                  onChange={(e) => handleProjectChange(index, e)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
                />
              </div>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 text-red-600 px-4 py-2 font-semibold hover:bg-red-100 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Skills */}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 border-b border-gray-200 pb-4 mb-8">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="skills"
              value={formData.skills}
              placeholder="React, Node.js, MongoDB"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Certification */}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 border-b border-gray-200 pb-4 mb-8">
            Certification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="certification"
              value={formData.certification}
              placeholder="AWS, Coursera..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Language */}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 border-b border-gray-200 pb-4 mb-8">
            Language
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="languages"
              value={formData.languages}
              placeholder="English, Hindi"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Interests */}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 border-b border-gray-200 pb-4 mb-8">
            Interests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="interests"
              value={formData.interests}
              placeholder="Web Development, UI Design"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-800 placeholder:text-gray-400 transition duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-100 outline-none md:col-span-2"
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:translate-y-1 transition-all duration-300"
        >
          {loading ? "Updating Resume..." : "Update Resume"}
        </button>
      </form>
    </div>
  );
};

export default Resume;
