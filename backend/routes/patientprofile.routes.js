import express from "express";
import {

// filepath: e:\GG\curalink\backend\routes\patientprofile.routes.js
    createPatientProfile,
    getPatientProfileById,
    updatePatientProfile,
    deletePatientProfile,
    getAllPatientProfiles
} from "../controllers/patientprofile.controllers.js";

const router = express.Router();

// Route to create a new patient profile
router.post("/", createPatientProfile);

// Route to get all patient profiles
router.get("/", getAllPatientProfiles);

// Route to get a patient profile by ID
router.get("/:id", getPatientProfileById);

// Route to update a patient profile by ID
router.put("/:id", updatePatientProfile);

// Route to delete a patient profile by ID
router.delete("/:id", deletePatientProfile);

export default router;