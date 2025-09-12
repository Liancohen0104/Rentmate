import express from "express";
import { Op } from "sequelize";
import Apartment from "../models/Apartment.js";
import User from "../models/User.js";
import { pickBestApartments } from "../services/aiService.js";
import { verifyToken } from "../services/authService.js";

const router = express.Router();

const DEFAULT_MAX_RESULTS = 10;

// AI ע"י DB שליפת דרישות משתמש ובחירת מודעות מתאימות מה
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const profile = await User.findByPk(userId, { raw: true });
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    // דרישות משתמש
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
    } = profile;

    const where = {};
    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;

    if (minPrice != null || maxPrice != null) {
      where.price = {};
      if (minPrice != null) where.price[Op.gte] = Number(minPrice);
      if (maxPrice != null) where.price[Op.lte] = Number(maxPrice);
    }

    if (minRooms != null || maxRooms != null) {
      where.rooms = {};
      if (minRooms != null) where.rooms[Op.gte] = Number(minRooms);
      if (maxRooms != null) where.rooms[Op.lte] = Number(maxRooms);
    }

    if (minSquareMeter != null || maxSquareMeter != null) {
      where.size = {};
      if (minSquareMeter != null) where.size[Op.gte] = Number(minSquareMeter);
      if (maxSquareMeter != null) where.size[Op.lte] = Number(maxSquareMeter);
    }

    if (minFloor != null || maxFloor != null) {
      where.floor = {};
      if (minFloor != null) where.floor[Op.gte] = Number(minFloor);
      if (maxFloor != null) where.floor[Op.lte] = Number(maxFloor);
    }
    
    const apartments = await Apartment.findAll({
      where,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const { ranked, meta } = await pickBestApartments(
      { city, neighborhood, minRooms, maxRooms, minPrice, maxPrice, minSquareMeter, maxSquareMeter, propertyType, minFloor, maxFloor, tagsWanted, tagsExcluded, priority },
      apartments,
      { maxResults: DEFAULT_MAX_RESULTS }
    );

    // מחזירים תשובה
    res.json({
      results: ranked,   
      meta,            
    });
  } catch (error) {
    console.error("Error in requirements route:", error.message);
    res.status(500).json({ error: "Failed to process user requirements" });
  }
});

export default router;
