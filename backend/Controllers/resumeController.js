const Resume = require("../Model/Resume");

const getResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createResume = async (req, res) => {
  try {
    const {
      user,
      fullname,
      email,
      phone,
      address,
      linkedin,
      github,
      portfolio,
      objective,
      education,
      experience,
      projects,
      skills,
      certification,
      languages,
      interests,
    } = req.body;

    const photo = req.file ? req.file.filename : "";
    const resume = await Resume.create({
      user,
      fullname,
      email,
      phone,
      address,
      linkedin,
      github,
      portfolio,
      objective,
      education: JSON.parse(education),
      experience: JSON.parse(experience),
      projects: JSON.parse(projects),
      skills: JSON.parse(skills),
      certification: JSON.parse(certification),
      languages: JSON.parse(languages),
      interests,
      photo,
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    if (updateData.education) {
      updateData.education = JSON.parse(updateData.education);
    }
    if (updateData.experience) {
      updateData.experience = JSON.parse(updateData.experience);
    }
    if (updateData.projects) {
      updateData.projects = JSON.parse(updateData.projects);
    }
    if (updateData.skills) {
      updateData.skills = JSON.parse(updateData.skills);
    }
    if (updateData.certification) {
      updateData.certification = JSON.parse(updateData.certification);
    }
    if (updateData.languages) {
      updateData.languages = JSON.parse(updateData.languages);
    }

    const resume = await Resume.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadResumePdf = async(req,res) =>{
  try {
    const {userId} = req.body
    const resume = await Resume.findOne({user: userId})

    if(!resume){
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      })
    }

    resume.resumeUrl = req.file.filename
    await resume.save()

    res.json({
      success:true,
      message: "Resume Upload Successfully",
      resumeUrl: req.file.filename
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Upload failed"
    })
  }
}

module.exports = {
  createResume,
  getResume,
  updateResume,
  uploadResumePdf,
};
