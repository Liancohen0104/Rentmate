// DB תזמון עדכון מודעות ב
import cron from "node-cron";
import { scrapeApartments } from "./yad2Service.js";
import Apartment from "../models/Apartment.js";

// DB פונקציה ששולפת מודעות ושומרת ל
async function scrapeAndSave(limit = 50) {
  const apartments = await scrapeApartments(limit);

  for (const apt of apartments) {
    await Apartment.upsert(apt);
  }

  console.log(`[CRON] Saved ${apartments.length} apartments to DB`);
}

// ירוץ כל יום ב־03:00 בלילה
cron.schedule("0 3 * * *", async () => {
  console.log("[CRON] Starting daily scrape...");
  try {
    await scrapeAndSave(200);
  } catch (err) {
    console.error("[CRON] Error scraping:", err.message);
  }
});

