"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientLabReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
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

        // Fetch all appointments for the patient
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/appointments/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Extract all diagnostic reports from appointments
        const allReports = [];
        response.data.forEach((appointment) => {
          if (
            appointment.diagnosticReports &&
            appointment.diagnosticReports.length > 0
          ) {
            // Add appointment details to each report for context
            const reportsWithContext = appointment.diagnosticReports.map(
              (report) => ({
                ...report,
                appointmentId: appointment._id,
                appointmentDate: appointment.date,
                doctorName: appointment.doctor?.name || "Unknown Doctor",
              })
            );
            allReports.push(...reportsWithContext);
          }
        });

        // Sort reports by upload date (newest first)
        allReports.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );

        setReports(allReports);
      } catch (err) {
        console.error("Error fetching diagnostic reports:", err);
        setError(err.message || "Failed to fetch diagnostic reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading your diagnostic reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Diagnostic Reports</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Diagnostic Reports</h1>

      {reports.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">
            You don&apos;t have any diagnostic reports yet.
          </p>
          <p className="text-gray-500 mt-2">
            Reports will appear here when your doctor uploads them after a
            consultation.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{report.name}</h3>
                    <p className="text-gray-500">
                      Uploaded on:{" "}
                      {new Date(report.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Report
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <div>
                    <p className="font-medium">Doctor:</p>
                    <p className="text-gray-700">{report.doctorName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Consultation Date:</p>
                    <p className="text-gray-700">
                      {new Date(report.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Report
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
