// const mongoose = require("mongoose");

// const facultySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   empId: { type: String, required: true, unique: true },
//   designation: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, enum: ["faculty", "admin"], default: "faculty" },
//   witReport: { type: String, default: "" }, 
//   willReport: { type: String, default: "" },
//   mappedSubjects: { type: [{ type: String, required: true }], default: [] }, // Stores subject names instead of codes
// });

// // Prevent overwriting if already declared
// const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);

// module.exports = Faculty;

const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Add this
  role: { type: String, enum: ["faculty", "admin"], default: "faculty" },
  witReport: { type: String, default: "" },
  willReport: { type: String, default: "" },
  mappedSubjects: { type: [{ type: String }], default: [] },
});

const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
