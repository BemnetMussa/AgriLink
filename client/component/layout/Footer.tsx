"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Description */}
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-white">AgriLink</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connecting Ethiopian farmers with buyers through secure, offline-first transactions.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors">
              <Facebook className="w-4 h-4 text-gray-300" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors">
              <Twitter className="w-4 h-4 text-gray-300" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors">
              <Instagram className="w-4 h-4 text-gray-300" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors">
              <Linkedin className="w-4 h-4 text-gray-300" />
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-5">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/about" className="text-gray-400 hover:text-green-400 transition-colors">About Us</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a></li>
            <li><a href="/careers" className="text-gray-400 hover:text-green-400 transition-colors">Careers</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-5">
            Support
          </h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/faq" className="text-gray-400 hover:text-green-400 transition-colors">FAQ</a></li>
            <li><a href="/help" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-5">
            Resources
          </h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/blog" className="text-gray-400 hover:text-green-400 transition-colors">Blog</a></li>
            <li><a href="/guides" className="text-gray-400 hover:text-green-400 transition-colors">Farmer Guides</a></li>
            <li><a href="/tech-notes" className="text-gray-400 hover:text-green-400 transition-colors">Tech Notes</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-6 text-center text-sm text-gray-500">
          © 2026 AgriLink Ethiopia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}