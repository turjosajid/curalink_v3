import express from "express";
import {
  getAllPrescriptions,
  searchPrescriptionsByPatient,
  getPrescriptionDetails,
} from "../controllers/prescription.controller.js";
import { verifyToken, isPharmacist } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all prescriptions for pharmacist view
router.get("/", verifyToken, isPharmacist, getAllPrescriptions);

// Search prescriptions by patient name
router.get("/search", verifyToken, isPharmacist, searchPrescriptionsByPatient);

// Get prescription details
router.get("/:id", verifyToken, isPharmacist, getPrescriptionDetails);

export default router;
