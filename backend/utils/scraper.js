const axios = require("axios");
const cheerio = require("cheerio");
const bcrypt = require("bcryptjs");
const Faculty = require("../models/Faculty");

async function scrapeFacultyData() {
  try {
    const url = "https://vnrvjiet.ac.in/cse/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const facultyList = [];
    const commonPassword = await bcrypt.hash("vnrvjiet123", 10); // Hash the common password once

    $("table tr").each((index, element) => {
      if (index === 0) return; // Skip header

      const columns = $(element).find("td");
      const empId = $(columns[1]).text().trim();
      const name = $(columns[2]).text().trim();
      const designation = $(columns[3]).text().trim();
      const email = $(columns[8]).text().trim();

      if (empId && name && designation && email) {
        facultyList.push({ empId, name, designation, email, password: commonPassword, role: "faculty" });
      }
    });

    console.log("✅ Scraped Faculty Data:", facultyList);
    return facultyList;
  } catch (error) {
    console.error("❌ Error scraping faculty data:", error);
    return [];
  }
}

async function updateFacultyDatabase() {
  try {
    const facultyData = await scrapeFacultyData();
    if (facultyData.length === 0) {
      console.log("⚠ No faculty data found. Skipping update.");
      return;
    }

    for (const faculty of facultyData) {
      const existingFaculty = await Faculty.findOne({ email: faculty.email });
    
      if (existingFaculty) {
        // Preserve existing password
        if (!existingFaculty.password) {
          faculty.password = await bcrypt.hash("vnrvjiet123", 10);
        } else {
          faculty.password = existingFaculty.password;
        }
    
        await Faculty.updateOne({ email: faculty.email }, { $set: faculty });
        console.log(`🔄 Updated: ${faculty.name}`);
      } else {
        // Create new with hashed password
        faculty.password = await bcrypt.hash("vnrvjiet123", 10);
        await Faculty.create(faculty);
        console.log(`➕ Added: ${faculty.name}`);
      }
    }
    
    console.log("✅ Faculty database update completed.");
  } catch (error) {
    console.error("❌ Error updating faculty database:", error);
  }
}

module.exports = updateFacultyDatabase;




// const axios = require("axios");
// const cheerio = require("cheerio");
// const Faculty = require("../models/Faculty");

// // Scrape Faculty Data
// async function scrapeFacultyData() {
//   try {
//     const url = "https://vnrvjiet.ac.in/cse/";
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     const facultyList = [];

//     // Adjust based on actual table structure
//     $("table tr").each((index, element) => {
//       if (index === 0) return; // Skip the header row

//       const columns = $(element).find("td");

//       // Extract values using correct column indexes
//       const empId = $(columns[1]).text().trim();           // Employee ID
//       const name = $(columns[2]).text().trim();            // Faculty Name
//       const designation = $(columns[3]).text().trim();     // Designation
//       const email = $(columns[8]).text().trim();           // Email

//       if (empId && name && designation && email) {
//         facultyList.push({ empId, name, designation, email, reportSubmitted: false });
//       }
//     });

//     console.log("✅ Scraped Faculty Data:", facultyList);

//     return facultyList;
//   } catch (error) {
//     console.error("❌ Error scraping faculty data:", error);
//     return [];
//   }
// }

// // Update Faculty Data in MongoDB
// async function updateFacultyDatabase() {
//   try {
//     const facultyData = await scrapeFacultyData();
//     if (facultyData.length === 0) {
//       console.log("⚠ No faculty data found. Skipping update.");
//       return;
//     }

//     for (const faculty of facultyData) {
//       const existingFaculty = await Faculty.findOne({ email: faculty.email });

//       if (existingFaculty) {
//         // Update existing record
//         await Faculty.updateOne({ email: faculty.email }, { $set: faculty });
//         console.log(`🔄 Updated: ${faculty.name}`);
//       } else {
//         // Insert new faculty record
//         await Faculty.create(faculty);
//         console.log(`➕ Added: ${faculty.name}`);
//       }
//     }
//     console.log("✅ Faculty data update completed.");
//   } catch (error) {
//     console.error("❌ Error updating faculty database:", error);
//   }
// }

// module.exports = updateFacultyDatabase;


// // const axios = require("axios");
// // const cheerio = require("cheerio");
// // const Faculty = require("../models/Faculty");

// // // Scrape Faculty Data
// // async function scrapeFacultyData() {
// //   try {
// //     const url = "https://vnrvjiet.ac.in/cse/";
// //     const response = await axios.get(url);
// //     const $ = cheerio.load(response.data);

// //     const facultyList = [];

// //     // Adjust based on actual table structure
// //     $("table tr").each((index, element) => {
// //       if (index === 0) return; // Skip the header row

// //       const columns = $(element).find("td");

// //       // Extract values using correct column indexes
// //       const empId = $(columns[1]).text().trim();           // Employee ID
// //       const name = $(columns[2]).text().trim();            // Faculty Name
// //       const designation = $(columns[3]).text().trim();     // Designation

// //       if (empId && name && designation) {
// //         facultyList.push({ empId, name, designation, reportSubmitted: false });
// //       }
// //     });

// //     console.log("✅ Scraped Faculty Data:", facultyList);

// //     return facultyList;
// //   } catch (error) {
// //     console.error("❌ Error scraping faculty data:", error);
// //     return [];
// //   }
// // }

// // // Update Faculty Data in MongoDB
// // async function updateFacultyDatabase() {
// //   try {
// //     const facultyData = await scrapeFacultyData();
// //     if (facultyData.length === 0) {
// //       console.log("⚠ No faculty data found. Skipping update.");
// //       return;
// //     }

// //     for (const faculty of facultyData) {
// //       const existingFaculty = await Faculty.findOne({ empId: faculty.empId });

// //       if (existingFaculty) {
// //         // Update existing record
// //         await Faculty.updateOne({ empId: faculty.empId }, { $set: faculty });
// //         console.log(`🔄 Updated: ${faculty.name}`);
// //       } else {
// //         // Insert new faculty record
// //         await Faculty.create(faculty);
// //         console.log(`➕ Added: ${faculty.name}`);
// //       }
// //     }
// //     console.log("✅ Faculty data update completed.");
// //   } catch (error) {
// //     console.error("❌ Error updating faculty database:", error);
// //   }
// // }

// // module.exports = updateFacultyDatabase;
