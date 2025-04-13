'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Access localStorage only on the client side
        const userId = localStorage.getItem("userId");
        setUser(userId);
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/doctors/${user}/appointments`
                );
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        if (user) {
            fetchAppointments();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-100 mb-4">Appointments</h1>
                {appointments.length === 0 ? (
                    <p className="text-center text-gray-400">No appointments found.</p>
                ) : (
                    <ul className="space-y-4">
                        {appointments.map((appointment) => (
                            <li key={appointment._id} className="bg-gray-700 p-4 rounded-lg shadow">
                                <p className="text-lg font-semibold text-gray-100">
                                    {appointment.patient.name}
                                </p>
                                <p className="text-gray-400">
                                    Date: {new Date(appointment.date).toLocaleString()}
                                </p>
                                <p className="text-gray-400">Reason: {appointment.reason}</p>
                                <p className="text-white-400">{appointment.status}</p>
                                <button
                                    onClick={() => router.push(`/doctor/appointments/patientdetails?patientId=${appointment.patient._id}`)}
                                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Show Patient Details
                                </button>
                                <button
                                    onClick={() => router.push(`/doctor/appointments/edit?appointmentId=${appointment._id}`)}
                                    className="mt-2 ml-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                >
                                    Edit Appointment
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;