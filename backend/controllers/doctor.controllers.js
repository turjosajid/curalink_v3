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
    // Get the appointment data from the request body
    const appointmentData = { ...req.body };
    
    // Validate that appointment date is not in the past
    const appointmentDate = new Date(appointmentData.date);
    const currentDate = new Date();

    if (appointmentDate <= currentDate) {
      return res
        .status(400)
        .json({ error: "Appointment date and time must be in the future." });
    }

    // Make sure the date is properly preserved as an ISO string
    // This prevents any timezone conversion issues
    appointmentData.date = appointmentDate.toISOString();

    const newAppointment = new Appointment(appointmentData);
    const savedAppointment = await newAppointment.save();
    
    // Return the appointment with the correct date format
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Error creating appointment", error: error.message });
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
    const appointmentData = { ...req.body };
    
    // If date is being updated, validate it's not in the past
    if (appointmentData.date) {
      const appointmentDate = new Date(appointmentData.date);
      const currentDate = new Date();

      if (appointmentDate <= currentDate) {
        return res
          .status(400)
          .json({ error: "Appointment date and time must be in the future." });
      }
      
      // Ensure date is stored in consistent ISO format
      appointmentData.date = appointmentDate.toISOString();
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      appointmentData,
      { new: true }
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment", error: error.message });
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

    // Return only weekly recurring slots
    res.status(200).json({
      weeklyRecurringSlots: doctorProfile.weeklyRecurringSlots || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available slots", error });
  }
};

// Update available slots for a doctor
export const updateAvailableSlots = async (req, res) => {
  try {
    // Only handle weekly recurring slots
    if (!req.body.weeklyRecurringSlots) {
      return res
        .status(400)
        .json({ message: "Weekly recurring slots are required" });
    }

    const doctorProfile = await DoctorProfile.findOneAndUpdate(
      { user: req.params.doctorId },
      { weeklyRecurringSlots: req.body.weeklyRecurringSlots },
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

// Add a new weekly recurring slot
export const addWeeklyRecurringSlot = async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        message: "Day, start time, and end time are required",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({
      user: req.params.doctorId,
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Add the new recurring slot
    doctorProfile.weeklyRecurringSlots.push({ day, startTime, endTime });
    await doctorProfile.save();

    res.status(200).json(doctorProfile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding weekly recurring slot", error });
  }
};

// Delete a weekly recurring slot
export const deleteWeeklyRecurringSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const doctorProfile = await DoctorProfile.findOne({
      user: req.params.doctorId,
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Remove the slot with the given ID
    doctorProfile.weeklyRecurringSlots.id(slotId).remove();
    await doctorProfile.save();

    res.status(200).json({
      message: "Weekly recurring slot deleted successfully",
      doctorProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting weekly recurring slot", error });
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
