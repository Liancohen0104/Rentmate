import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendPasswordResetEmail } from './emailService.js';

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function publicUserDTO(u) {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
    imageURL: u.imageURL,
    location: u.location,
    dateOfBirth: u.dateOfBirth,

    preferredCity: u.preferredCity,
    preferredNeighborhood: u.preferredNeighborhood,
    prefMinRooms: u.prefMinRooms,
    prefMaxRooms: u.prefMaxRooms,
    prefMinPrice: u.prefMinPrice,
    prefMaxPrice: u.prefMaxPrice,
    prefMinSquareMeter: u.prefMinSquareMeter,
    prefMaxSquareMeter: u.prefMaxSquareMeter,
    prefPropertyType: u.prefPropertyType,
    prefMinFloor: u.prefMinFloor,
    prefMaxFloor: u.prefMaxFloor,
    prefTagsWanted: u.prefTagsWanted,
    prefTagsExcluded: u.prefTagsExcluded,
    prefPriority: u.prefPriority,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

// הרשמה
// הרשמה
export async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      location,

      // העדפות חיפוש
      preferredCity,
      preferredNeighborhood,
      prefMinRooms,
      prefMaxRooms,
      prefMinPrice,
      prefMaxPrice,
      prefMinSquareMeter,
      prefMaxSquareMeter,
      prefPropertyType,
      prefMinFloor,
      prefMaxFloor,
      prefTagsWanted,
      prefTagsExcluded,
      prefPriority,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // בדיקת קיום משתמש
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: "Email already in use" });
    }

    let imageURL = undefined;
    if (req.file?.path) imageURL = req.file.path;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      imageURL,
      dateOfBirth: dateOfBirth || null,
      location,

      // שדות העדפות
      preferredCity,
      preferredNeighborhood,
      prefMinRooms,
      prefMaxRooms,
      prefMinPrice,
      prefMaxPrice,
      prefMinSquareMeter,
      prefMaxSquareMeter,
      prefPropertyType,
      prefMinFloor,
      prefMaxFloor,
      prefTagsWanted,
      prefTagsExcluded,
      prefPriority,
    });

    const token = signToken(newUser);
    return res.status(201).json({
      token,
      user: publicUserDTO(newUser),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(400).json({ error: err.message || "Register failed" });
  }
}


// התחברות
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.scope("withSecret").findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Wrong password" });

    await user.save(); 

    const token = signToken(user);
    return res.json({
      token,
      user: publicUserDTO(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
}

// שכחתי סיסמא
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ error: 'No account registered with this email' });

    const token = user.generatePasswordReset();
    await user.save({ validateBeforeSave: false });

    // שלח מייל אמיתי
    await sendPasswordResetEmail(email, token);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// איפוס סיסמא
export async function resetPassword(req, res) {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword)
      return res.status(400).json({ error: 'Missing token or passwords' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// שליפת הפרופיל שלי
export async function getCurrentUser(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user: publicUserDTO(user) });
  } catch (err) {
    console.error("Get current user error:", err);
    return res.status(500).json({ error: "Failed to load current user" });
  }
}

// עדכון הפרופיל שלי
export async function updateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.scope("withSecret").findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      firstName,
      lastName,
      location,
      dateOfBirth,
      currentPassword,
      newPassword,
      confirmPassword,

      // עדכון העדפות חיפוש
      preferredCity,
      preferredNeighborhood,
      prefMinRooms,
      prefMaxRooms,
      prefMinPrice,
      prefMaxPrice,
      prefMinSquareMeter,
      prefMaxSquareMeter,
      prefPropertyType,
      prefMinFloor,
      prefMaxFloor,
      prefTagsWanted,
      prefTagsExcluded,
      prefPriority,
    } = req.body;

    // פרטים בסיסיים
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (location !== undefined) user.location = location;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth || null;

    if (req.file?.path) {
      user.imageURL = req.file.path;
    }

    // שינוי סיסמה
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match" });
      }
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = newPassword;
    }

    const setIfDefined = (key, val) => {
      if (val !== undefined) user[key] = val;
    };
    setIfDefined("preferredCity", preferredCity);
    setIfDefined("preferredNeighborhood", preferredNeighborhood);
    setIfDefined("prefMinRooms", prefMinRooms);
    setIfDefined("prefMaxRooms", prefMaxRooms);
    setIfDefined("prefMinPrice", prefMinPrice);
    setIfDefined("prefMaxPrice", prefMaxPrice);
    setIfDefined("prefMinSquareMeter", prefMinSquareMeter);
    setIfDefined("prefMaxSquareMeter", prefMaxSquareMeter);
    setIfDefined("prefPropertyType", prefPropertyType);
    setIfDefined("prefMinFloor", prefMinFloor);
    setIfDefined("prefMaxFloor", prefMaxFloor);
    setIfDefined("prefTagsWanted", prefTagsWanted);
    setIfDefined("prefTagsExcluded", prefTagsExcluded);
    setIfDefined("prefPriority", prefPriority);

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: publicUserDTO(user),
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

// מחיקת המשתמש שלי
export async function deleteMe(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    await User.destroy({ where: { id: userId } });

    return res.json({ message: "Your account has been deleted successfully" });
  } catch (err) {
    console.error("Delete me error:", err);
    return res.status(500).json({ error: "Failed to delete account" });
  }
}


