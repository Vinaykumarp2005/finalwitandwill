const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/@vnrvjiet\.in$/, 'Only college emails are allowed.']
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "faculty"], 
    default: "faculty" 
  }
});

module.exports = mongoose.model("User", userSchema);
