"use client";


import { Globe, WifiOff, Lock, Users, Bell, MapPin, Smartphone, Wallet, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const isAuthenticated = true; 
  const user = { firstName: "Abebe", lastName: "Kebede", role: "FARMER" };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Connecting
                <br />
                <span className="text-green-600">Ethiopian Farmers</span>
                <br />
                with Thriving Markets
              </h1>

              <p className="mt-8 text-lg text-gray-600 leading-relaxed max-w-xl">
                A secure, mobile-first marketplace empowering farmers with direct access to buyers, transparent pricing, and trusted escrow payments.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button className="rounded-lg bg-green-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-green-700 transition-colors shadow-sm">
                  Browse Listings
                </button>

                {isAuthenticated ? (
                  user?.role === 'FARMER' ? (
                    <Link
                      href="/listings/create"
                      className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
                    >
                      Sell Your Produce
                    </Link>
                  ) : null
                ) : (
                  <button className="rounded-lg border-2 border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                    Get Started
                  </button>
                )}
              </div>

              {/* {isAuthenticated && user && (
                <div className="mt-8 px-5 py-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-900 leading-relaxed">
                    Welcome back, <span className="font-semibold">{user.firstName} {user.lastName}</span>! You're all set to buy and sell on AgriLink.
                  </p>
                </div>
              )} */}

              <p className="mt-8 text-sm font-medium text-gray-500">
                Available in English • Amharic • Afaan Oromoo
              </p>
            </div>

            {/* RIGHT IMAGE */}
               <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/farmer.png"
                alt="Ethiopian farmer holding fresh produce"
                fill
                priority
                className="object-cover rounded-2xl"
              />
      
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              How AgriLink Works
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Three simple steps to connect farmers with buyers
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                <Smartphone className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Register & List</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Farmers easily register and create listings with OTP login, even offline.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                <Wallet className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Secure Payments</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Buyers pay securely via Telebirr into an escrow account.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                <RefreshCw className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Verified Delivery</h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Funds are released upon confirmed delivery and quality check.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20">

          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Built for Ethiopian Agriculture
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Features designed to empower farmers and streamline trade
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Multilingual Support
              </h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Access AgriLink in Amharic, Afaan Oromoo, and English for truly inclusive trade.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <WifiOff className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Offline-First Design
              </h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Create listings and view information even with limited internet connectivity.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Secure Escrow System
              </h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Built-in Telebirr escrow ensures your transactions are safe and verified.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Direct Connections
              </h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Eliminate middlemen and get fair prices by connecting directly with buyers.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Instant Notifications
              </h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Stay updated on new listings, offers, and payment statuses in real-time.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Location-Based Search
              </h3>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Find and sell produce within your preferred geographic regions easily.
              </p>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}