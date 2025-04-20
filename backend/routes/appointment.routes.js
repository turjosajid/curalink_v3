import express from "express";
import {
  getAppointments,
  getAppointmentDashboard,
  updateAppointmentDiagnosis,
  addPrescription,
  updateMedicalRecord,
  addDiagnosticReport,
  completeAppointment,
} from "../controllers/appointment.controller.js";
import { verifyToken, isDoctor } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all appointments for a doctor
router.get("/doctor/:doctorId", verifyToken, isDoctor, getAppointments);

// Get detailed dashboard for a specific appointment
router.get(
  "/:appointmentId/dashboard",
  verifyToken,
  isDoctor,
  getAppointmentDashboard
);

// Update appointment with diagnosis and notes
router.put(
  "/:appointmentId/diagnosis",
  verifyToken,
  isDoctor,
  updateAppointmentDiagnosis
);

// Add prescription to appointment
router.post(
  "/:appointmentId/prescription",
  verifyToken,
  isDoctor,
  addPrescription
);

// Update medical record for an appointment
router.put(
  "/:appointmentId/medical-record",
  verifyToken,
  isDoctor,
  updateMedicalRecord
);

// Add diagnostic report to an appointment
router.post(
  "/:appointmentId/diagnostic-report",
  verifyToken,
  isDoctor,
  addDiagnosticReport
);

// Mark appointment as completed
router.put(
  "/:appointmentId/complete",
  verifyToken,
  isDoctor,
  completeAppointment
);

export default router;
