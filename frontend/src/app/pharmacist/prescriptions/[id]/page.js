"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PrescriptionDetails({ params }) {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  // Get API URL from environment variable with fallback
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch prescription details
  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Using API URL for details:", API_URL); // Log the API URL being used

        const response = await axios.get(`${API_URL}/api/prescriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrescription(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching prescription details:", err);
        setError(
          "Failed to load prescription details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log(
        "Environment variable NEXT_PUBLIC_API_URL:",
        process.env.NEXT_PUBLIC_API_URL
      );
      fetchPrescriptionDetails();
    }
  }, [id, API_URL]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Go back to prescriptions list
  const handleBackClick = () => {
    router.push("/pharmacist/prescriptions");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Loading prescription details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Button onClick={handleBackClick}>Back to Prescriptions</Button>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Prescription not found</div>
        <Button onClick={handleBackClick}>Back to Prescriptions</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={handleBackClick} className="mb-4">
        ← Back to Prescriptions
      </Button>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Prescription info card */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Prescription Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Patient</h3>
                <p className="font-semibold">
                  {prescription.patient?.name || "Unknown Patient"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">
                  Prescribed By
                </h3>
                <p className="font-semibold">
                  Dr. {prescription.doctor?.name || "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Date</h3>
                <p>{formatDate(prescription.createdAt)}</p>
              </div>
              {prescription.appointment && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500">
                    Appointment
                  </h3>
                  <p>Date: {formatDate(prescription.appointment.date)}</p>
                  <p>Reason: {prescription.appointment.reason}</p>
                  {prescription.appointment.diagnosis && (
                    <p>Diagnosis: {prescription.appointment.diagnosis}</p>
                  )}
                </div>
              )}
              {prescription.notes && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500">
                    Doctor Notes
                  </h3>
                  <p className="text-sm">{prescription.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medications card */}
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Medications</CardTitle>
          </CardHeader>
          <CardContent>
            {prescription.medications && prescription.medications.length > 0 ? (
              <div className="space-y-4">
                {prescription.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{medication.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Dosage</p>
                        <p>{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p>{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p>{medication.duration}</p>
                      </div>
                    </div>
                    {medication.instructions && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Instructions</p>
                        <p className="text-sm">{medication.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                No medications listed
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
