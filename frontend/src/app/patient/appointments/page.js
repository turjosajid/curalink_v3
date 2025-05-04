"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        // Get the userId and token directly from localStorage
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          router.push("/signin");
          return;
        }

        // Fetch all patient appointments using axios
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/appointments/patient/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter out completed appointments
        const activeAppointments = response.data.filter(
          (appointment) => appointment.status !== "completed"
        );

        setAppointments(activeAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
// appointment page myappoint e click then pathient book-appoint page go
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>  
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/patient/book-appointment")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Book Appointment
          </Button>
          <Button
            onClick={() => router.push("/patient/past_appointments")}
            variant="outline"
          >
            View Past Appointments
          </Button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            You don&#39;t have any active appointments.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              router.push("/patient/book-appointment");
            }}
          >
            Book an Appointment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <Card
              key={appointment._id}
              className="p-4 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">
                  Dr. {appointment.doctor?.name || "Unknown"}
                </h2>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Date: </span>
                {formatDate(appointment.date)}
              </p>
              {appointment.reason && (
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Reason: </span>
                  {appointment.reason}
                </p>
              )}
              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    // Navigate to appointment details page
                    router.push(`/patient/appointments/${appointment._id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
