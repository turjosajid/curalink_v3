import Appointment from "../models/appointment.model.js";
import MedicalRecord from "../models/medicalrecord.model.js";
import Prescription from "../models/prescription.model.js";
import path from "path";
import fs from "fs";

// Get all appointments for a doctor
const getAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctor: doctorId }).populate(
      "patient",
      "role name email"
    );
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get all appointments for a patient
const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Verify that the requesting user is the same as the patient
    if (req.user._id.toString() !== patientId) {
      return res
        .status(403)
        .json({ error: "Not authorized to view these appointments" });
    }

    const appointments = await Appointment.find({
      patient: patientId,
    })
      .populate("doctor", "name email")
      .populate("prescription")
      .sort({ date: -1 }); // Sort by date in descending order (newest first)

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get detailed information for a specific appointment
const getAppointmentDashboard = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("prescription")
      .populate("medicalRecord");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if this doctor is authorized to view this appointment
    if (appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this appointment" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment dashboard:", error);
    res.status(500).json({ error: "Failed to fetch appointment details" });
  }
};

// Update appointment with diagnosis and notes
const updateAppointmentDiagnosis = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { diagnosis, notes, suggestedTests } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if this doctor is authorized to update this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this appointment" });
    }

    appointment.diagnosis = diagnosis;
    appointment.notes = notes;
    appointment.suggestedTests = suggestedTests;

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment diagnosis:", error);
    res.status(500).json({ error: "Failed to update appointment diagnosis" });
  }
};

// Add prescription to appointment
const addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { medications, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if this doctor is authorized to update this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this appointment" });
    }

    // Create a new prescription
    const prescription = new Prescription({
      doctor: req.user._id,
      patient: appointment.patient,
      appointment: appointmentId,
      medications,
      notes,
    });

    const savedPrescription = await prescription.save();

    // Update the appointment with the prescription reference
    appointment.prescription = savedPrescription._id;
    await appointment.save();

    res.status(201).json(savedPrescription);
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ error: "Failed to add prescription" });
  }
};

// Add or update medical record for a patient
const updateMedicalRecord = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { diagnosis, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if this doctor is authorized
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Find existing medical record or create a new one
    let medicalRecord;

    if (appointment.medicalRecord) {
      medicalRecord = await MedicalRecord.findById(appointment.medicalRecord);
      medicalRecord.diagnosis = diagnosis;
      medicalRecord.notes = notes;
    } else {
      medicalRecord = new MedicalRecord({
        patient: appointment.patient,
        diagnosis,
        notes,
        files: [],
      });
    }

    const savedMedicalRecord = await medicalRecord.save();

    // Update the appointment with the medical record reference if it's new
    if (!appointment.medicalRecord) {
      appointment.medicalRecord = savedMedicalRecord._id;
      await appointment.save();
    }

    res.status(200).json(savedMedicalRecord);
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ error: "Failed to update medical record" });
  }
};

// Add diagnostic report to an appointment
const addDiagnosticReport = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { name } = req.body;

    // Check for file upload
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if this doctor is authorized to update this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      // Remove the uploaded file as we're not going to use it
      fs.unlinkSync(req.file.path);
      return res
        .status(403)
        .json({ error: "Not authorized to update this appointment" });
    }

    // Generate full file URL (including backend URL)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const fileUrl = `${backendUrl}/uploads/${path.basename(req.file.path)}`;

    // Add the diagnostic report to the appointment
    appointment.diagnosticReports.push({
      name,
      fileUrl,
      uploadedAt: new Date(),
    });

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error adding diagnostic report:", error);
    // If there was an uploaded file, clean it up
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Error removing file after error:", unlinkErr);
      }
    }
    res.status(500).json({ error: "Failed to add diagnostic report" });
  }
};

// Mark appointment as completed
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if this doctor is authorized to update this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this appointment" });
    }

    appointment.status = "completed";
    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ error: "Failed to complete appointment" });
  }
};

// Get all completed appointments for a patient
const getPatientCompletedAppointments = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Verify that the requesting user is the same as the patient
    if (req.user._id.toString() !== patientId) {
      return res
        .status(403)
        .json({ error: "Not authorized to view these appointments" });
    }

    const appointments = await Appointment.find({
      patient: patientId,
      status: "completed",
    })
      .populate("doctor", "name email")
      .populate("prescription")
      .sort({ date: -1 }); // Sort by date in descending order (newest first)

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching patient completed appointments:", error);
    res.status(500).json({ error: "Failed to fetch completed appointments" });
  }
};

// Add a new controller function for patients to view their appointment details
const getPatientAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("prescription")
      .populate("medicalRecord");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Verify that the requesting user is the patient associated with this appointment
    if (appointment.patient._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this appointment" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching patient appointment details:", error);
    res.status(500).json({ error: "Failed to fetch appointment details" });
  }
};

export {
  getAppointments,
  getPatientAppointments,
  getAppointmentDashboard,
  updateAppointmentDiagnosis,
  addPrescription,
  updateMedicalRecord,
  addDiagnosticReport,
  completeAppointment,
  getPatientCompletedAppointments,
  getPatientAppointmentDetails,
};
