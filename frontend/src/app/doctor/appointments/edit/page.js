'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const EditAppointmentPage = () => {
  const router = useRouter();
  const searchparams = useSearchParams();
  const appointmentId = searchparams.get('appointmentId'); // Safely access appointmentId
  console.log("Appointment ID:", appointmentId); // Debugging line

  const [formData, setFormData] = useState({
    date: "",
    reason: "",
    status: "",
  });
 
  useEffect(() => {
    if (!appointmentId) return; // Ensure appointmentId is defined
    // Fetch existing appointment data
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/appointments/${appointmentId}`)
      .then((response) => {
        const appointmentData = response.data;
        // Format the date to "yyyy-MM-ddThh:mm"
        const formattedDate = new Date(appointmentData.date).toISOString().slice(0, 16);
        setFormData({ ...appointmentData, date: formattedDate });
      })
      .catch((error) => {
        console.error("Error fetching appointment data:", error);
      });
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update appointment data
    axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/appointments/${appointmentId}`, formData)
      .then(() => {
        alert("Appointment updated successfully!");
        router.push("/doctor/appointments");
      })
      .catch((error) => {
        console.error("Error updating appointment:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">Edit Appointment</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-200 mb-2">Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 text-gray-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Reason:</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 text-gray-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentPage;
