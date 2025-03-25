const axios = require("axios");
const cheerio = require("cheerio");
const Faculty = require("../models/Faculty");

// Scrape Faculty Data
async function scrapeFacultyData() {
  try {
    const url = "https://vnrvjiet.ac.in/cse/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const facultyList = [];

    // Adjust based on actual table structure
    $("table tr").each((index, element) => {
      if (index === 0) return; // Skip the header row

      const columns = $(element).find("td");

      // Extract values using correct column indexes
      const empId = $(columns[1]).text().trim();           // Employee ID
      const name = $(columns[2]).text().trim();            // Faculty Name
      const designation = $(columns[3]).text().trim();     // Designation

      if (empId && name && designation) {
        facultyList.push({ empId, name, designation, reportSubmitted: false });
      }
    });

    console.log("✅ Scraped Faculty Data:", facultyList);

    return facultyList;
  } catch (error) {
    console.error("❌ Error scraping faculty data:", error);
    return [];
  }
}

// Update Faculty Data in MongoDB
async function updateFacultyDatabase() {
  try {
    const facultyData = await scrapeFacultyData();
    if (facultyData.length === 0) {
      console.log("⚠ No faculty data found. Skipping update.");
      return;
    }

    for (const faculty of facultyData) {
      const existingFaculty = await Faculty.findOne({ empId: faculty.empId });

      if (existingFaculty) {
        // Update existing record
        await Faculty.updateOne({ empId: faculty.empId }, { $set: faculty });
        console.log(`🔄 Updated: ${faculty.name}`);
      } else {
        // Insert new faculty record
        await Faculty.create(faculty);
        console.log(`➕ Added: ${faculty.name}`);
      }
    }
    console.log("✅ Faculty data update completed.");
  } catch (error) {
    console.error("❌ Error updating faculty database:", error);
  }
}

module.exports = updateFacultyDatabase;
