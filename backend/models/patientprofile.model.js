import mongoose from "mongoose";

const PatientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: Number,
  gender: String,
  phone: String,
  address: String,
  bloodGroup: String,
  allergies: [String],
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true },
  },
  diagnosticReports: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  medicalRecords: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("PatientProfile", PatientProfileSchema);
