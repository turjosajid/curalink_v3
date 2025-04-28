import Prescription from "../models/prescription.model.js";
import User from "../models/user.model.js";

// Get all prescriptions for pharmacist view
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("doctor", "name")
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
};

// Search prescriptions by patient name
export const searchPrescriptionsByPatient = async (req, res) => {
  try {
    const { query } = req.query;

    // Find patients whose names match the query
    const patients = await User.find({
      name: { $regex: query, $options: "i" },
      role: "patient",
    });

    const patientIds = patients.map((patient) => patient._id);

    // Find prescriptions for those patients
    const prescriptions = await Prescription.find({
      patient: { $in: patientIds },
    })
      .populate("doctor", "name")
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error searching prescriptions:", error);
    res.status(500).json({ error: "Failed to search prescriptions" });
  }
};

// Get prescription details
export const getPrescriptionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "name")
      .populate("patient", "name")
      .populate({
        path: "appointment",
        select: "date reason status diagnosis",
      });

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.status(200).json(prescription);
  } catch (error) {
    console.error("Error fetching prescription details:", error);
    res.status(500).json({ error: "Failed to fetch prescription details" });
  }
};
