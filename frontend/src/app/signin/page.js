"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login-form"; // Adjust the import path as necessary

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      console.log("Attempting to log in with:", { email, password }); // Debugging line to check input values
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      const data = response.data;
      console.log("Login response:", data); // Debugging line to check received data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("firstlogin", data.firstlogin); // Store token locally
      router.push("/loggedin"); // Redirect to the logged-in page
    } catch (err) {
      console.error("Authentication error:", err.response?.data || err); // Log error details
      alert(
        err.response?.data?.error ||
          "Authentication failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Sign In</h1>
        {error && (
          <p className="text-red-500 mb-4">
            Authentication failed. Please try again.
          </p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
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
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
