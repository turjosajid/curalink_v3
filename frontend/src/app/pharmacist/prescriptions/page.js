"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PharmacistPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Get API URL from environment variable with fallback
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch all prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Using API URL:", API_URL); // Log the API URL being used

      const response = await axios.get(`${API_URL}/api/prescriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrescriptions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Search prescriptions by patient name
  const searchPrescriptions = async () => {
    if (!searchQuery.trim()) {
      fetchPrescriptions();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/prescriptions/search?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrescriptions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error searching prescriptions:", err);
      setError("Failed to search prescriptions. Please try again later.");
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
    searchPrescriptions();
  };

  // View prescription details
  const viewPrescriptionDetails = (id) => {
    router.push(`/pharmacist/prescriptions/${id}`);
  };

  // Load prescriptions on component mount
  useEffect(() => {
    console.log(
      "Environment variable NEXT_PUBLIC_API_URL:",
      process.env.NEXT_PUBLIC_API_URL
    );
    fetchPrescriptions();
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
      <h1 className="text-2xl font-bold mb-6">Patient Prescriptions</h1>

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
              fetchPrescriptions();
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
        <div className="text-center py-8">Loading prescriptions...</div>
      ) : (
        <>
          {/* Results count */}
          <p className="mb-4">
            {prescriptions.length} prescription
            {prescriptions.length !== 1 ? "s" : ""} found
          </p>

          {/* Prescriptions list */}
          {prescriptions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prescriptions.map((prescription) => (
                <Card
                  key={prescription._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => viewPrescriptionDetails(prescription._id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {prescription.patient?.name || "Unknown Patient"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Prescribed by Dr. {prescription.doctor?.name || "Unknown"}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Date:</strong>{" "}
                      {formatDate(prescription.createdAt)}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Medications:</strong>{" "}
                      {prescription.medications.length}
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No prescriptions found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
