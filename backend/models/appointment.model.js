// models/Appointment.js
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  reason: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
},{
    timestamps: true,
});

export default mongoose.model("Appointment", AppointmentSchema);
