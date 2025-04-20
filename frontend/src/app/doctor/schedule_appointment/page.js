"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ScheduleAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId"); // Get patientId from URL query parameters
  const [user, setUser] = useState(null);
  const [dpatients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient: patientId || "",
    date: "",
    reason: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDateTimes, setAvailableDateTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUser(userId);

    // Fetch doctor's available slots once we have the user ID
    if (userId) {
      fetchAvailableSlots(userId);
    }
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

  // Fetch doctor's available time slots
  const fetchAvailableSlots = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/doctors/${doctorId}/available-slots`
      );
      const slots = response.data.weeklyRecurringSlots || [];
      setAvailableSlots(slots);
      console.log("Available slots:", slots);

      // Generate available dates for the next week based on weekly slots
      generateAvailableDateTimes(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  // Generate available date and time slots for the next week only
  const generateAvailableDateTimes = (weeklySlots) => {
    const availableTimesByWeek = []; // Array to hold 1 week of data
    const today = new Date();

    // Initialize just 1 week of data
    const weekStart = new Date(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    availableTimesByWeek.push({
      weekNum: 1,
      label: `Available slots: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
      slots: [],
    });

    // Fill in available slots for each day in the next week
    // For each day of the week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);

      const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });

      // Find slots for this day of the week
      const daySlots = weeklySlots.filter((slot) => slot.day === dayOfWeek);

      if (daySlots.length > 0) {
        for (const slot of daySlots) {
          const [startHour, startMinute] = slot.startTime
            .split(":")
            .map(Number);
          const [endHour, endMinute] = slot.endTime.split(":").map(Number);

          // Create a new date object for this slot
          const slotDate = new Date(date);
          slotDate.setHours(startHour, startMinute, 0);

          // Only include future times
          if (slotDate > today) {
            const dateTimeStr = slotDate.toISOString().slice(0, 16); // Format: "YYYY-MM-DDTHH:MM"

            availableTimesByWeek[0].slots.push({
              dateTimeStr,
              display: `${slotDate.toLocaleDateString()} (${dayOfWeek}) ${
                slot.startTime
              } - ${slot.endTime}`,
            });
          }
        }
      }
    }

    setAvailableDateTimes(availableTimesByWeek);
  };

  const handleFormChange = (e) => {
    if (e.target.name === "date") {
      setSelectedDate(e.target.value);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if a datetime is within doctor's available slots
  const isTimeAvailable = (dateTime) => {
    const date = new Date(dateTime);
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Ensure we're checking against slots that we actually offered in the dropdown
    // This is a more direct comparison to what we generated
    return availableDateTimes.some((week) =>
      week.slots.some((slot) => slot.dateTimeStr === dateTime)
    );
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

    // Check if the selected time is within the doctor's available slots
    if (!isTimeAvailable(formData.date)) {
      setFormError(
        "The selected time is not within your available slots. Please select an available time."
      );
      return;
    }

    try {
      // Create appointment data with exact ISO string format from selected time slot
      const appointmentData = {
        patient: formData.patient,
        date: formData.date, // This is already in ISO format from the dropdown
        reason: formData.reason,
        doctor: user,
        status: "pending", // Using "pending" which is a valid enum value
      };

      console.log("Sending appointment data:", appointmentData);

      const response = await axios.post(
        "http://localhost:5000/api/doctors/appointments",
        appointmentData
      );

      console.log("Appointment created:", response.data);

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
              {availableDateTimes.length > 0 ? (
                <select
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select an available time slot
                  </option>
                  {availableDateTimes.map((week) => (
                    <optgroup key={week.weekNum} label={week.label}>
                      {week.slots.length > 0 ? (
                        week.slots.map((slot, index) => (
                          <option key={index} value={slot.dateTimeStr}>
                            {slot.display}
                          </option>
                        ))
                      ) : (
                        <option disabled>No available slots this week</option>
                      )}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <div className="text-yellow-400 mb-2">
                  No available time slots found. Please set up your availability
                  in the Availability page first.
                </div>
              )}
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
                disabled={availableDateTimes.length === 0}
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
