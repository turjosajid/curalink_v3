"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ScheduleAppointmentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dpatients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient: "",
    date: "",
    reason: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUser(userId);
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/patient-profiles"
        );
        console.log("Fetched patients:", response.data);
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    // Validate that appointment date is not in the past
    const appointmentDate = new Date(formData.date);
    const currentDate = new Date();

    if (appointmentDate <= currentDate) {
      setFormError("Appointment date and time must be in the future.");
      return;
    }

    try {
      const appointmentData = { ...formData, doctor: user }; // Add user ID as doctor
      await axios.post(
        "http://localhost:5000/api/doctors/appointments",
        appointmentData
      );

      // Show success message and reset form
      setFormSuccess(true);
      setFormData({ patient: "", date: "", reason: "" });

      // Redirect to appointments page after a delay
      setTimeout(() => {
        router.push("/doctor/appointments");
      }, 2000);
    } catch (error) {
      console.error("Error adding appointment:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setFormError(error.response.data.error);
      } else {
        setFormError("Failed to add appointment. Please try again.");
      }
    }
  };

  // Format date-time for input field's min attribute
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">
          Schedule New Appointment
        </h1>

        {formSuccess && (
          <div className="bg-green-500 text-white p-4 mb-6 rounded-md">
            Appointment scheduled successfully! Redirecting to appointments
            page...
          </div>
        )}

        {formError && (
          <div className="bg-red-500 text-white p-4 mb-6 rounded-md">
            {formError}
          </div>
        )}

        <Card className="p-6 bg-gray-700">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-6">
              <Label htmlFor="patient" className="text-gray-200 mb-2 block">
                Patient
              </Label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleFormChange}
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  Select a patient
                </option>
                {dpatients.map((patient) => (
                  <option key={patient.user._id} value={patient.user._id}>
                    {patient.user.name} - {patient.user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <Label htmlFor="date" className="text-gray-200 mb-2 block">
                Date and Time
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleFormChange}
                min={getMinDateTime()}
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="reason" className="text-gray-200 mb-2 block">
                Reason for Appointment
              </Label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                rows="4"
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the reason for this appointment"
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-600 text-gray-100 hover:bg-gray-500"
                onClick={() => router.push("/doctor/appointments")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Schedule Appointment
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
