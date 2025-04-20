import Prescription from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";

// Get a prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prescription = await Prescription.findById(id);
    
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    
    // Check if the requesting user is authorized to view this prescription
    // Either the patient or the doctor who created it
    if (
      req.user._id.toString() !== prescription.patient.toString() &&
      req.user._id.toString() !== prescription.doctor.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ 
        error: "Not authorized to view this prescription" 
      });
    }
    
    res.status(200).json(prescription);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
};

// Get all prescriptions for a patient
export const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Verify that the requesting user is the same as the patient
    if (req.user._id.toString() !== patientId) {
      return res.status(403).json({ 
        error: "Not authorized to view these prescriptions" 
      });
    }
    
    const prescriptions = await Prescription.find({ patient: patientId })
      .sort({ createdAt: -1 }); // Sort by date in descending order (newest first)
    
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
};
