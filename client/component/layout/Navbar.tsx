"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
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
    try {
      await logout();
      router.push("/");
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setShowProfileMenu(false);
  };

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
            {isAuthenticated && user?.role === 'FARMER' && (
              <Link
                href="/listings/create"
                className={`font-medium transition pb-1 border-b-2 ${isSell ? "text-green-600 border-green-600 font-semibold" : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-200"}`}
              >
                Sell Produce
              </Link>
            )}
          </div>

          {isAuthenticated ? (
            <div className="ml-2 pl-2 border-l border-gray-200 relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 transition ring-2 ring-transparent hover:ring-green-100"
              >
                <div className="flex items-center justify-center rounded-full bg-green-600 text-white w-7 h-7 text-xs font-semibold">
                  {user?.firstName?.[0]?.toUpperCase() || user?.lastName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.firstName || "User"}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showProfileMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email || user?.phoneNumber}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                      {user?.role || "USER"}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </nav>
    </header>
  );
}
