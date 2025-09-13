import express from "express";
import Apartment from "../models/Apartment.js";
import User from "../models/User.js";
import { pickBestApartments } from "../services/aiService.js";
import { verifyToken } from "../services/authService.js";

const router = express.Router();
const DEFAULT_MAX_RESULTS = 10;
const RADIUS_KM = 10;

// פונקציה עזר לחישוב מרחק
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// AI ע"י DB שליפת דרישות משתמש ובחירת מודעות מתאימות מה
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const profile = await User.findByPk(userId, { raw: true });
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      preferredCity: city,
      preferredNeighborhood: neighborhood,
      prefMinRooms: minRooms,
      prefMaxRooms: maxRooms,
      prefMinPrice: minPrice,
      prefMaxPrice: maxPrice,
      prefMinSquareMeter: minSquareMeter,
      prefMaxSquareMeter: maxSquareMeter,
      prefPropertyType: propertyType,
      prefMinFloor: minFloor,
      prefMaxFloor: maxFloor,
      prefTagsWanted: tagsWanted = [],
      prefTagsExcluded: tagsExcluded = [],
      prefPriority: priority = "price",
      preferred_lat,
      preferred_lng,
    } = profile;

    const apartments = await Apartment.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // סינון לפי מרחק
    let filtered = apartments;
    if (preferred_lat && preferred_lng) {
      filtered = apartments.filter(ap => {
        if (!ap.lat || !ap.lon) return false; // אם לדירה אין קואורדינטות – נזרוק
        const dist = haversineDistance(preferred_lat, preferred_lng, ap.lat, ap.lon);
        return dist <= RADIUS_KM;
      });
    }

    if (filtered.length === 0) {
      return res.json({
        results: [],
        meta: { ai: "skipped", reason: "no apartments within 20km" },
      });
    }

    const { ranked, meta } = await pickBestApartments(
      {
        city,
        neighborhood,
        minRooms,
        maxRooms,
        minPrice,
        maxPrice,
        minSquareMeter,
        maxSquareMeter,
        propertyType,
        minFloor,
        maxFloor,
        tagsWanted,
        tagsExcluded,
        priority,
        preferred_lat,
        preferred_lng,
      },
      filtered,
      { maxResults: DEFAULT_MAX_RESULTS }
    );

    res.json({ results: ranked, meta });
  } catch (error) {
    console.error("Error in recommendation route:", error.message);
    res.status(500).json({ error: "Failed to process recommendations" });
  }
});

export default router;
