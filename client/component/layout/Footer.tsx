"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t px-8 sm:px-10 lg:px-12">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand & Description */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Agrilink Ethiopia connects Ethiopian farmers with buyers,
            emphasizing secure, offline-first transactions.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-gray-500">
            <Link href="#" className="hover:text-green-600 transition">
              <FaFacebookF />
            </Link>
            <Link href="#" className="hover:text-green-600 transition">
              <FaTwitter />
            </Link>
            <Link href="#" className="hover:text-green-600 transition">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:text-green-600 transition">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Company
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link href="/about" className="hover:text-green-600">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-green-600">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-green-600">Careers</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Support
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link href="/faq" className="hover:text-green-600">FAQ</Link></li>
            <li><Link href="/help" className="hover:text-green-600">Help Center</Link></li>
            <li><Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-green-600">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Resources
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link href="/blog" className="hover:text-green-600">Blog</Link></li>
            <li><Link href="/guides" className="hover:text-green-600">Farmer Guides</Link></li>
            <li><Link href="/tech-notes" className="hover:text-green-600">Tech Notes</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-6 text-center text-sm text-gray-500">
        © 2026 Agrilink Ethiopia. All rights reserved.
      </div>
    </footer>
  );
}
