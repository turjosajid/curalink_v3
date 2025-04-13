'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const PatientDetailsPage = () => {
    const [patientDetails, setPatientDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const patientId = searchParams.get("patientId");

    useEffect(() => {
        if (!patientId) return;

        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/patient-profiles/${patientId}`
                );
                setPatientDetails(response.data);
            } catch (error) {
                console.error("Error fetching patient details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center text-lg font-medium">Loading...</div>;
    }

    if (!patientDetails) {
        return <div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center text-lg font-medium">Patient details not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            <div className="max-w-5xl mx-auto bg-gray-800 shadow-md rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-gray-100 mb-6 border-b border-gray-700 pb-4">Patient Details</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Name:</span> {patientDetails.user.name}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Age:</span> {patientDetails.age}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Gender:</span> {patientDetails.gender}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Phone:</span> {patientDetails.phone}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Address:</span> {patientDetails.address}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Blood Group:</span> {patientDetails.bloodGroup}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Allergies:</span> {patientDetails.allergies.join(", ")}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-100">Emergency Contact</h2>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Name:</span> {patientDetails.emergencyContact.name}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Phone:</span> {patientDetails.emergencyContact.phone}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Relation:</span> {patientDetails.emergencyContact.relation}
                        </p>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Diagnostic Reports</h2>
                    <ul className="list-disc list-inside space-y-2">
                        {patientDetails.diagnosticReports.map((report, index) => (
                            <li key={index} className="hover:text-blue-400">
                                <a
                                    href={report.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {report.fileName}
                                </a>{" "}
                                <span className="text-gray-400">(Uploaded at: {new Date(report.uploadedAt).toLocaleString()})</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Medical Records</h2>
                    <ul className="list-disc list-inside space-y-2">
                        {patientDetails.medicalRecords.map((record, index) => (
                            <li key={index} className="hover:text-blue-400">
                                <a
                                    href={record.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {record.fileName}
                                </a>{" "}
                                <span className="text-gray-400">(Uploaded at: {new Date(record.uploadedAt).toLocaleString()})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsPage;