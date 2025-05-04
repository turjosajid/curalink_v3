import express from "express";
import {
  createDoctorProfile,
  updateDoctorProfile,
  getDoctorProfileById,
  getAllDoctorProfiles
} from "../controllers/doctorprofile.controller.js";

const router = express.Router();

// Route to get all doctor profiles
router.get("/", getAllDoctorProfiles);

// Route to create a doctor profile
router.post("/", createDoctorProfile);

// Route to get a doctor profile by ID
router.get("/:id", getDoctorProfileById);

// Route to update a doctor profile
router.put("/:id", updateDoctorProfile);

export default router;
