"use client";

import { Search } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-400 py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100 shadow-sm"
        />
      </div>
      {showSellButton && (
        <button className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 transition-colors">
          Sell Produce
        </button>
      )}
    </div>
  );
}