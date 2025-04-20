import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Prescription", PrescriptionSchema);
