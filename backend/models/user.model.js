import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["patient", "doctor", "pharmacist", "admin"],
      default: "doctor",
    },
    firstlogin: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);
export default User;

