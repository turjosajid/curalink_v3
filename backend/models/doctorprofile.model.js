import mongoose from "mongoose";

const DoctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialization: String,
  qualifications: [String],
  experienceYears: Number,
  phone: String,
  gender: String,
  bio: String,
  availableSlots: [Date], // for appointment scheduling
});

export default mongoose.model("DoctorProfile", DoctorProfileSchema);
