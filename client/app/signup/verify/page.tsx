"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { extractErrorMessage } from "@/utils/errorHandler";

function VerifyOTPContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requestOTP, loginWithOTP } = useAuth();

  useEffect(() => {
    setMounted(true);

    const phone = searchParams.get("phone");
    if (phone) {
      setPhoneNumber(phone);
    } else {
      router.push("/signup");
    }
    
    // In development, show OTP if available
    const storedOtp = sessionStorage.getItem('dev_otp');
    if (storedOtp) {
      setDevOtp(storedOtp);
      sessionStorage.removeItem('dev_otp'); // Clear after showing
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      // Use REGISTRATION purpose to match the OTP that was requested
      await loginWithOTP(phoneNumber, otpCode, "REGISTRATION");
      router.push("/signup/profile");
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      // Check if it's a network error (backend not running)
      if (errorMessage.includes('backend server') || errorMessage.includes('Unable to connect')) {
        setError(errorMessage);
      } else {
        setError(errorMessage || "Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setTimer(60);
    setError("");
    try {
      const otpCode = await requestOTP(phoneNumber, "REGISTRATION");
      // In development, show the new OTP
      if (otpCode) {
        setDevOtp(otpCode);
      }
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      // Check if it's a network error (backend not running)
      if (errorMessage.includes('backend server') || errorMessage.includes('Unable to connect')) {
        setError(errorMessage);
      } else {
        setError(errorMessage || "Failed to resend OTP");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <div className="text-sm font-medium text-gray-700">9:41</div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            OTP Verification
          </h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        {/* Phone display */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verification code sent to</p>
              <p className="font-medium text-gray-900">+251 {phoneNumber}</p>
            </div>
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

          {/* Development OTP Display (client-only to avoid hydration mismatch) */}
          {mounted && devOtp && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-1">Development Mode - OTP Code:</p>
              <p className="text-2xl font-bold text-green-600 text-center">{devOtp}</p>
              <p className="text-xs text-green-600 mt-2 text-center">This is only shown in development</p>
            </div>
          )}

          {/* OTP Input */}
          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP Code
              </label>
              <div className="flex justify-between gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                ))}
              </div>

              {/* Timer and Resend (client-only to avoid hydration mismatch) */}
              {mounted && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">00:{timer.toString().padStart(2, '0')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={timer > 0}
                    className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-green-600 hover:underline'}`}
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>

        {/* Help text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code? Check your SMS or{" "}
            <button
              onClick={handleResendOTP}
              className="text-green-600 hover:underline"
            >
              request a new code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
