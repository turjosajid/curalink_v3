import Appointment from "../models/appointment.model.js";
import DoctorProfile from "../models/doctorprofile.model.js";

// Get all appointments by doctor's user ID
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
    }).populate("patient", "name email"); // Populate patient details;
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate("doctor", "name")
      .populate("patient", "name email");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    // Validate that appointment date is not in the past
    const appointmentDate = new Date(req.body.date);
    const currentDate = new Date();

    if (appointmentDate <= currentDate) {
      return res
        .status(400)
        .json({ error: "Appointment date and time must be in the future." });
    }

    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};

// Edit an appointment
export const editAppointment = async (req, res) => {
  try {
    // If date is being updated, validate it's not in the past
    if (req.body.date) {
      const appointmentDate = new Date(req.body.date);
      const currentDate = new Date();

      if (appointmentDate <= currentDate) {
        return res
          .status(400)
          .json({ error: "Appointment date and time must be in the future." });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      req.body,
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

// Get available slots by doctor's user ID
export const getAvailableSlots = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({
      user: req.params.doctorId,
    });
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.status(200).json(doctorProfile.availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available slots", error });
  }
};

// Update available slots for a doctor
export const updateAvailableSlots = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOneAndUpdate(
      { user: req.params.doctorId },
      { availableSlots: req.body.availableSlots },
      { new: true }
    );
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.status(200).json(doctorProfile);
  } catch (error) {
    res.status(500).json({ message: "Error updating available slots", error });
  }
};

// Get all completed appointments (past consultations) by doctor's user ID
export const getPastConsultationsByDoctor = async (req, res) => {
  try {
    const pastConsultations = await Appointment.find({
      doctor: req.params.doctorId,
      status: "completed",
    })
      .populate("patient", "name email")
      .sort({ date: -1 }); // Sort by date, most recent first
    console.log("Past consultations:", pastConsultations); // Log for debugging
    res.status(200).json(pastConsultations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching past consultations", error });
  }
};
