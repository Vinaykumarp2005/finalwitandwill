const cron = require("node-cron");
const updateFacultyDatabase = require("../utils/scraper");

// Schedule the task for July and February (1st of month at midnight)
cron.schedule("0 0 1 7,2 *", async () => {
  console.log("🕰 Running scheduled faculty database update...");
  await updateFacultyDatabase();
});

console.log("✅ Scheduler initialized. Faculty updates are set for July and February.");
