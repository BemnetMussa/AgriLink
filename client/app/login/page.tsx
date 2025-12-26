"use client";

import Link from "next/link";

export default function LoginPage() {
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

        {/* Form */}
        <form className="space-y-4">
          
          {/* Phone / Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number or Email
            </label>
            <input
              type="text"
              placeholder="Enter phone or email"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Password / OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password / OTP
            </label>
            <input
              type="password"
              placeholder="Enter password or OTP"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
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
