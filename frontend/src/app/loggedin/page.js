'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoggedInPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [personal_details, setPersonalDetails] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token'); 
            console.log(token); // Retrieve token from localStorage
            if (!token) {
                router.push('/signin'); // Redirect to sign-in if no token
                return;
            }

            try {
                const userId = localStorage.getItem('userId'); 
                console.log(userId);// Retrieve userId from localStorage
                if (!userId) {
                    router.push('/signin'); // Redirect to sign-in if no userId
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                console.log(response.data); // Log user data

                

                let fl = localStorage.getItem('firstlogin');
                if (fl === 'true') {
                    console.log("You need to set your role first");
                
                    await axios.put(
                        `http://localhost:5000/api/users/${userId}`,
                        { firstlogin: false },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                
                    localStorage.setItem('firstlogin', 'false');
                
                    router.push('/setrole');
                    return; // Prevent further code execution
                }


                const user_role = response.data.role
                setRole(user_role) // Log role
                 // Set role from user data
                console.log("Role", user_role); 
                const personalDetailsResponse = await axios.get(`http://localhost:5000/api/${user_role}-profiles/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }, 
                });
                setPersonalDetails(personalDetailsResponse.data); 
                console.log(personalDetailsResponse.data); // Log personal details
                 // Retrieve first login status from localStorage
                

                // Check if it's the first login
                // const isFirstLogin = localStorage.getItem('firstlogin') === null;
                // if (isFirstLogin) {
                //     localStorage.setItem('firstlogin', 'false'); // Mark first login as handled
                // }
            } catch (err) {
                console.error('Failed to fetch user details:', err);
                router.push('/signin'); // Redirect to sign-in on error
            }
        };

        fetchUserDetails();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        localStorage.removeItem('userId');
        localStorage.removeItem('firstlogin'); // Clear userId
        router.push('/signin'); // Redirect to sign-in
    };

    const handleAppointmentsRedirect = () => {
        router.push('/doctor/appointments'); // Redirect to appointments page
    };

    if (!user) {
        return <p className="text-center text-gray-400 mt-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-100 mb-4">Welcome to the Dashboard</h1>
                <p className="text-gray-400 mb-6">You have successfully logged in.</p>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">User Details:</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Personal Details:</h2>
                    {role === 'doctor' && personal_details && (
                        <div className="space-y-2">
                            <p><strong>Specialization:</strong> {personal_details.specialization}</p>
                            <p><strong>Qualifications:</strong> {personal_details.qualifications.join(', ')}</p>
                            <p><strong>Experience (Years):</strong> {personal_details.experienceYears}</p>
                            <p><strong>Phone:</strong> {personal_details.phone}</p>
                            <p><strong>Gender:</strong> {personal_details.gender}</p>
                            <p><strong>Bio:</strong> {personal_details.bio}</p>
                        </div>
                    )}
                    {role === 'patient' && personal_details && (
                        <div className="space-y-2">
                            <p><strong>Age:</strong> {personal_details.age}</p>
                            <p><strong>Gender:</strong> {personal_details.gender}</p>
                            <p><strong>Phone:</strong> {personal_details.phone}</p>
                            <p><strong>Address:</strong> {personal_details.address}</p>
                            <p><strong>Blood Group:</strong> {personal_details.bloodGroup}</p>
                            <p><strong>Allergies:</strong> {personal_details.allergies.join(', ')}</p>
                            <p><strong>Emergency Contact:</strong></p>
                            <ul className="list-disc list-inside">
                                <li><strong>Name:</strong> {personal_details.emergencyContact.name}</li>
                                <li><strong>Phone:</strong> {personal_details.emergencyContact.phone}</li>
                                <li><strong>Relation:</strong> {personal_details.emergencyContact.relation}</li>
                            </ul>
                        </div>
                    )}
                    {role === 'pharmacist' && personal_details && (
                        <div className="space-y-2">
                            <p><strong>Pharmacy Name:</strong> {personal_details.pharmacyName}</p>
                            <p><strong>Phone:</strong> {personal_details.phone}</p>
                            <p><strong>License Number:</strong> {personal_details.licenseNumber}</p>
                        </div>
                    )}
                </div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => router.push('/doctor/appointments')} 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Appointments
                    </button>
                    <button 
                        onClick={() => router.push('/doctor/availability')} 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Availability
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}