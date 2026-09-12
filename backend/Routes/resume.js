const express = require("express");
const router = express.Router();

const upload = require("../Middleware/multer");
const {
  createResume,
  getResume,
  updateResume,
  uploadResumePdf,
} = require("../Controllers/resumeController");

router.post("/", upload.single("photo"), createResume);
router.get("/:userId", getResume);
router.put("/:id", upload.single("photo"), updateResume);
router.post("/upload-pdf", upload.single("resume"), uploadResumePdf);

module.exports = router;
