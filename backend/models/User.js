import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: true, validate: { len: [1, 100] } },
    lastName: { type: DataTypes.STRING, allowNull: true, validate: { len: [1, 100] } },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { len: [6, 255] },
    },

    role: { type: DataTypes.ENUM("member", "admin"), allowNull: false, defaultValue: "member" },

    imageURL: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://res.cloudinary.com/druxrfbst/image/upload/v1750453874/default_profile_eqtr4y.jpg",
    },

    location: { type: DataTypes.STRING, allowNull: true },

    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isOldEnough(value) {
          if (!value) return;
          const age = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          if (age < 13) throw new Error("Minimal age to register is 13");
        },
      },
    },

    // שדות לאיפוס סיסמה
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },

    // העדפות חיפוש דירה
    preferredCity: { type: DataTypes.STRING, allowNull: true },
    preferredNeighborhood: { type: DataTypes.STRING, allowNull: true },
    preferred_lat: { type: DataTypes.FLOAT, allowNull: true },
    preferred_lng: { type: DataTypes.FLOAT, allowNull: true },

    prefMinRooms: { type: DataTypes.FLOAT, allowNull: true },
    prefMaxRooms: { type: DataTypes.FLOAT, allowNull: true },

    prefMinPrice: { type: DataTypes.INTEGER, allowNull: true },
    prefMaxPrice: { type: DataTypes.INTEGER, allowNull: true },

    prefMinSquareMeter: { type: DataTypes.INTEGER, allowNull: true },
    prefMaxSquareMeter: { type: DataTypes.INTEGER, allowNull: true },

    prefPropertyType: { type: DataTypes.STRING, allowNull: true },

    prefMinFloor: { type: DataTypes.INTEGER, allowNull: true },
    prefMaxFloor: { type: DataTypes.INTEGER, allowNull: true },

    prefTagsWanted: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    prefTagsExcluded: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },

    prefPriority: {
      type: DataTypes.ENUM("price", "rooms", "location"),
      allowNull: true,
      defaultValue: "price",
    },
  },
  {
    tableName: "Users",
    timestamps: true,
    indexes: [{ unique: true, fields: ["email"] }],
    defaultScope: {
      attributes: { exclude: ["password", "resetPasswordToken", "resetPasswordExpires"] },
    },
    scopes: {
      withSecret: {}, 
    },
  }
);

// הצפנת סיסמה 
User.addHook("beforeCreate", async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.addHook("beforeUpdate", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = function (plainPwd) {
  return bcrypt.compare(plainPwd, this.getDataValue("password"));
};

User.prototype.generatePasswordReset = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.setDataValue("resetPasswordToken", token);
  this.setDataValue("resetPasswordExpires", new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 שעות
  return token;
};

User.prototype.fullName = function () {
  const f = this.getDataValue("firstName") || "";
  const l = this.getDataValue("lastName") || "";
  return `${f} ${l}`.trim();
};

export default User;
