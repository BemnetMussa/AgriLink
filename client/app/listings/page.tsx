"use client";

import { useState } from "react";
import FilterPanel from "@/component/listings/FilterPanel";
import ListingsGrid from "@/component/listings/ListingsGrid";
import SearchBar from "@/component/listings/SearchBar";

export default function ListingsPage() {
  // ✅ REQUIRED STATES
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 2000]);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle crop selection
  const handleCropToggle = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop)
        ? prev.filter((c) => c !== crop)
        : [...prev, crop]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCrops([]);
    setPriceRange([0, 500]);
    setQuantityRange([0, 2000]);
    setSearchQuery("");
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters */}
          <div className="lg:w-1/4">
            <FilterPanel
              selectedCrops={selectedCrops}
              onCropToggle={handleCropToggle}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              quantityRange={quantityRange}
              onQuantityChange={setQuantityRange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Listings */}
          <ListingsGrid listings={[]} totalCount={0} />
        </div>

      </div>
    </section>
  );
}
