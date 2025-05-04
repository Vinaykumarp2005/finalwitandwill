const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const stringSimilarity = require("string-similarity");
const updateFacultyDatabase = require("./utils/scraper");
require("./utils/scheduler");
const Faculty = require("./models/Faculty");
const Subject = require("./models/Subject");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.post("/api/faculty/submit-link/:empId", async (req, res) => {
  const { empId } = req.params;
  const { type, link } = req.body;

  if (!type || !link) {
    return res.status(400).json({ error: "Missing type or link" });
  }

  try {
    const faculty = await Faculty.findOne({ empId });

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    if (type === "wit") {
      faculty.witReport = link;
    } else if (type === "will") {
      faculty.willReport = link;
    } else {
      return res.status(400).json({ error: "Invalid report type" });
    }

    await faculty.save();
    res.json({ message: `${type.toUpperCase()} report link updated.` });
  } catch (error) {
    console.error("❌ Error updating faculty report link:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// app.post("/api/faculty/submit-link/:empId", async (req, res) => {
//   const { empId } = req.params;
//   const { type, link } = req.body;

//   try {
//     const faculty = await Faculty.findOne({ empId });

//     if (!faculty) return res.status(404).json({ error: "Faculty not found" });

//     if (type === "wit") faculty.witReport = link;
//     else if (type === "will") faculty.willReport = link;
//     else return res.status(400).json({ error: "Invalid report type" });

//     await faculty.save();
//     res.json({ message: `${type.toUpperCase()} link saved` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });



app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/timetableDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Scrape and update faculty data on server start
updateFacultyDatabase();

// -------------------------- ROUTES ----------------------------

// 1️⃣ Upload Timetable & Extract Subjects with Faculty Mapping
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const subjects = await extractSubjects(req.file.path);
    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ error: "No subjects found in the document." });
    }

    const facultyList = await Faculty.find();
    const facultyNames = facultyList.map(f => f.name.toLowerCase());

    for (const subject of subjects) {
      let mappedFaculty = [];

      for (const lecturer of subject.lecturers) {
        console.log(`🔍 Checking lecturer: ${lecturer.trim()}`);

        const matches = stringSimilarity.findBestMatch(lecturer.trim().toLowerCase(), facultyNames);
        const bestMatch = matches.bestMatch;

        if (bestMatch.rating > 0.7) {
          const facultyMatch = facultyList.find(f => f.name.toLowerCase() === bestMatch.target);
          console.log(`✅ Matched Faculty: ${facultyMatch.name} (Similarity: ${bestMatch.rating})`);

          mappedFaculty.push({
            name: facultyMatch.name,
            empId: facultyMatch.empId,
            designation: facultyMatch.designation,
          });

          // 🔥 Append subject *name* to `mappedSubjects`
          if (!facultyMatch.mappedSubjects.includes(subject.subjectName)) {
            facultyMatch.mappedSubjects.push(subject.subjectName);
            await facultyMatch.save();
            console.log(`📌 Added Subject: ${subject.subjectName} to ${facultyMatch.name}`);
          }
        } else {
          console.log(`❌ No close match found for lecturer: ${lecturer} (Best: ${bestMatch.target} - ${bestMatch.rating})`);
        }
      }

      subject.mappedFaculty = mappedFaculty;

      // 🔄 Save subject in MongoDB
      const existingSubject = await Subject.findOne({ subjectCode: subject.subjectCode });

      if (existingSubject) {
        await Subject.updateOne(
          { subjectCode: subject.subjectCode },
          {
            $set: {
              subjectName: subject.subjectName,
              lecturers: [...new Set([...existingSubject.lecturers, ...subject.lecturers])],
              mappedFaculty: subject.mappedFaculty,
            },
          }
        );
      } else {
        await Subject.create(subject);
      }
    }

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

// 2️⃣ Get Faculty with Mapped Subjects
app.get("/faculty", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    console.error("❌ Error fetching faculty data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3️⃣ Get Faculty Submission Status
app.get("/faculty-status", async (req, res) => {
  try {
    const faculties = await Faculty.find();

    const submitted = faculties.filter(f => f.witReport || f.willReport).length;
    const notSubmitted = faculties.length - submitted;

    res.json({ submitted, notSubmitted });
  } catch (error) {
    console.error("❌ Error fetching faculty status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4️⃣ Upload Reports (WIT and WILL)
app.post("/upload-report/:empId", upload.single("file"), async (req, res) => {
  try {
    const { empId } = req.params;
    const { reportType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!["wit", "will"].includes(reportType)) {
      return res.status(400).json({ error: "Invalid report type" });
    }

    const faculty = await Faculty.findOne({ empId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const reportPath = req.file.path;

    if (reportType === "wit") {
      faculty.witReport = reportPath;
    } else if (reportType === "will") {
      faculty.willReport = reportPath;
    }

    await faculty.save();
    res.json({ message: "Report uploaded successfully", faculty });
  } catch (error) {
    console.error("❌ Error uploading report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5️⃣ Admin Check Middleware (Ensure Only Admin Access for Certain Routes)
const adminCheck = (req, res, next) => {
  const email = req.body.email || req.headers["x-user-email"];
  Faculty.findOne({ email }, (err, user) => {
    if (err || !user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin role required" });
    }
    next();
  });
};

// -------------------------- START SERVER ----------------------------

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created 'uploads/' directory");
}

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



// const express = require("express");
// const multer = require("multer");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const fs = require("fs");
// const { exec } = require("child_process");
// const stringSimilarity = require("string-similarity");
// const updateFacultyDatabase = require("./utils/scraper");
// require("./utils/scheduler");
// const Faculty = require("./models/Faculty");
// const Subject = require("./models/Subject");
// const authRoutes = require("./routes/auth");


// const app = express();
// const PORT = 4000;

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// // mongoose.connect("mongodb+srv://vinay:vinay@cluster0.wd0bvv6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // })
// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/timetableDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// // Multer Setup for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // Scrape and update faculty data on server start
// updateFacultyDatabase();

// // -------------------------- ROUTES ----------------------------

// // 1️⃣ Upload Timetable & Extract Subjects with Faculty Mapping
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const subjects = await extractSubjects(req.file.path);
//     if (!subjects || subjects.length === 0) {
//       return res.status(400).json({ error: "No subjects found in the document." });
//     }

//     const facultyList = await Faculty.find();
//     const facultyNames = facultyList.map(f => f.name.toLowerCase());

//     for (const subject of subjects) {
//       let mappedFaculty = [];

//       for (const lecturer of subject.lecturers) {
//         console.log(`🔍 Checking lecturer: ${lecturer.trim()}`);

//         const matches = stringSimilarity.findBestMatch(lecturer.trim().toLowerCase(), facultyNames);
//         const bestMatch = matches.bestMatch;

//         if (bestMatch.rating > 0.7) {
//           const facultyMatch = facultyList.find(f => f.name.toLowerCase() === bestMatch.target);
//           console.log(`✅ Matched Faculty: ${facultyMatch.name} (Similarity: ${bestMatch.rating})`);

//           mappedFaculty.push({
//             name: facultyMatch.name,
//             empId: facultyMatch.empId,
//             designation: facultyMatch.designation,
//           });

//           // 🔥 Append subject *name* to `mappedSubjects`
//           if (!facultyMatch.mappedSubjects.includes(subject.subjectName)) {
//             facultyMatch.mappedSubjects.push(subject.subjectName);
//             await facultyMatch.save();
//             console.log(`📌 Added Subject: ${subject.subjectName} to ${facultyMatch.name}`);
//           }
//         } else {
//           console.log(`❌ No close match found for lecturer: ${lecturer} (Best: ${bestMatch.target} - ${bestMatch.rating})`);
//         }
//       }

//       subject.mappedFaculty = mappedFaculty;

//       // 🔄 Save subject in MongoDB
//       const existingSubject = await Subject.findOne({ subjectCode: subject.subjectCode });

//       if (existingSubject) {
//         await Subject.updateOne(
//           { subjectCode: subject.subjectCode },
//           {
//             $set: {
//               subjectName: subject.subjectName,
//               lecturers: [...new Set([...existingSubject.lecturers, ...subject.lecturers])],
//               mappedFaculty: subject.mappedFaculty,
//             },
//           }
//         );
//       } else {
//         await Subject.create(subject);
//       }
//     }

//     res.json({ subjects });
//   } catch (error) {
//     console.error("❌ Error processing file:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Function to Extract Subjects using Python
// async function extractSubjects(filePath) {
//   return new Promise((resolve, reject) => {
//     exec(`python extract_subjects.py "${filePath}"`, (error, stdout, stderr) => {
//       if (error) {
//         console.error("❌ Error running Python script:", error.message);
//         return reject([]);
//       }
//       if (stderr) {
//         console.error("⚠ Python script stderr:", stderr);
//       }
//       try {
//         const subjects = JSON.parse(stdout.trim());
//         console.log("📄 Extracted Subjects:", subjects);
//         resolve(subjects);
//       } catch (parseError) {
//         console.error("❌ Error parsing Python output:", parseError.message);
//         reject([]);
//       }
//     });
//   });
// }

// // 2️⃣ Get Faculty with Mapped Subjects
// app.get("/faculty", async (req, res) => {
//   try {
//     const faculties = await Faculty.find();
//     res.json(faculties);
//   } catch (error) {
//     console.error("❌ Error fetching faculty data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // 3️⃣ Get Faculty Submission Status
// app.get("/faculty-status", async (req, res) => {
//   try {
//     const faculties = await Faculty.find();

//     const submitted = faculties.filter(f => f.witReport || f.willReport).length;
//     const notSubmitted = faculties.length - submitted;

//     res.json({ submitted, notSubmitted });
//   } catch (error) {
//     console.error("❌ Error fetching faculty status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // 4️⃣ Upload Reports (WIT and WILL)
// app.post("/upload-report/:empId", upload.single("file"), async (req, res) => {
//   try {
//     const { empId } = req.params;
//     const { reportType } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     if (!["wit", "will"].includes(reportType)) {
//       return res.status(400).json({ error: "Invalid report type" });
//     }

//     const faculty = await Faculty.findOne({ empId });
//     if (!faculty) {
//       return res.status(404).json({ error: "Faculty not found" });
//     }

//     const reportPath = req.file.path;

//     if (reportType === "wit") {
//       faculty.witReport = reportPath;
//     } else if (reportType === "will") {
//       faculty.willReport = reportPath;
//     }

//     await faculty.save();
//     res.json({ message: "Report uploaded successfully", faculty });
//   } catch (error) {
//     console.error("❌ Error uploading report:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // -------------------------- START SERVER ----------------------------
// const uploadDir = "uploads/";

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log("📂 Created 'uploads/' directory");
// }

// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
