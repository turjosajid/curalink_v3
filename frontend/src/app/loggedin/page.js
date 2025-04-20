"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoggedInPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [personal_details, setPersonalDetails] = useState(null);
  const [role, setRole] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/signin");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);

        let fl = localStorage.getItem("firstlogin");
        if (fl === "true") {
          console.log("You need to set your role first");

          await axios.put(
            `http://localhost:5000/api/users/${userId}`,
            { firstlogin: false },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          localStorage.setItem("firstlogin", "false");
          router.push("/setrole");
          return;
        }

        const user_role = response.data.role;
        setRole(user_role);

        const personalDetailsResponse = await axios.get(
          `http://localhost:5000/api/${user_role}-profiles/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPersonalDetails(personalDetailsResponse.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        router.push("/signin");
      }
    };

    fetchUserDetails();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstlogin");
    router.push("/signin");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500/30 rounded-full mb-4 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xl text-blue-200">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Define role-specific actions and icons
  const roleActions = {
    doctor: [
      {
        title: "My Patients",
        path: "/doctor/patients",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
      {
        title: "Schedule Appointment",
        path: "/doctor/schedule_appointment",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ),
      },
      {
        title: "Upcoming Appointments",
        path: "/doctor/appointments",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },

      {
        title: "Past Appointments",
        path: "/doctor/past_consultations",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: "Availability",
        path: "/doctor/availability",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ],
    patient: [
      {
        title: "Find Doctors",
        path: "/patient/find-doctors",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        ),
      },
      {
        title: "My Appointments",
        path: "/patient/appointments",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        title: "Medical Records",
        path: "/patient/medical-records",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
      {
        title: "Past Appointments",
        path: "/patient/past_appointments",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: "Lab Reports",
        path: "/patient/lab-reports",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        ),
      },
      {
        title: "Prescriptions",
        path: "/patient/prescriptions",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
      },
      {
        title: "Pharmacies",
        path: "/patient/pharmacies",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
      },
      {
        title: "Medication History",
        path: "/patient/medication-history",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
            />
          </svg>
        ),
      },
    ],
    pharmacist: [
      {
        title: "Prescriptions",
        path: "/pharmacist/prescriptions",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
      },
      {
        title: "Inventory",
        path: "/pharmacist/inventory",
        icon: (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div
        className={`px-6 py-10 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with welcome message */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">
              Welcome, <span className="text-blue-500">{user.name}</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-500/10 transform transition-all hover:border-blue-500/30 hover:shadow-blue-500/5">
              <div className="relative h-32 bg-gradient-to-r from-blue-900 to-blue-700">
                <div className="absolute inset-0 opacity-20">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,0 L100,0 L100,100 L0,100 Z"
                      fill="url(#header-gradient)"
                      fillOpacity="0.4"
                    />
                    <defs>
                      <linearGradient
                        id="header-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E3A8A" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-gray-800 flex items-center justify-center text-white">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-16 px-6 pb-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-400 mb-4">{user.email}</p>
                <div className="inline-block px-3 py-1 rounded-full bg-blue-900/40 text-blue-400 text-sm font-medium mb-6">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>

                <div className="border-t border-gray-700 pt-4 mt-2">
                  <h3 className="text-lg font-semibold text-blue-200 mb-3">
                    About Me
                  </h3>

                  {role === "doctor" && personal_details && (
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">
                          Specialization:
                        </span>
                        <span>{personal_details.specialization}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Experience:</span>
                        <span>{personal_details.experienceYears} years</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Phone:</span>
                        <span>{personal_details.phone}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Gender:</span>
                        <span>{personal_details.gender}</span>
                      </p>
                    </div>
                  )}

                  {role === "patient" && personal_details && (
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Age:</span>
                        <span>{personal_details.age}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Gender:</span>
                        <span>{personal_details.gender}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Phone:</span>
                        <span>{personal_details.phone}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Blood Group:</span>
                        <span>{personal_details.bloodGroup}</span>
                      </p>
                    </div>
                  )}

                  {role === "pharmacist" && personal_details && (
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Pharmacy:</span>
                        <span>{personal_details.pharmacyName}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">Phone:</span>
                        <span>{personal_details.phone}</span>
                      </p>
                      <p className="flex items-center text-gray-300">
                        <span className="w-36 text-gray-500">License:</span>
                        <span>{personal_details.licenseNumber}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dashboard Actions */}
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-500/10 p-6 h-full">
                <h2 className="text-2xl font-bold text-blue-300 mb-6">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {role &&
                    roleActions[role]?.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => router.push(action.path)}
                        className="flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all border border-blue-500/10 hover:border-blue-500/30 hover:shadow-lg group"
                      >
                        <div className="mr-4 p-2 bg-blue-900/30 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {action.icon}
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-200 font-medium">
                          {action.title}
                        </span>
                      </button>
                    ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center p-4 bg-gray-800 hover:bg-red-900/30 rounded-xl transition-all border border-red-500/10 hover:border-red-500/30 group"
                  >
                    <div className="mr-4 p-2 bg-red-900/30 text-red-400 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 group-hover:text-red-200 font-medium">
                      Logout
                    </span>
                  </button>
                </div>

                {/* Additional information section */}
                {role === "doctor" && personal_details && (
                  <div className="mt-8 p-5 bg-blue-900/20 rounded-xl border border-blue-500/10">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">
                      Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-2">
                          Qualifications
                        </h4>
                        <ul className="list-disc list-inside text-gray-300 ml-2 space-y-1">
                          {personal_details.qualifications.map((qual, idx) => (
                            <li key={idx}>{qual}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-2">
                          Bio
                        </h4>
                        <p className="text-gray-300">{personal_details.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {role === "patient" && personal_details && (
                  <div className="mt-8 p-5 bg-blue-900/20 rounded-xl border border-blue-500/10">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">
                      Health Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-2">
                          Allergies
                        </h4>
                        <ul className="list-disc list-inside text-gray-300 ml-2 space-y-1">
                          {personal_details.allergies.length > 0 ? (
                            personal_details.allergies.map((allergy, idx) => (
                              <li key={idx}>{allergy}</li>
                            ))
                          ) : (
                            <li>No known allergies</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-400 text-sm font-medium mb-2">
                          Emergency Contact
                        </h4>
                        <div className="text-gray-300 space-y-1">
                          <p>
                            <span className="text-gray-500">Name:</span>{" "}
                            {personal_details.emergencyContact.name}
                          </p>
                          <p>
                            <span className="text-gray-500">Phone:</span>{" "}
                            {personal_details.emergencyContact.phone}
                          </p>
                          <p>
                            <span className="text-gray-500">Relation:</span>{" "}
                            {personal_details.emergencyContact.relation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
