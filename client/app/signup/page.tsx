"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Wifi, Mail, User, Lock } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("english");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Send signup details to backend
    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white bg-gradient-to-b from-green-50 to-white px-4 py-8">
      {/* Header with time & language */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-500" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="english">English</option>
              <option value="amharic">አማርኛ</option>
              <option value="oromo">Afaan Oromoo</option>
            </select>
          </div>
        </div>

        {/* Welcome section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Wifi size={16} />
            <span className="text-sm">Your direct link to Ethiopian agriculture.</span>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Connect Farmers & Buyers
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Agrilink connects you directly with farmers and buyers across Ethiopia for fresh produce.
            </p>
            
            <p className="text-gray-600 text-sm mb-4">
              Sign up with your email, full name, and password.
            </p>
          </div>
        </div>

        {/* Signup form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sign Up</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                <div className="px-4 py-3 bg-gray-50 border-r border-gray-300">
                  <User size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                <div className="px-4 py-3 bg-gray-50 border-r border-gray-300">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                <div className="px-4 py-3 bg-gray-50 border-r border-gray-300">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Use at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !fullName || !email || password.length < 6}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Terms & Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Already have account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}