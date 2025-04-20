"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-gray-800 text-gray-200 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Welcome to Curalink!
        </h1>
        <p className="text-lg text-gray-100 mb-8">
          Your one-stop solution for seamless healthcare management. Join us to
          experience the future of healthcare.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => router.push("/signin")}
          >
            Login
          </button>
          <button
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => router.push("/signup")}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
