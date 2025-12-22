"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Smartphone } from "lucide-react";
import Link from "next/link";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (phone) {
      setPhoneNumber(phone);
    } else {
      router.push("/onboarding/signup");
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
    
    // TODO: Verify OTP with backend
    setTimeout(() => {
      setIsLoading(false);
      const otpCode = otp.join("");
      if (otpCode.length === 6) {
        router.push("/onboarding/signup/profile");
      }
    }, 1000);
  };

  const handleResendOTP = () => {
    setTimer(60);
    // TODO: Resend OTP
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
              
              {/* Timer and Resend */}
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