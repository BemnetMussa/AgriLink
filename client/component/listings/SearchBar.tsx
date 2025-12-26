"use client";

import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  showSellButton?: boolean;
};

export default function SearchBar({
  onSearch,
  placeholder = "Browse Listings",
  showSellButton = true
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      <div className="relative flex-[1.2]">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full h-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-50 shadow-sm transition-all"
        />
      </div>
      {showSellButton && (
        <Link
          href="/listings/create"
          className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-green-600 px-10 py-4 font-bold text-white hover:bg-green-700 transition-all shadow-xl shadow-green-100 hover:shadow-green-200 active:scale-95 group"
        >
          <div className="flex flex-col items-center">
            <Plus className="h-6 w-6 mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-sm uppercase tracking-wider">Sell Produce</span>
          </div>
        </Link>
      )}
    </div>
  );
}