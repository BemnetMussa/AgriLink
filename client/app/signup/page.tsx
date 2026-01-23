"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Wifi, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
      await requestOTP(phoneNumber, "REGISTRATION");
      router.push(`/signup/verify?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
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
