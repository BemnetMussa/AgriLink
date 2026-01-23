"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Wifi, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError(extractErrorMessage(err) || "Failed to send OTP. Please try again.");
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

        {/* Signup form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sign Up</h3>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
