import PharmacistProfile from "../models/pharmacistprofile.model.js";

// Create a new pharmacist profile
export const createPharmacistProfile = async (req, res) => {
    try {
        const pharmacistProfile = new PharmacistProfile(req.body);
        const savedProfile = await pharmacistProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a pharmacist profile by ID
export const getPharmacistProfileById = async (req, res) => {
    try {
        const profile = await PharmacistProfile.findOne({ user: req.params.id }).populate({
            path: "user",
            select: "name",
        });
        if (!profile) {
            return res.status(404).json({ error: "Pharmacist profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a pharmacist profile by ID
export const updatePharmacistProfile = async (req, res) => {
    try {
        const updatedProfile = await PharmacistProfile.findOneAndUpdate(
            { user: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ error: "Pharmacist profile not found" });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a pharmacist profile by ID
export const deletePharmacistProfile = async (req, res) => {
    try {
        const deletedProfile = await PharmacistProfile.findOneAndDelete({ user: req.params.id });
        if (!deletedProfile) {
            return res.status(404).json({ error: "Pharmacist profile not found" });
        }
        res.status(200).json({ message: "Pharmacist profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
