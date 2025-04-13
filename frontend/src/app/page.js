"use client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-100 mb-6">Welcome to Curalink</h1>
                <div className="flex gap-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        onClick={() => router.push("/signin")}
                    >
                        Login
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        onClick={() => router.push("/signup")}
                    >
                        Signup
                    </button>
                </div>
            </div>
        </div>
    );
}
