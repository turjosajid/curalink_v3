import DoctorProfile from "../models/doctorprofile.model.js";

// Controller to create a doctor profile
export const createDoctorProfile = async (req, res) => {
  try {
    const doctorProfile = new DoctorProfile(req.body);
    const savedProfile = await doctorProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to update a doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    updates = req.body;
    

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { user: req.params.id },
      updates,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to get a doctor profile by ID
export const getDoctorProfileById = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.params.id });
    if (!doctorProfile) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }
    res.status(200).json(doctorProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

