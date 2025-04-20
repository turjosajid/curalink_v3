import express from "express";
import { 
  getPrescriptionById,
  getPatientPrescriptions
} from "../controllers/prescription.controller.js";
import { verifyToken, isPatient, isDoctor } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/:id", verifyToken, getPrescriptionById);


router.get("/patient/:patientId", verifyToken, isPatient, getPatientPrescriptions);

export default router;
