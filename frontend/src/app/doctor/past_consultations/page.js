"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PastConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // Get doctor ID from localStorage
        const doctorId = localStorage.getItem("userId");
        if (!doctorId) {
          throw new Error("Doctor ID not found in local storage");
        }

        // Fetch past consultations using the doctor ID with the correct backend URL
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/doctors/${doctorId}/past-consultations`
        );

        setConsultations(response.data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setError(error.message || "Failed to fetch past consultations");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Past Consultations</h1>
      {consultations.length === 0 ? (
        <p className="text-gray-500">No past consultations found.</p>
      ) : (
        <ul className="space-y-4">
          {consultations.map((consultation) => (
            <li
              key={consultation._id}
              className="border p-4 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {consultation.patient
                  ? consultation.patient.name
                  : "Unknown Patient"}
              </h2>
              <p className="text-gray-700">
                Date: {new Date(consultation.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                Reason: {consultation.reason || "Not specified"}
              </p>
              <div className="mt-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Completed
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PastConsultationsPage;
