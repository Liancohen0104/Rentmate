import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import requirementsRoutes from "./routes/requirementsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sequelize from "./services/db.js";
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

// ראוטים של הסקרייפ
app.use("/scrape", scrapeRoutes);
app.use("/requirements", requirementsRoutes);
app.use("/users", userRoutes);

// ברירת מחדל – דף בית קטן
app.get("/", (req, res) => {
  res.send("Welcome to Yad2 Scraper API 🚀");
});

// האזנה לפורט
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
