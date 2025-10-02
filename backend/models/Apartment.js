// מודל מודעת דירה
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Apartment = sequelize.define("Apartment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  token: DataTypes.STRING,
  originalUrl: DataTypes.STRING,
  city: DataTypes.STRING,
  area: DataTypes.STRING,
  neighborhood: DataTypes.STRING,
  street: DataTypes.STRING,
  houseNumber: DataTypes.INTEGER,
  floor: DataTypes.INTEGER,
  lat: DataTypes.FLOAT,
  lon: DataTypes.FLOAT,
  price: DataTypes.INTEGER,
  priceBefore: DataTypes.INTEGER,
  propertyType: DataTypes.STRING,
  rooms: DataTypes.FLOAT,
  size: DataTypes.INTEGER,
  conditionId: DataTypes.INTEGER,
  conditionText: DataTypes.STRING,
  coverImage: DataTypes.STRING,
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
});

export default Apartment;
