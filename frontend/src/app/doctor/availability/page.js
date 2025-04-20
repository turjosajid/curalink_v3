"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AvailabilityPage = () => {
  const [weeklyRecurringSlots, setWeeklyRecurringSlots] = useState([]);
  const [newWeeklySlot, setNewWeeklySlot] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/doctors/${userId}/available-slots`
        );
        setWeeklyRecurringSlots(response.data.weeklyRecurringSlots || []);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [userId]);

  const addWeeklySlot = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/doctors/${userId}/weekly-slots`,
        newWeeklySlot
      );
      setWeeklyRecurringSlots(response.data.weeklyRecurringSlots);
      // Reset form to default values
      setNewWeeklySlot({
        day: "Monday",
        startTime: "09:00",
        endTime: "10:00",
      });
    } catch (error) {
      console.error("Error adding weekly slot:", error);
    }
  };

  const deleteWeeklySlot = async (slotId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/doctors/${userId}/weekly-slots/${slotId}`
      );
      // Remove the deleted slot from state
      setWeeklyRecurringSlots(
        weeklyRecurringSlots.filter((slot) => slot._id !== slotId)
      );
    } catch (error) {
      console.error("Error deleting weekly slot:", error);
    }
  };

  const handleWeeklySlotChange = (e) => {
    const { name, value } = e.target;
    setNewWeeklySlot({
      ...newWeeklySlot,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">
          Manage Weekly Availability
        </h1>

        <div>
          <h2 className="text-xl font-semibold mb-4">Weekly Recurring Slots</h2>
          <ul className="mb-4 max-h-60 overflow-y-auto">
            {weeklyRecurringSlots.map((slot) => (
              <li
                key={slot._id}
                className="flex justify-between items-center py-2 border-b border-gray-700"
              >
                <span>
                  {slot.day} {slot.startTime} - {slot.endTime}
                </span>
                <button
                  onClick={() => deleteWeeklySlot(slot._id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </li>
            ))}
            {weeklyRecurringSlots.length === 0 && (
              <li className="text-gray-500 italic">
                No weekly recurring slots added yet
              </li>
            )}
          </ul>
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <select
                name="day"
                value={newWeeklySlot.day}
                onChange={handleWeeklySlotChange}
                className="w-full bg-gray-700 rounded border border-gray-600 px-3 py-2"
              >
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={newWeeklySlot.startTime}
                onChange={handleWeeklySlotChange}
                className="w-full bg-gray-700 rounded border border-gray-600 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={newWeeklySlot.endTime}
                onChange={handleWeeklySlotChange}
                className="w-full bg-gray-700 rounded border border-gray-600 px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={addWeeklySlot}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
          >
            Add Weekly Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
