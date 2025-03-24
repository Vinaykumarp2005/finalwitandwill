const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectName: String,
  lecturers: [String],
});

module.exports = mongoose.model("Subject", subjectSchema);
