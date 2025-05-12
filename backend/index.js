import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userroutes.js";
import doctorProfileRoutes from "./routes/doctorprofile.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientProfileRoutes from "./routes/patientprofile.routes.js";
import pharmacistProfileRoutes from "./routes/pharmacistprofile.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
dotenv.config();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server after successful MongoDB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctor-profiles", doctorProfileRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patient-profiles", patientProfileRoutes);
app.use("/api/pharmacist-profiles", pharmacistProfileRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
