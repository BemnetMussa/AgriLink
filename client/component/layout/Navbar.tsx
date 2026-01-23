"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isListings = pathname === "/listings";
  const isSell = pathname === "/listings/create";
  const isAdmin = pathname === "/admin";

  return (
    <header className="w-full border-b bg-white px-4 sm:px-6 lg:px-8 shadow-sm relative z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-4">

        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold text-green-600 tracking-tight flex items-center gap-2">
          <span className="bg-green-600 text-white p-1 rounded-lg">Agri</span>Link
        </Link>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-8 text-sm ml-auto">
          <div className="flex items-center gap-8 mr-4">
            <Link
              href="/"
              className={`font-medium transition pb-1 border-b-2 ${isHome ? "text-green-600 border-green-600 font-semibold" : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-200"}`}
            >
              Home
            </Link>
            <Link
              href="/listings"
              className={`font-medium transition pb-1 border-b-2 ${isListings ? "text-green-600 border-green-600 font-semibold" : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-200"}`}
            >
              Listings
            </Link>
            <Link
              href="/listings/create"
              className={`font-medium transition pb-1 border-b-2 ${isSell ? "text-green-600 border-green-600 font-semibold" : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-200"}`}
            >
              Sell Produce
            </Link>
            <Link
              href="/admin"
              className={`font-medium transition pb-1 border-b-2 ${isAdmin ? "text-green-600 border-green-600 font-semibold" : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-200"}`}
            >
              Admin Dashboard
            </Link>
          </div>

          {!isListings ? (
            <div className="flex items-center gap-4 ml-2">
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 transition font-medium"
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
          ) : (
            <div className="ml-2 pl-2 border-l border-gray-200">
              <button className="flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition ring-2 ring-transparent hover:ring-green-100">
                <User className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
