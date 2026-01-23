"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { extractErrorMessage } from "@/utils/errorHandler";

function LoginContent() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, requestOTP, loginWithOTP } = useAuth();

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get("registered") === "true") {
      setShowSuccess(true);
      // Remove the query parameter from URL
      router.replace("/login", { scroll: false });
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (useOTP) {
        // Request OTP first
        await requestOTP(phoneNumber, "LOGIN");
        const code = prompt("Enter the 6-digit OTP sent to your phone:");
        if (code && code.length === 6) {
          await loginWithOTP(phoneNumber, code);
        } else {
          setError("Invalid OTP");
          setIsLoading(false);
          return;
        }
      } else {
        if (!password) {
          setError("Password is required");
          setIsLoading(false);
          return;
        }
        await login(phoneNumber, password);
      }
      router.push("/listings");
    } catch (err: any) {
      setError(extractErrorMessage(err) || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full text-gray-900 max-w-md rounded-xl bg-white p-8 shadow-sm border">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Login to your AgriLink account
          </p>
        </div>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">Registration Successful!</p>
                <p className="text-xs text-green-700 mt-1">
                  Your account has been created successfully. Please login to access the system.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <div className="px-3 py-2 bg-gray-50 border-r border-gray-300">
                <span className="text-gray-700 text-sm">+251</span>
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
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
                required
                pattern="[0-9]{9}"
              />
            </div>
          </div>

          {/* Password / OTP */}
          {!useOTP && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Toggle OTP/Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={useOTP}
                onChange={(e) => setUseOTP(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span>Use OTP instead</span>
            </label>
            {!useOTP && (
              <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || phoneNumber.length !== 9}
            className="w-full rounded-md bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-green-600 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full text-gray-900 max-w-md rounded-xl bg-white p-8 shadow-sm border">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    }>
      <LoginContent />
    </Suspense>
  );
}
