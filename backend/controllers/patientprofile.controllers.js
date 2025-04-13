import PatientProfile from "../models/patientprofile.model.js";


// Create a new patient profile
export const createPatientProfile = async (req, res) => {
    try {
        const patientProfile = new PatientProfile(req.body);
        const savedProfile = await patientProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a patient profile by ID
export const getPatientProfileById = async (req, res) => {
    try {
        const profile = await PatientProfile.findOne({ user: req.params.id }).populate({
            path: "user",
            select: "name"
        });
        if (!profile) {
            return res.status(404).json({ error: "Patient profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a patient profile by ID
export const updatePatientProfile = async (req, res) => {
    try {
        const updatedProfile = await PatientProfile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ error: "Patient profile not found" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a patient profile by ID
export const deletePatientProfile = async (req, res) => {
    try {
        const deletedProfile = await PatientProfile.findByIdAndDelete(req.params.id);
        if (!deletedProfile) {
            return res.status(404).json({ error: "Patient profile not found" });
        }
        res.status(200).json({ message: "Patient profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all patient profiles
export const getAllPatientProfiles = async (req, res) => {
    try {
        const profiles = await PatientProfile.find().populate("user");
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};