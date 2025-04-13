import express from "express";
import {
    createPharmacistProfile,
    getPharmacistProfileById,
    updatePharmacistProfile,
    deletePharmacistProfile,
} from "../controllers/pharmacistprofile.controllers.js";

const router = express.Router();

// Route to create a new pharmacist profile
router.post("/", createPharmacistProfile);

// Route to get a pharmacist profile by ID
router.get("/:id", getPharmacistProfileById);

// Route to update a pharmacist profile by ID
router.put("/:id", updatePharmacistProfile);

// Route to delete a pharmacist profile by ID
router.delete("/:id", deletePharmacistProfile);

export default router;
