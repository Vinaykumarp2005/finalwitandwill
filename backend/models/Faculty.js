const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: String,
  empId: String,
  designation: String,
  reportSubmitted: { type: Boolean, default: false },
  witReport: String, // Path to WIT report file
  willReport: String // Path to WILL report file
});

// Prevent overwriting if already declared
const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
