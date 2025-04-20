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
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-blue-500/30">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Sign Up</h1>
        <form className="flex flex-col gap-4" onSubmit={handlesignup}>
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-700 bg-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-700 bg-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-700 bg-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:text-blue-400">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
