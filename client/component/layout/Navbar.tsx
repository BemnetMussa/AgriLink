"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Left: Logo & Navigation*/}
        <div className="flex items-center gap-8">
          {/* Nav Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="font-medium text-green-600"
            >
              Home
            </Link>
            <Link
              href="/listings"
              className="text-gray-600 hover:text-green-600 transition"
            >
              Listings
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/sell"
            className="rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition"
          >
            Sell Produce
          </Link>

          <Link
            href="/listings"
            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Browse Listings
          </Link>

          <Link
            href="/login"
            className="text-gray-600 hover:text-green-600 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
