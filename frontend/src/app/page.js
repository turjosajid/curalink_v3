"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <div
        className={`px-6 pt-20 pb-16 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold text-blue-200 mb-6 leading-tight">
                Healthcare Made <span className="text-blue-500">Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 mb-8">
                Your one-stop solution for seamless healthcare management.
                Experience the future of healthcare with Curalink.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={() => router.push("/signin")}
                >
                  Get Started
                </button>
                <button
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-blue-400 font-bold rounded-full border-2 border-blue-500 transition-all hover:shadow-md"
                  onClick={() => router.push("/signup")}
                >
                  Create Account
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative h-64 md:h-96 w-full">
                <div className="absolute inset-0 bg-blue-800 rounded-2xl overflow-hidden shadow-2xl transform rotate-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-3/4 h-3/4 text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path>
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-900 rounded-2xl overflow-hidden shadow-2xl transform -rotate-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-3/4 h-3/4 text-blue-800"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5.5 7c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-2 6h-2v-2h2v2zm0-4h-2V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z"></path>
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-3/4 h-3/4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.5 3h-15A2.5 2.5 0 002 5.5v13A2.5 2.5 0 004.5 21h15a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0019.5 3zM12 17.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 9c-1.93 0-3.5 1.57-3.5 3.5S10.07 16 12 16s3.5-1.57 3.5-3.5S13.93 9 12 9z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4">
              Why Choose Curalink?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform offers a comprehensive approach to healthcare
              management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Appointments",
                description:
                  "Schedule appointments with doctors seamlessly with our intuitive interface.",
                icon: (
                  <svg
                    className="w-12 h-12 text-blue-500 mb-4"
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
                title: "Secure Records",
                description:
                  "Your medical records are securely stored and accessible whenever needed.",
                icon: (
                  <svg
                    className="w-12 h-12 text-blue-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
              {
                title: "Digital Prescriptions",
                description:
                  "Get your prescriptions digitally and have them fulfilled at your preferred pharmacy.",
                icon: (
                  <svg
                    className="w-12 h-12 text-blue-500 mb-4"
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
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-500/20"
              >
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-blue-300 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your healthcare experience?
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their healthcare journey
            with Curalink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-blue-300 font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => router.push("/signin")}
            >
              Start Now
            </button>
            <button
              className="px-8 py-4 bg-transparent hover:bg-blue-800 text-white font-bold rounded-full border-2 border-white transition-all hover:shadow-md"
              onClick={() => router.push("/signup")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Curalink. All rights reserved.
          </p>
          <div className="flex justify-center mt-4 space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-500">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
