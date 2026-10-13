const express = require("express");
const router = express.Router();

const Internship = require("../Model/Internship");

router.post("/", async (req, res) => {
  try {
    const internshipdata = new Internship({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      category: req.body.category,
      aboutCompany: req.body.aboutCompany,
      aboutInternship: req.body.aboutInternship,
      whoCanApply: req.body.whoCanApply,
      perks: req.body.perks,
      numberOfOpening: req.body.numberOfOpening,
      stipend: req.body.stipend,
      startDate: req.body.startDate,
      additionalInfo: req.body.additionalInfo,
    });
    const data = await internshipdata.save();
    return res.status(201).json(data);
  } catch (error) {
    console.error("Create internship error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Internship.find();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get internships error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Internship.findById(id);
    if (!data) {
      return res.status(404).json({ error: "internship not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get internship error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
