"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export default function PrescriptionPage({ params }) {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchPrescription = async () => {
      try {

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }


        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/prescriptions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPrescription(response.data);
        

        if (response.data.doctor) {
          const doctorResponse = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
            }/api/users/${response.data.doctor}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setDoctorName(doctorResponse.data.name);
        }
        
        if (response.data.patient) {
          const patientResponse = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
            }/api/users/${response.data.patient}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPatientName(patientResponse.data.name);
        }
      } catch (err) {
        console.error("Error fetching prescription:", err);
        setError("Failed to load prescription details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrescription();
    }
  }, [id, router]);

  const downloadPrescription = () => {
    try {
      const doc = new jsPDF();
      

      doc.setFontSize(20);
      doc.setTextColor(0, 0, 128);
      doc.text("Medical Prescription", 105, 20, { align: "center" });
      
      // Add CuraLink logo/header
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185);
      doc.text("CuraLink", 105, 15, { align: "center" });
      
      // Add line
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Add prescription info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 20, 35);
      doc.text(`Patient: ${patientName}`, 20, 45);
      doc.text(`Doctor: ${doctorName}`, 20, 55);
      
      // Add medications table
      const tableColumn = ["Medication", "Dosage", "Frequency", "Duration", "Instructions"];
      const tableRows = [];
      
      prescription.medications.forEach((med) => {
        const medData = [
          med.name,
          med.dosage,
          med.frequency,
          med.duration,
          med.instructions
        ];
        tableRows.push(medData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      // Add notes if any
      if (prescription.notes) {
        const finalY = doc.lastAutoTable.finalY || 65;
        doc.text("Notes:", 20, finalY + 10);
        doc.setFontSize(10);
        
        const splitNotes = doc.splitTextToSize(prescription.notes, 170);
        doc.text(splitNotes, 20, finalY + 20);
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`CuraLink Healthcare - Prescription #${prescription._id.substring(0, 8)}`, 105, 290, { align: "center" });
      }
      
      // Save the PDF
      doc.save(`Prescription-${prescription._id.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to download prescription. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading prescription details...</p>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Prescription Details</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p>Error: {error || "Prescription not found"}</p>
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
        <h1 className="text-3xl font-bold">Prescription Details</h1>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>

      <Card className="overflow-hidden mb-6">
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Prescription Information</h2>
            <p className="text-sm">
              {new Date(prescription.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-500 text-sm">Patient</p>
              <p className="font-medium">{patientName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Doctor</p>
              <p className="font-medium">{doctorName}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Medications</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left border-b">Medication</th>
                    <th className="py-3 px-4 text-left border-b">Dosage</th>
                    <th className="py-3 px-4 text-left border-b">Frequency</th>
                    <th className="py-3 px-4 text-left border-b">Duration</th>
                    <th className="py-3 px-4 text-left border-b">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medications.map((med, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-3 px-4 border-b">{med.name}</td>
                      <td className="py-3 px-4 border-b">{med.dosage}</td>
                      <td className="py-3 px-4 border-b">{med.frequency}</td>
                      <td className="py-3 px-4 border-b">{med.duration}</td>
                      <td className="py-3 px-4 border-b">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {prescription.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {prescription.notes}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={downloadPrescription}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Download Prescription
        </Button>
      </div>
    </div>
  );
}
