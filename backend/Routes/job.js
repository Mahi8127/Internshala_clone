const express = require("express");
const router = express.Router();

const Job = require("../Model/Job");

router.post("/", async (req, res) => {
  try {
    const jobdata = new Job({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      Experience: req.body.Experience,
      category: req.body.category,
      aboutCompany: req.body.aboutCompany,
      aboutJob: req.body.aboutJob,
      Whocanapply: req.body.Whocanapply,
      perks: req.body.perks,
      CTC: req.body.CTC,
      startDate: req.body.startDate,
      AdditionalInfo: req.body.AdditionalInfo,
      numberofopening: req.body.numberofopening,
    });
    const data = await jobdata.save();
    return res.status(201).json(data);
  } catch (error) {
    console.error("Create job error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Job.find();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get jobs error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Job.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get job error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
