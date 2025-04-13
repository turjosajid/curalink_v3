import mongoose from "mongoose";

const PharmacistProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone: String,
  pharmacyName: String,
  licenseNumber: String,
});

export default mongoose.model("PharmacistProfile", PharmacistProfileSchema);