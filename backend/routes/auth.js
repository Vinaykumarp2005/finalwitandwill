const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/Faculty");

const router = express.Router();
const JWT_SECRET = "your-very-secure-secret"; // Later move to .env

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { facultyId: faculty._id, role: faculty.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token, role: faculty.role, name: faculty.name, empId: faculty.empId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;



// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // SECRET for signing JWT tokens
// const JWT_SECRET = "your-very-secure-secret"; // later move to .env file

// // Signup Route
// router.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({ name, email, password: hashedPassword, role });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error during signup" });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     // Generate JWT Token
//     const token = jwt.sign(
//       { userId: user._id, role: user.role }, 
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ token, role: user.role });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error during login" });
//   }
// });

// module.exports = router;
