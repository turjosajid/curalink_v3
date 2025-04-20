"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Get user ID from localStorage or session
        const doctorId = localStorage.getItem("userId");

        if (!doctorId) {
          throw new Error("Doctor ID not found");
        }

        // First, get all appointments for this doctor
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const appointmentsResponse = await axios.get(
          `${backendUrl}/api/doctors/${doctorId}/appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Extract unique patients from appointments
        const uniquePatients = [];
        const patientIds = new Set();

        appointmentsResponse.data.forEach((appointment) => {
          if (appointment.patient && !patientIds.has(appointment.patient._id)) {
            patientIds.add(appointment.patient._id);
            uniquePatients.push(appointment.patient);
          }
        });

        setPatients(uniquePatients);
        setFilteredPatients(uniquePatients);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Failed to fetch patients");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle search input change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Patients</h1>

      {/* Search box */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {/* Patients list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <Card
              key={patient._id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{patient.name}</h2>
                  <p className="text-gray-600">{patient.email}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/doctor/appointments/patientdetails?patientId=${patient._id}`}
                  >
                    View Medical History
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link
                    href={`/doctor/appointments/edit?patientId=${patient._id}`}
                  >
                    Schedule Appointment
                  </Link>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm
              ? "No patients found matching your search."
              : "You don't have any patients yet."}
          </div>
        )}
      </div>
    </div>
  );
}
