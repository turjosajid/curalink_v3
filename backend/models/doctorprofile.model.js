import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  startTime: {
    type: String, // Format: "HH:MM" in 24-hour format
    required: true,
  },
  endTime: {
    type: String, // Format: "HH:MM" in 24-hour format
    required: true,
  },
});

const DoctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialization: String,
  qualifications: [String],
  experienceYears: Number,
  phone: String,
  gender: String,
  bio: String,
  weeklyRecurringSlots: [TimeSlotSchema], // Only keeping weekly recurring slots
});

export default mongoose.model("DoctorProfile", DoctorProfileSchema);
