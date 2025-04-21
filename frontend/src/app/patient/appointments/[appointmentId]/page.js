"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppointmentDetailsPage() {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId;
  console.log("Appointment ID:", appointmentId);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch appointment details using the new patient-specific endpoint
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/appointments/patient/appointment/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointment(response.data);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError(err.message || "Failed to fetch appointment details");
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Appointment Details</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
        <Button onClick={handleBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Appointment Details</h1>
        <p className="text-gray-600">Appointment not found</p>
        <Button onClick={handleBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBack} className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Button>
        <h1 className="text-3xl font-bold">Appointment Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Consultation Information</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-500">Doctor</p>
              <p className="text-lg">
                Dr. {appointment.doctor?.name || "Unknown Doctor"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Date & Time</p>
              <p className="text-lg">
                {new Date(appointment.date).toLocaleDateString()} at{" "}
                {new Date(appointment.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Status</p>
              <p className="text-lg capitalize">{appointment.status}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Reason for Visit</p>
              <p className="text-lg">{appointment.reason || "Not specified"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Medical Information</h2>
          <div className="space-y-3">
            {appointment.diagnosis ? (
              <div>
                <p className="font-medium text-gray-500">Diagnosis</p>
                <p className="text-lg">{appointment.diagnosis}</p>
              </div>
            ) : (
              <p className="text-gray-500">No diagnosis provided</p>
            )}

            {appointment.notes && (
              <div>
                <p className="font-medium text-gray-500">Doctor&#39;s Notes</p>
                <p className="text-lg">{appointment.notes}</p>
              </div>
            )}

            {appointment.suggestedTests &&
              appointment.suggestedTests.length > 0 && (
                <div>
                  <p className="font-medium text-gray-500">Suggested Tests</p>
                  <ul className="list-disc ml-5">
                    {appointment.suggestedTests.map((test, index) => (
                      <li key={index} className="text-lg">
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </Card>
      </div>

      {/* Prescription Section */}
      {appointment.prescription && (
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Prescription</h2>
          {appointment.prescription.medications &&
          appointment.prescription.medications.length > 0 ? (
            <div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                {appointment.prescription.medications.map((med, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <h3 className="font-semibold text-lg">{med.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Dosage:</span>{" "}
                        {med.dosage}
                      </p>
                      <p>
                        <span className="font-medium">Frequency:</span>{" "}
                        {med.frequency}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {med.duration}
                      </p>
                      {med.instructions && (
                        <p>
                          <span className="font-medium">Instructions:</span>{" "}
                          {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {appointment.prescription.notes && (
                <div className="mt-4">
                  <h3 className="font-semibold">Additional Notes</h3>
                  <p className="mt-1">{appointment.prescription.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No medications prescribed</p>
          )}
        </Card>
      )}

      {/* Diagnostic Reports Section */}
      {appointment.diagnosticReports &&
        appointment.diagnosticReports.length > 0 && (
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Diagnostic Reports</h2>
            <div className="space-y-4">
              {appointment.diagnosticReports.map((report, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on{" "}
                      {new Date(report.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild>
                    <Link
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Report
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
    </div>
  );
}
