'use client';
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const AvailabilityPage = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlot, setNewSlot] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/${userId}/available-slots`);
        setAvailableSlots(response.data);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [userId]);

  const updateAvailableSlots = async () => {
    if (!newSlot) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/doctors/${userId}/available-slots`, {
        availableSlots: [...availableSlots, newSlot],
      });
      setAvailableSlots(response.data.availableSlots);
      setNewSlot(null);
    } catch (error) {
      console.error("Error updating available slots:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Manage Availability</h1>
        <ul className="mb-4">
          {availableSlots.map((slot, index) => (
            <li key={index} className="text-gray-300">
              {new Date(slot).toLocaleString()}
            </li>
          ))}
        </ul>
        <DatePicker
          selected={newSlot}
          onChange={(date) => setNewSlot(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select a date and time"
          className="border px-4 py-2 rounded bg-gray-700 text-gray-200 w-full mb-4"
        />
        <button
          onClick={updateAvailableSlots}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
        >
          Update Slots
        </button>
      </div>
    </div>
  );
};

export default AvailabilityPage;
