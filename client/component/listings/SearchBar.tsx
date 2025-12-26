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
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-50 shadow-sm transition-all"
        />
      </div>

      <button
        onClick={() => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (input) onSearch(input.value);
        }}
        className="rounded-xl bg-gray-900 px-6 py-3 font-bold text-white hover:bg-black transition-all shadow-md active:scale-95"
      >
        Search
      </button>

      {showSellButton && (
        <Link
          href="/listings/create"
          className="hidden sm:flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 transition-all shadow-md shadow-green-100 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>Sell</span>
        </Link>
      )}
    </div>
  );
}