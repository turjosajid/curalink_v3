"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BookAppointmentPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    reason: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Fetch all available doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/doctor-profiles`
        );
        const doctorsWithSlots = response.data.filter(doctor => 
          doctor.weeklyRecurringSlots && doctor.weeklyRecurringSlots.length > 0
        );
        setDoctors(doctorsWithSlots);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch available slots when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailableSlots(selectedDoctor);
    }
  }, [selectedDoctor]);

  const fetchAvailableSlots = async (doctorId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/doctors/${doctorId}/available-slots`
      );
      const slots = generateAvailableDateTimes(response.data.weeklyRecurringSlots || []);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const generateAvailableDateTimes = (weeklySlots) => {
    const availableTimesByWeek = [];
    const today = new Date();
    const weekStart = new Date(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    availableTimesByWeek.push({
      weekNum: 1,
      label: `Available slots: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
      slots: [],
    });

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);
      const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
      
      const daySlots = weeklySlots.filter((slot) => slot.day === dayOfWeek);
      
      daySlots.forEach((slot) => {
        const [startHour, startMinute] = slot.startTime.split(":").map(Number);
        const slotDate = new Date(date);
        slotDate.setHours(startHour, startMinute, 0);

        if (slotDate > today) {
          const dateTimeStr = slotDate.toISOString().slice(0, 16);
          availableTimesByWeek[0].slots.push({
            dateTimeStr,
            display: `${slotDate.toLocaleDateString()} (${dayOfWeek}) ${slot.startTime} - ${slot.endTime}`,
          });
        }
      });
    }

    return availableTimesByWeek;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "doctor") {
      setSelectedDoctor(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!formData.date) {
      setFormError("Please select an available time slot");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const appointmentData = {
        patient: userId,
        doctor: formData.doctor,
        date: formData.date,
        reason: formData.reason,
        status: "pending",
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/doctors/appointments`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormSuccess(true);
      setTimeout(() => {
        router.push("/patient/appointments");
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setFormError(error.response?.data?.error || "Failed to book appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book an Appointment</h1>

        {formSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Appointment booked successfully! Redirecting to appointments page...
          </div>
        )}

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="doctor">Select Doctor</Label>
              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.user._id}>
                    Dr. {doctor.user.name} - {doctor.specialization} ({doctor.experienceYears} years exp.)
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctor && (
              <div>
                <Label htmlFor="date">Select Available Time Slot</Label>
                <select
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a time slot</option>
                  {availableSlots.map((week) => (
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
              </div>
            )}

            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Please describe your reason for visiting"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/patient/appointments")}
              >
                Cancel
              </Button>
              <Button type="submit">Book Appointment</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}