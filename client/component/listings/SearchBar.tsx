"use client";

export default function SearchBar({ onSearch }: any) {
  return (
    <input
      type="text"
      placeholder="Search listings..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full  text-gray-900 rounded-lg border px-4 py-3"
    />
  );
}
