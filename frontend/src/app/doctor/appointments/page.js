"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/doctors/${user}/appointments`
      );
      console.log("Fetched appointments:", response.data); // Debugging line to check fetched data
      // Filter out completed and rejected appointments
      const upcomingAppointments = response.data.filter(
        (appointment) =>
          appointment.status !== "completed" &&
          appointment.status !== "rejected"
      );
      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUser(userId);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]); // Removed `appointments` from the dependency array

  const handleDeleteAppointment = async (appointmentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/doctors/appointments/${appointmentId}`
      );
      alert("Appointment deleted successfully!");
      setAppointments(
        appointments.filter((appointment) => appointment._id !== appointmentId)
      ); // Update appointments list
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">
          {" "}
          Upcoming Appointments
        </h1>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-400">No appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="bg-gray-700 p-4 rounded-lg shadow"
              >
                <p className="text-lg font-semibold text-gray-100">
                  {appointment.patient?.name || "Unknown Patient"}
                </p>
                <p className="text-gray-400">
                  Date: {new Date(appointment.date).toLocaleString()}
                </p>
                <p className="text-gray-400">Reason: {appointment.reason}</p>
                <p className="text-white-400">{appointment.status}</p>
                <div className="flex flex-wrap mt-3 gap-2">
                  <Link
                    href={`/doctor/appointments/dashboard/${appointment._id}`}
                    className="text-gray-900 bg-blue-400 border border-gray-300 focus:outline-none hover:bg-blue-500 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:text-white dark:border-gray-600 dark:hover:bg-blue-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={() =>
                      router.push(
                        `/doctor/appointments/patientdetails?patientId=${
                          appointment.patient?._id || ""
                        }`
                      )
                    }
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    disabled={!appointment.patient} // Disable button if patient is null
                  >
                    Show Patient Details
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/doctor/appointments/edit?appointmentId=${appointment._id}`
                      )
                    }
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Edit Appointment
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment._id)}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Delete Appointment
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
