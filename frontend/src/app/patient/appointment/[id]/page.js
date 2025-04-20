"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AppointmentDetailsPage({ params }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        // Fetch appointment data
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/appointments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointment(response.data);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointmentDetails();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading appointment details...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Appointment Details</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>Error: {error || "Appointment not found"}</p>
          <p>Please try again later or contact support.</p>
        </div>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointment Details</h1>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Appointment with Dr. {appointment.doctor?.name || "Unknown"}
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-500 text-sm">Date & Time</p>
              <p className="font-medium">
                {new Date(appointment.date).toLocaleDateString()} at{" "}
                {new Date(appointment.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
            {appointment.reason && (
              <div>
                <p className="text-gray-500 text-sm">Reason for Visit</p>
                <p className="font-medium">{appointment.reason}</p>
              </div>
            )}
          </div>

          {appointment.diagnosis && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {appointment.diagnosis}
              </p>
            </div>
          )}

          {appointment.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Doctor's Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {appointment.notes}
              </p>
            </div>
          )}

          {appointment.suggestedTests && appointment.suggestedTests.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Suggested Tests</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {appointment.suggestedTests.map((test, index) => (
                  <li key={index}>{test}</li>
                ))}
              </ul>
            </div>
          )}

          {appointment.diagnosticReports && appointment.diagnosticReports.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Diagnostic Reports</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {appointment.diagnosticReports.map((report, index) => (
                  <Card key={index} className="p-4">
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}
                    </p>
                    <Button 
                      className="mt-2 w-full"
                      variant="outline"
                      onClick={() => window.open(report.fileUrl, '_blank')}
                    >
                      View Report
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {appointment.prescription && (
        <div className="flex justify-end">
          <Button 
            onClick={() => router.push(`/patient/prescription/${appointment.prescription}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Prescription
          </Button>
        </div>
      )}
    </div>
  );
}
