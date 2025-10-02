import express from "express";
import { scrapeHtml, scrapeRawApartments } from "../services/yad2Service.js";

const router = express.Router();

// מחזיר JSON של המודעות כפי שהן מגיעות מיד2
router.get("/scrape-raw", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const apartments = await scrapeRawApartments(limit);
    res.json(apartments);
  } catch (error) {
    console.error("Error while scraping raw data:", error.message);
    res.status(500).json({ error: "Scraping raw failed" });
  }
});

export default router;
