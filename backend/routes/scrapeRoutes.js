import express from "express";
import { scrapeApartments } from "../services/yad2Service.js";

const router = express.Router();

// מחזיר 50 מודעות ראשונות של דירות להשכרה
router.get("/data", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const apartments = await scrapeApartments(limit);
    res.json(apartments);
  } catch (error) {
    console.error("Error while scraping data:", error.message);
    res.status(500).json({ error: "Scraping failed" });
  }
});

export default router;
