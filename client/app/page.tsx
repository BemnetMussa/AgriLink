import Image from "next/image";
import Link from "next/link";
import { Globe, WifiOff, Lock, Users, Bell, MapPin, } from "lucide-react";
import { Smartphone, Wallet, RefreshCw } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-8 sm:px-10 lg:pl-12 lg:pr-20 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* LEFT */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Connecting <br />
                Ethiopian Farmers <br />
                with Thriving <br />
                Markets
              </h1>

              <p className="mt-6 max-w-xl text-base text-gray-600 leading-relaxed">
                Agrilink Ethiopia is a secure, mobile-first marketplace empowering
                farmers with direct access to buyers, transparent pricing, and
                trusted escrow payments.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/listings"
                  className="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 transition"
                >
                  Browse Listings
                </Link>

                <Link
                  href="/listings/create"
                  className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
                >
                  Sell Your Produce
                </Link>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Multilingual support: English, Amharic, Afaan Oromoo
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
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-8 sm:px-10 lg:px-12 py-20">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
            How AgriLink Ethiopia Works
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="bg-white rounded-xl border p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg  text-gray-900 font-semibold">Register & List</h3>
              <p className="mt-3 text-sm text-gray-600">
                Farmers easily register and create listings with OTP login, even
                offline.
              </p>
            </div>

            <div className="bg-white rounded-xl border p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg  text-gray-900 font-semibold">Secure Payments</h3>
              <p className="mt-3 text-sm text-gray-600">
                Buyers pay securely via Telebirr into an escrow.
              </p>
            </div>

            <div className="bg-white rounded-xl border p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg  text-gray-900 font-semibold">Transparent Trade</h3>
              <p className="mt-3 text-sm text-gray-600">
                Funds are released upon verified delivery.
              </p>
            </div>

          </div>
        </div>
      </section>
      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-8 sm:px-10 lg:px-12 py-24">

          {/* Title */}
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
            Features Designed for Your Success
          </h2>

          {/* Feature Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Card 1 */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Multilingual Interface
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Access Agrilink in Amharic, Afaan Oromoo, and English for inclusive
                trade.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <WifiOff className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Offline-First Design
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Continue creating listings and viewing information even with limited
                internet.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <Lock className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Secure Escrow Payments
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Built-in Telebirr escrow ensures your transactions are safe and
                verified.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Direct Farmer–Buyer Connection
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Eliminate intermediaries and get fair prices for your produce
                directly.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <Bell className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Real-time Notifications
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Stay updated on new listings, offers, and payment statuses instantly.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Location-Based Listings
              </h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Easily find and sell produce within your preferred geographic
                regions.
              </p>
            </div>

          </div>
        </div>
      </section>

    </>

  );
}
