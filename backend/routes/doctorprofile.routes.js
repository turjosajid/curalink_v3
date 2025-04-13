import express from "express";
import {
  createDoctorProfile,
  updateDoctorProfile,
  getDoctorProfileById,
} from "../controllers/doctorprofile.controller.js";

const router = express.Router();

// Route to create a doctor profile
router.post("/", createDoctorProfile);
router.get("/:id", getDoctorProfileById); // Route to get a doctor profile by ID
// Route to update a doctor profile
router.put("/:id", updateDoctorProfile);

export default router;
