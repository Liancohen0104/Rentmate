import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apartmentMatchRoutes from "./routes/apartmentMatchRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import sequelize from "./db/db.js";
import "./services/apartmentUpdater.js";

dotenv.config();

const app = express();
app.use(express.json()); // JSON מאפשר קריאות עם גוף
app.use(cors()); // מאפשר גישה מכל מקור
const PORT = process.env.PORT;

// DB בדיקת חיבור + סנכרון טבלאות
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // יוודא שכל המודלים מוגדרים ויוצר טבלאות אם חסר
    await sequelize.sync({ alter: true });
    console.log("✅ All models synced with DB");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
})();

// ראוטים
app.use("/apartment-match", apartmentMatchRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/users", userRoutes);

// ברירת מחדל – דף בית קטן
app.get("/", (req, res) => {
  res.send("Welcome to Yad2 Scraper API 🚀");
});

// האזנה לפורט
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
