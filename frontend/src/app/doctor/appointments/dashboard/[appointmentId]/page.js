"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppointmentDashboard() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/appointments/${appointmentId}/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointment(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointment data:", err);
        setError(err.message || "Failed to load appointment data");
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading appointment data...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!appointment) {
    return <div className="text-center mt-8">Appointment not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => window.history.back()}>Back</Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const response = await axios.put(
                  `http://localhost:5000/api/appointments/${appointmentId}/complete`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                setAppointment({ ...appointment, status: "completed" });
              } catch (err) {
                setError(err.message);
              }
            }}
            disabled={appointment.status === "completed"}
          >
            {appointment.status === "completed" ? "Completed" : "Mark Complete"}
          </Button>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {appointment.patient.name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {appointment.patient.email}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(appointment.date).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Status:</span> {appointment.status}
            </p>
            <p>
              <span className="font-medium">Reason:</span>{" "}
              {appointment.reason || "Not specified"}
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Diagnosis & Notes
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "prescription"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("prescription")}
            >
              Prescription
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Diagnostic Reports
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "medicalRecord"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("medicalRecord")}
            >
              Medical Record
            </button>
          </nav>
        </div>

        {activeTab === "details" && (
          <DiagnosisTab
            appointment={appointment}
            setAppointment={setAppointment}
            appointmentId={appointmentId}
          />
        )}
        {activeTab === "prescription" && (
          <PrescriptionTab
            appointment={appointment}
            setAppointment={setAppointment}
            appointmentId={appointmentId}
          />
        )}
        {activeTab === "reports" && (
          <ReportsTab
            appointment={appointment}
            setAppointment={setAppointment}
            appointmentId={appointmentId}
          />
        )}
        {activeTab === "medicalRecord" && (
          <MedicalRecordTab
            appointment={appointment}
            setAppointment={setAppointment}
            appointmentId={appointmentId}
          />
        )}
      </div>
    </div>
  );
}

function DiagnosisTab({ appointment, setAppointment, appointmentId }) {
  const [diagnosis, setDiagnosis] = useState(appointment.diagnosis || "");
  const [notes, setNotes] = useState(appointment.notes || "");
  const [suggestedTests, setSuggestedTests] = useState(
    appointment.suggestedTests?.join("\n") || ""
  );
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/diagnosis`,
        {
          diagnosis,
          notes,
          suggestedTests: suggestedTests
            .split("\n")
            .filter((test) => test.trim() !== ""),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Preserve the patient info and other data while updating with response data
      setAppointment({
        ...appointment,
        diagnosis: response.data.diagnosis,
        notes: response.data.notes,
        suggestedTests: response.data.suggestedTests,
        // Make sure we don't lose any other updated fields from the response
        status: response.data.status || appointment.status,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Error updating diagnosis:", err);
      setError(err.message || "Failed to update diagnosis");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Diagnosis & Notes</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="diagnosis"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Diagnosis
          </label>
          <textarea
            id="diagnosis"
            className="w-full p-2 border rounded-md"
            rows="3"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes
          </label>
          <textarea
            id="notes"
            className="w-full p-2 border rounded-md"
            rows="5"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="suggestedTests"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Suggested Tests (one per line)
          </label>
          <textarea
            id="suggestedTests"
            className="w-full p-2 border rounded-md"
            rows="4"
            value={suggestedTests}
            onChange={(e) => setSuggestedTests(e.target.value)}
            placeholder="Enter each test on a new line"
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 mb-4">
            Diagnosis updated successfully
          </div>
        )}

        <Button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Save Diagnosis & Notes"}
        </Button>
      </form>
    </Card>
  );
}

function PrescriptionTab({ appointment, setAppointment, appointmentId }) {
  const [medications, setMedications] = useState(
    appointment.prescription?.medications || []
  );
  const [notes, setNotes] = useState(appointment.prescription?.notes || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = [...medications];
    newMedications.splice(index, 1);
    setMedications(newMedications);
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/appointments/${appointmentId}/prescription`,
        {
          medications,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointment({
        ...appointment,
        prescription: response.data,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Error adding prescription:", err);
      setError(err.message || "Failed to add prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Prescription</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          {medications.map((medication, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Medication #{index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveMedication(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={medication.name}
                    onChange={(e) =>
                      handleMedicationChange(index, "name", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={medication.dosage}
                    onChange={(e) =>
                      handleMedicationChange(index, "dosage", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Twice daily"
                    value={medication.frequency}
                    onChange={(e) =>
                      handleMedicationChange(index, "frequency", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 7 days"
                    value={medication.duration}
                    onChange={(e) =>
                      handleMedicationChange(index, "duration", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Take after meals"
                    value={medication.instructions}
                    onChange={(e) =>
                      handleMedicationChange(
                        index,
                        "instructions",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddMedication}
            className="mb-4"
          >
            Add Medication
          </Button>

          <div className="mb-4">
            <label
              htmlFor="prescriptionNotes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes
            </label>
            <textarea
              id="prescriptionNotes"
              className="w-full p-2 border rounded-md"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && (
            <div className="text-green-500 mb-4">
              Prescription added successfully
            </div>
          )}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Prescription"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ReportsTab({ appointment, setAppointment, appointmentId }) {
  const [reportName, setReportName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");

      // Create FormData object to send the file
      const formData = new FormData();
      formData.append("name", reportName);
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:5000/api/appointments/${appointmentId}/diagnostic-report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setAppointment(response.data);
      setReportName("");
      setFile(null);
      setSuccess(true);
    } catch (err) {
      console.error("Error uploading diagnostic report:", err);
      setError(err.message || "Failed to upload diagnostic report");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Diagnostic Reports</h2>

      {appointment.diagnosticReports &&
      appointment.diagnosticReports.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Existing Reports</h3>
          <div className="space-y-2">
            {appointment.diagnosticReports.map((report, index) => (
              <div key={index} className="p-4 border rounded-md">
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(report.uploadedAt).toLocaleDateString()}
                </p>
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Report
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-4 text-gray-500">No diagnostic reports added yet.</p>
      )}

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Add New Report</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="reportName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Report Name
            </label>
            <input
              id="reportName"
              type="text"
              className="w-full p-2 border rounded-md"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="reportFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload File
            </label>
            <input
              id="reportFile"
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={handleFileChange}
              required
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported file types: PDF, JPG, JPEG, PNG, DOC, DOCX
            </p>
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}

          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && (
            <div className="text-green-500 mb-4">
              Report uploaded successfully
            </div>
          )}

          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Report"}
          </Button>
        </form>
      </div>
    </Card>
  );
}

function MedicalRecordTab({ appointment, setAppointment, appointmentId }) {
  const [diagnosis, setDiagnosis] = useState(
    appointment.medicalRecord?.diagnosis || ""
  );
  const [notes, setNotes] = useState(appointment.medicalRecord?.notes || "");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/medical-record`,
        {
          diagnosis,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointment({
        ...appointment,
        medicalRecord: response.data,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Error updating medical record:", err);
      setError(err.message || "Failed to update medical record");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Medical Record</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="medicalDiagnosis"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Diagnosis
          </label>
          <textarea
            id="medicalDiagnosis"
            className="w-full p-2 border rounded-md"
            rows="3"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="medicalNotes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Medical Notes
          </label>
          <textarea
            id="medicalNotes"
            className="w-full p-2 border rounded-md"
            rows="6"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Include patient history, observations, and other medical information"
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 mb-4">
            Medical record updated successfully
          </div>
        )}

        <Button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Save Medical Record"}
        </Button>
      </form>
    </Card>
  );
}
