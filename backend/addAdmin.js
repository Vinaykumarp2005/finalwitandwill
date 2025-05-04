const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');  // Assuming the Faculty schema is in '../models/Faculty'

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Admin details
const adminEmail = "admin@vnrvjiet.in";  // Use your desired admin email
const adminPassword = "randomPassword";  // Assign a temporary password
const adminName = "Admin Name";  // Admin name
const adminDesignation = "Admin Designation";  // Admin designation (you can use a placeholder)

async function createAdmin() {
  try {
    const existingAdmin = await Faculty.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("⚠ Admin already exists.");
      return;
    }

    // Create new admin user
    const newAdmin = new Faculty({
      name: adminName,
      empId: "ADMIN123",  // You can use a placeholder empId
      designation: adminDesignation,
      email: adminEmail,
      role: "admin",  // Assign role as admin
      witReport: "",
      willReport: "",
      mappedSubjects: [],
    });

    await newAdmin.save();
    console.log("✅ Admin account created successfully!");

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();  // Close the database connection
  }
}

// Call the createAdmin function to add the admin to the database
createAdmin();
