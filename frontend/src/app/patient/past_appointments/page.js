"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PatientPastAppointmentsPage() {
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPastAppointments = async () => {
      try {
        // Get patient ID from localStorage
        const patientId = localStorage.getItem("userId");
        if (!patientId) {
          throw new Error("Patient ID not found");
        }

        // Get JWT token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch past appointments using the patient ID
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/appointments/patient/${patientId}/completed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPastAppointments(response.data);
      } catch (err) {
        console.error("Error fetching past appointments:", err);
        setError(err.message || "Failed to fetch past appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchPastAppointments();
  }, []);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handleViewDetails = (appointmentId) => {
    // Navigate to a detailed view of the appointment
    router.push(`/patient/appointments/${appointmentId}`);
  };

  // Modal for viewing prescription
  const PrescriptionModal = ({ prescription, onClose }) => {
    if (!prescription) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Prescription Details</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Medications</h4>
              {prescription.medications &&
              prescription.medications.length > 0 ? (
                <div className="space-y-3">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        Dosage: {med.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        Frequency: {med.frequency}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {med.duration}
                      </p>
                      {med.instructions && (
                        <p className="text-sm text-gray-600">
                          Instructions: {med.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medications prescribed</p>
              )}
            </div>

            {prescription.notes && (
              <div>
                <h4 className="font-semibold text-lg mb-2">Notes</h4>
                <p className="text-gray-700">{prescription.notes}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading your past appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Past Consultations</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Past Consultations</h1>

      {pastAppointments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            You don&apos;t have any past consultations yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pastAppointments.map((appointment) => (
            <Card key={appointment._id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Dr. {appointment.doctor?.name || "Unknown Doctor"}
                    </h3>
                    <p className="text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {new Date(appointment.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Completed
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <div>
                    <p className="font-medium">Reason for Visit:</p>
                    <p className="text-gray-700">
                      {appointment.reason || "Not specified"}
                    </p>
                  </div>

                  {appointment.diagnosis && (
                    <div>
                      <p className="font-medium">Diagnosis:</p>
                      <p className="text-gray-700">{appointment.diagnosis}</p>
                    </div>
                  )}

                  {appointment.notes && (
                    <div>
                      <p className="font-medium">Doctor&apos;s Notes:</p>
                      <p className="text-gray-700">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  {appointment.prescription && (
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() =>
                        handleViewPrescription(appointment.prescription)
                      }
                    >
                      View Prescription
                    </Button>
                  )}
                  <Button onClick={() => handleViewDetails(appointment._id)}>
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Render prescription modal when a prescription is selected */}
      {showPrescriptionModal && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </div>
  );
}
