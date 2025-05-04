const express = require("express");
const Faculty = require("../models/Faculty");
const router = express.Router();

// POST /api/faculty/submit-link/:empId
router.post("/submit-link/:empId", async (req, res) => {
  const { empId } = req.params;
  const { type, link } = req.body;

  if (!["wit", "will"].includes(type)) {
    return res.status(400).json({ error: "Invalid report type" });
  }

  try {
    const faculty = await Faculty.findOne({ empId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    if (type === "wit") faculty.witReport = link;
    else if (type === "will") faculty.willReport = link;

    await faculty.save();
    res.json({ message: "Link submitted successfully", faculty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
