"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join AgriLink and start trading securely
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. +2519XXXXXXXX"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* User Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            >
              <option value="">Select role</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
