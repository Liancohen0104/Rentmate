// backend/routes/apartmentRoutes.js
import express from "express";
import { Op } from "sequelize";
import Apartment from "../models/Apartment.js";

const router = express.Router();

// קבל את כל הדירות
router.get("/all", async (req, res) => {
  try {
    const apartments = await Apartment.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    });
    res.json(apartments);
  } catch (err) {
    console.error("Error fetching apartments:", err.message);
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
});

 // חיפוש דירות לפי פרמטרים
router.get("/search", async (req, res) => {
  try {
    const {
      city,
      neighborhood,
      minPrice,
      maxPrice,
      minRooms,
      maxRooms,
      minSize,
      maxSize,
      propertyType,
      minFloor,
      maxFloor,
    } = req.query;

    const where = {};

    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (neighborhood) where.neighborhood = { [Op.iLike]: `%${neighborhood}%` };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    if (minRooms || maxRooms) {
      where.rooms = {};
      if (minRooms) where.rooms[Op.gte] = Number(minRooms);
      if (maxRooms) where.rooms[Op.lte] = Number(maxRooms);
    }

    if (minSize || maxSize) {
      where.size = {};
      if (minSize) where.size[Op.gte] = Number(minSize);
      if (maxSize) where.size[Op.lte] = Number(maxSize);
    }

    if (propertyType) {
      where.propertyType = { [Op.iLike]: `%${propertyType}%` };
    }

    if (minFloor || maxFloor) {
      where.floor = {};
      if (minFloor) where.floor[Op.gte] = Number(minFloor);
      if (maxFloor) where.floor[Op.lte] = Number(maxFloor);
    }

    const apartments = await Apartment.findAll({
      where,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    res.json(apartments);
  } catch (err) {
    console.error("Error searching apartments:", err.message);
    res.status(500).json({ error: "Failed to search apartments" });
  }
});

export default router;
