"use client";
import axios from "axios";

export default function SignUp() {
  const handlesignup = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      alert(res.data.message);
      window.location.href = "/signin"; // Redirect to login page
    } catch (error) {
      alert(error.response?.data?.error || "Error creating user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Sign Up</h1>
        <form className="flex flex-col gap-4" onSubmit={handlesignup}>
          <input
            type="text"
            placeholder="Name"
            className="border px-4 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
