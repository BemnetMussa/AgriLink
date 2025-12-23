"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isListings = pathname === "/listings";

  return (
    <header className="w-full border-b bg-white px-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-4">

        {/* Left: Logo & Navigation*/}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className={`font-medium transition ${isHome ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"}`}
            >
              Home
            </Link>
            <Link
              href="/listings"
              className={`font-medium transition ${isListings ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"}`}
            >
              Listings
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-5 text-sm ml-auto">
          <Link
            href="/"
            className={`rounded-md px-4 py-2 font-medium transition ${isHome
              ? "bg-green-600 text-white hover:bg-green-700"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm"
              }`}
          >
            Sell Produce
          </Link>

          <Link
            href="/listings"
            className={`rounded-md px-4 py-2 font-medium transition ${isListings
              ? "bg-green-600 text-white hover:bg-green-700"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm"
              }`}
          >
            Browse Listings
          </Link>

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
