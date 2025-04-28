"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PharmacistPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Get API URL from environment variable with fallback
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch all patients with prescription history
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Get all prescriptions first
      const response = await axios.get(`${API_URL}/api/prescriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract unique patients from prescriptions
      const prescriptionData = response.data;
      const uniquePatients = {};

      prescriptionData.forEach((prescription) => {
        if (prescription.patient && prescription.patient._id) {
          const patientId = prescription.patient._id;

          if (!uniquePatients[patientId]) {
            uniquePatients[patientId] = {
              _id: patientId,
              name: prescription.patient.name,
              prescriptionCount: 1,
              latestPrescription: prescription.createdAt,
              // Add more patient details as needed
            };
          } else {
            uniquePatients[patientId].prescriptionCount += 1;
            if (
              new Date(prescription.createdAt) >
              new Date(uniquePatients[patientId].latestPrescription)
            ) {
              uniquePatients[patientId].latestPrescription =
                prescription.createdAt;
            }
          }
        }
      });

      // Convert to array
      const patientList = Object.values(uniquePatients);
      setPatients(patientList);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Search patients by name
  const searchPatients = async () => {
    if (!searchQuery.trim()) {
      fetchPatients();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Get all prescriptions
      const response = await axios.get(`${API_URL}/api/prescriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter prescriptions by patient name match
      const prescriptionData = response.data;
      const uniquePatients = {};

      prescriptionData.forEach((prescription) => {
        if (
          prescription.patient &&
          prescription.patient.name &&
          prescription.patient.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          const patientId = prescription.patient._id;

          if (!uniquePatients[patientId]) {
            uniquePatients[patientId] = {
              _id: patientId,
              name: prescription.patient.name,
              prescriptionCount: 1,
              latestPrescription: prescription.createdAt,
            };
          } else {
            uniquePatients[patientId].prescriptionCount += 1;
            if (
              new Date(prescription.createdAt) >
              new Date(uniquePatients[patientId].latestPrescription)
            ) {
              uniquePatients[patientId].latestPrescription =
                prescription.createdAt;
            }
          }
        }
      });

      // Convert to array
      const patientList = Object.values(uniquePatients);
      setPatients(patientList);
      setError(null);
    } catch (err) {
      console.error("Error searching patients:", err);
      setError("Failed to search patients. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchPatients();
  };

  // View patient details and prescriptions
  const viewPatientDetails = (id) => {
    router.push(`/pharmacist/patients/${id}`);
  };

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Patient Records</h1>

      {/* Search form */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search by patient name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
        {searchQuery && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              fetchPatients();
            }}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">Loading patients...</div>
      ) : (
        <>
          {/* Results count */}
          <p className="mb-4">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} found
          </p>

          {/* Patients list */}
          {patients.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient) => (
                <Card
                  key={patient._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => viewPatientDetails(patient._id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {patient.name || "Unknown Patient"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <strong>Prescription Count:</strong>{" "}
                      {patient.prescriptionCount}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Latest Prescription:</strong>{" "}
                      {formatDate(patient.latestPrescription)}
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View Patient Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No patients found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
