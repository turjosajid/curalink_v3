const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnosis: String,
  notes: String,
  files: [String], 
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
},{
    timestamps: true,
});

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
