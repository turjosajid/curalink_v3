"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import axios from "axios";

const SetDetailsPage = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize useRouter

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const userId = localStorage.getItem("userId");
      const updatedRole = role.toLowerCase(); // Use a local variable instead of reassigning state
      const response = await axios.put(
        `${backendUrl}/api/users/${userId}`,
        { role: updatedRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message || "Role updated successfully!");
      localStorage.setItem("role", updatedRole); // Store the role in local storage
      setTimeout(() => router.push("/setdetails"), 1000); // Redirect to page.js after 2 seconds
    } catch (error) {
      setMessage("Failed to update role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-100 mb-6">Set Your Role</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-600 mb-4">
            Role:
            <select
              value={role}
              onChange={handleRoleChange}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="Doctor">Doctor</option>
              <option value="Patient">Patient</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Set Role
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SetDetailsPage;
