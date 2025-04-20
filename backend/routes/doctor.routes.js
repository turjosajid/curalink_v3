import express from "express";
import {
  getAppointmentsByDoctor,
  createAppointment,
  deleteAppointment,
  editAppointment,
  getAvailableSlots,
  updateAvailableSlots,
  getAppointmentById,
  getPastConsultationsByDoctor,
} from "../controllers/doctor.controllers.js";

const router = express.Router();

// Get all appointments by doctor's user ID
router.get("/:doctorId/appointments", getAppointmentsByDoctor);

// Get past consultations (completed appointments) by doctor's user ID
router.get("/:doctorId/past-consultations", getPastConsultationsByDoctor);

// Create a new appointment
router.post("/appointments", createAppointment);

// Delete an appointment
router.delete("/appointments/:appointmentId", deleteAppointment);

// Edit an appointment
router.put("/appointments/:appointmentId", editAppointment);

// Get a single appointment by ID
router.get("/appointments/:appointmentId", getAppointmentById);

// Get available slots for a doctor
router.get("/:doctorId/available-slots", getAvailableSlots);

// Update available slots for a doctor
router.put("/:doctorId/available-slots", updateAvailableSlots);

export default router;
