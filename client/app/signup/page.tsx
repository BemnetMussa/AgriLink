"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Wifi, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function SignupPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState("english");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { requestOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (phoneNumber.length !== 9) {
      setError("Please enter a valid 9-digit phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      const otpCode = await requestOTP(phoneNumber, "REGISTRATION");
      // In development, OTP is returned - store it for display
      if (otpCode) {
        sessionStorage.setItem('dev_otp', otpCode);
      }
      router.push(`/signup/verify?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      // Ensure we show the error message to the user
      if (errorMessage.includes('backend server') || errorMessage.includes('Unable to connect')) {
        setError(errorMessage);
      } else {
        setError(errorMessage || "Failed to send OTP. Please try again.");
      }
      // Don't log to console in production to reduce noise
      if (process.env.NODE_ENV === 'development') {
        console.error('OTP request error:', err);
      }
    } finally {
      setIsLoading(false);
    }
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
            Onboarding & Registration
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
              Enter your mobile number to get started.
            </p>
          </div>
        </div>

        {/* Phone input form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Mobile Number</h3>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800">Error</p>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                  {error.includes('backend server') && (
                    <div className="mt-3 rounded-lg bg-red-100 p-3">
                      <p className="text-xs font-medium text-red-800 mb-2">To fix this:</p>
                      <ol className="text-xs text-red-700 space-y-1 list-decimal list-inside">
                        <li>Open a terminal/command prompt</li>
                        <li>Navigate to the <code className="bg-red-200 px-1 rounded">server</code> folder</li>
                        <li>Run <code className="bg-red-200 px-1 rounded">npm run dev</code></li>
                        <li>Wait for the server to start (you should see "Server running on port 5000")</li>
                        <li>Then try again</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                <div className="px-4 py-3 bg-gray-50 border-r border-gray-300">
                  <span className="text-gray-700 font-medium">+251</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 9) {
                      setPhoneNumber(value);
                      setError("");
                    }
                  }}
                  placeholder="9XXXXXXXX"
                  className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
                  required
                  pattern="[0-9]{9}"
                  title="Enter 9-digit Ethiopian phone number (without +251)"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter your 9-digit Ethiopian mobile number
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || phoneNumber.length !== 9}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending OTP..." : "Get Started"}
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
