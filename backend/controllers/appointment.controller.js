import Appointment from "../models/appointment.model.js";

const getAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctor: doctorId }).populate(
      "patient",
      "role name email"
    ); // Populate patient with name and emai // Optionally populate doctor
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export { getAppointments };
