"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SetDetails() {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    const { specialization, qualifications, experienceYears, phone, gender, bio } = formObject;

    try {
      await axios.post(
        `http://localhost:5000/api/doctor-profiles/`,
        {
          user: userId,
          specialization,
          qualification: qualifications.split(",").map((q) => q.trim()),
          experienceYears: parseInt(experienceYears, 10),
          phone,
          gender,
          bio,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Doctor details updated successfully!");
      router.push("/loggedin");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update doctor details");
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    const { age, gender, phone, address, bloodGroup, allergies, emergencyName, emergencyPhone, emergencyRelation } = formObject;

    try {
      await axios.post(
        `http://localhost:5000/api/patient-profiles/`,
        {
          user: userId,
          age: parseInt(age, 10),
          gender,
          phone,
          address,
          bloodGroup,
          allergies: allergies.split(",").map((a) => a.trim()),
          emergencyContact: {
            name: emergencyName,
            phone: emergencyPhone,
            relation: emergencyRelation,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Patient details updated successfully!");
      router.push("/loggedin");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update patient details");
    }
  };

  const handlePharmacistSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    const { pharmacyName, phone, licenseNumber } = formObject;

    try {
      await axios.post(
        `http://localhost:5000/api/pharmacist-profiles/`,
        {
          user: userId,
          pharmacyName,
          phone,
          licenseNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Pharmacist details updated successfully!");
      router.push("/loggedin");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update pharmacist details");
    }
  };

  if (!role) return <p className="text-center text-gray-400 mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-100 mb-6 border-b border-gray-700 pb-4">Set {role} Details</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={
            role === "doctor"
              ? handleDoctorSubmit
              : role === "patient"
              ? handlePatientSubmit
              : handlePharmacistSubmit
          }
        >
          {role === "doctor" && (
            <>
              <input type="text" name="specialization" placeholder="Specialization" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="qualifications" placeholder="Qualifications (comma-separated)" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" name="experienceYears" placeholder="Years of Experience" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="phone" placeholder="Phone" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="gender" placeholder="Gender" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea name="bio" placeholder="Bio" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </>
          )}
          {role === "patient" && (
            <>
              <input type="number" name="age" placeholder="Age" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="gender" placeholder="Gender" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="phone" placeholder="Phone" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="address" placeholder="Address" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="bloodGroup" placeholder="Blood Group" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="allergies" placeholder="Allergies (comma-separated)" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <h3 className="text-lg font-semibold text-gray-100">Emergency Contact</h3>
              <input type="text" name="emergencyName" placeholder="Name" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="emergencyPhone" placeholder="Phone" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="emergencyRelation" placeholder="Relation" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </>
          )}
          {role === "pharmacist" && (
            <>
              <input type="text" name="pharmacyName" placeholder="Pharmacy Name" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="phone" placeholder="Phone" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="licenseNumber" placeholder="License Number" className="bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
