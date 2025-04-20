import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify the JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided or invalid format." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Attach the user to the request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

// Middleware to check if the user is a doctor
export const isDoctor = (req, res, next) => {
  if (req.user && req.user.role === "doctor") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Not authorized as a doctor." });
  }
};

// Middleware to check if the user is a patient
export const isPatient = (req, res, next) => {
  if (req.user && req.user.role === "patient") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Not authorized as a patient." });
  }
};

// Middleware to check if the user is a pharmacist
export const isPharmacist = (req, res, next) => {
  if (req.user && req.user.role === "pharmacist") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Not authorized as a pharmacist." });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Not authorized as an admin." });
  }
};
