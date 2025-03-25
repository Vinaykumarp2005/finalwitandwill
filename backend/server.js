const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const updateFacultyDatabase = require("./utils/scraper");
require("./utils/scheduler");
const Faculty = require("./models/Faculty");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/timetableDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define MongoDB Schemas & Models
const subjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectName: String,
  lecturers: [String],
});

const facultySchema = new mongoose.Schema({
  name: String,
  empId: String,
  designation: String,
  witReport: { type: String, default: null }, // Path to uploaded WIT report
  willReport: { type: String, default: null }, // Path to uploaded WILL report
});

const Subject = mongoose.model("Subject", subjectSchema);

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Scrape and update faculty data on server start
updateFacultyDatabase();

// -------------------------- ROUTES ----------------------------

// 1. Upload Timetable and Extract Subjects
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("✅ File uploaded:", req.file.path);

    // Extract subjects using Python script
    const subjects = await extractSubjects(req.file.path);
    console.log("📄 Extracted Subjects Before Saving:", JSON.stringify(subjects, null, 2));

    if (!subjects || subjects.length === 0) {
      console.log("⚠ No subjects found, sending 400 response.");
      return res.status(400).json({ error: "No subjects found in the document." });
    }

    // Store subjects in MongoDB with unique lecturers
    for (const subject of subjects) {
      const existingSubject = await Subject.findOne({ subjectCode: subject.subjectCode });

      if (existingSubject) {
        const updatedLecturers = [...new Set([...existingSubject.lecturers, ...subject.lecturers])];
        await Subject.updateOne({ subjectCode: subject.subjectCode }, { $set: { subjectName: subject.subjectName, lecturers: updatedLecturers } });
      } else {
        await Subject.create(subject);
      }
    }

    console.log("✅ Subjects successfully saved to MongoDB");
    res.json({ subjects });
  } catch (error) {
    console.error("❌ Error processing file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to Extract Subjects using Python
async function extractSubjects(filePath) {
  return new Promise((resolve, reject) => {
    exec(`python extract_subjects.py "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error running Python script:", error.message);
        return reject([]);
      }
      if (stderr) {
        console.error("⚠ Python script stderr:", stderr);
      }
      try {
        const subjects = JSON.parse(stdout.trim());
        console.log("📄 Extracted Subjects:", subjects);
        resolve(subjects);
      } catch (parseError) {
        console.error("❌ Error parsing Python output:", parseError.message);
        reject([]);
      }
    });
  });
}

// 2. Get Subjects
app.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ subjects });
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Get Faculty Data
app.get("/faculty", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    console.error("❌ Error fetching faculty data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4. Upload Reports (WIT and WILL)
app.post("/upload-report/:empId", upload.single("file"), async (req, res) => {
  try {
    const { empId } = req.params;
    const { reportType } = req.body;

    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!["wit", "will"].includes(reportType)) {
      console.log("❌ Invalid report type");
      return res.status(400).json({ error: "Invalid report type" });
    }

    const faculty = await Faculty.findOne({ empId });
    if (!faculty) {
      console.log("❌ Faculty not found");
      return res.status(404).json({ error: "Faculty not found" });
    }

    const reportPath = req.file.path;

    if (reportType === "wit") {
      faculty.witReport = reportPath;
    } else if (reportType === "will") {
      faculty.willReport = reportPath;
    }

    await faculty.save();
    console.log(`✅ Report uploaded for ${faculty.name} (${reportType})`);
    res.json({ message: "Report uploaded successfully", faculty });
  } catch (error) {
    console.error("❌ Error uploading report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------- START SERVER ----------------------------

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
