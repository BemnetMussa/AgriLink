"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname: string = "/"; // Demo
  const isAuthenticated = true; // Demo
  const user = { firstName: "Abebe", lastName: "Kebede", email: "abebe@example.com", role: "FARMER" };
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isListings = pathname === "/listings";
  const isSell = pathname === "/listings/create";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    console.log("Logout");
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    console.log("Profile");
    setShowProfileMenu(false);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12 py-4">

        {/* Left: Logo */}
        <a href="/" className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-green-600">Agri</span>Link
        </a>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-10">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className={`text-sm font-semibold transition-colors ${
                isHome 
                  ? "text-green-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </a>
            <a
              href="/listings"
              className={`text-sm font-semibold transition-colors ${
                isListings 
                  ? "text-green-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Listings
            </a>
            {isAuthenticated && user?.role === 'FARMER' && (
              <a
                href="/listings/create"
                className={`font-medium transition pb-1 border-b-2 ${isSell ? "text-green-600 border-green-600 font-semibold" : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-200"}`}
              >
                Sell Produce
              </a>
            )}
          </div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3.5 py-2 text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-center justify-center rounded-full bg-green-600 text-white w-8 h-8 text-sm font-semibold">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">
                  {user?.firstName || "User"}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-xl border border-gray-200 py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">{user?.email}</p>
                    <span className="inline-block mt-2.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-green-50 text-green-700 border border-green-200">
                      {user?.role || "USER"}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                Login
              </a>

              <a
                href="/signup"
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}