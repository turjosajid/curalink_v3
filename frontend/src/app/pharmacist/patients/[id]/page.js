"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const router = useRouter();
  const patientId = params.id;

  // Get API URL from environment variable with fallback
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    // Check if we have a token (user is logged in)
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    // Fetch patient prescriptions
    const fetchPatientPrescriptions = async () => {
      try {
        setLoading(true);

        // Fetch all prescriptions (pharmacist has access to all)
        const prescriptionsResponse = await axios.get(
          `${API_URL}/api/prescriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter prescriptions for this specific patient
        const patientPrescriptions = prescriptionsResponse.data.filter(
          (prescription) => prescription.patient._id === patientId
        );

        setPrescriptions(patientPrescriptions);

        // Set patient info from the first prescription (if any)
        if (patientPrescriptions.length > 0) {
          setPatientData(patientPrescriptions[0].patient);
        } else {
          // If no prescriptions, try to get patient info directly
          try {
            const userResponse = await axios.get(
              `${API_URL}/api/users/${patientId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setPatientData(userResponse.data);
          } catch (err) {
            console.error("Error fetching patient details:", err);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching patient prescriptions:", err);
        setError("Failed to load prescription data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientPrescriptions();
  }, [patientId, router, API_URL]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update function to navigate to prescription details page with patient context
  const handleViewPrescription = (prescription) => {
    router.push(
      `/pharmacist/prescriptions/${prescription._id}?fromPatient=true&patientId=${patientId}`
    );
  };

  // Go back to patients list
  const handleGoBack = () => {
    router.push("/pharmacist/patients");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="outline" onClick={handleGoBack} className="mb-4">
            &larr; Back to Patients
          </Button>
          <h1 className="text-3xl font-bold">
            {patientData
              ? `${patientData.name}'s Prescriptions`
              : "Patient Prescriptions"}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading prescriptions...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-8">
          <p>No prescriptions found for this patient.</p>
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Doctor</th>
                    <th className="text-left p-3 font-medium">Medications</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr
                      key={prescription._id}
                      className={
                        index !== prescriptions.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-3">
                        {formatDate(prescription.createdAt)}
                      </td>
                      <td className="p-3">
                        {prescription.doctor?.name || "Unknown"}
                      </td>
                      <td className="p-3">
                        <ul className="list-disc list-inside">
                          {prescription.medications
                            ?.slice(0, 2)
                            .map((med, idx) => (
                              <li key={idx} className="text-sm">
                                {med.name} - {med.dosage}
                              </li>
                            ))}
                          {(prescription.medications?.length || 0) > 2 && (
                            <li className="text-sm text-gray-500">
                              +{prescription.medications.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </td>
                      <td className="p-3">
                        <Button
                          onClick={() => handleViewPrescription(prescription)}
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
