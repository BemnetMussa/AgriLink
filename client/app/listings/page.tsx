"use client";

import { useState, useMemo, useEffect } from "react";
import FilterPanel from "@/component/listings/FilterPanel";
import ListingsGrid from "@/component/listings/ListingsGrid";
import SearchBar, { SearchBarProps } from "@/component/listings/SearchBar";
import { sampleListings, Listing } from "@/data/sampleListings";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ListingsPage() {
  // ✅ REQUIRED STATES
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [mapViewEnabled, setMapViewEnabled] = useState(false);

  // State to hold all listings (sample + local storage)
  const [allListings, setAllListings] = useState<Listing[]>(sampleListings);

  // Load local storage listings on component mount
  useEffect(() => {
    const localItems = JSON.parse(localStorage.getItem("local_listings") || "[]");
    if (localItems.length > 0) {
      setAllListings((prevListings: Listing[]) => {
        // Correctly merge and deduplicate by ID
        const combined = [...prevListings, ...localItems];
        const unique = Array.from(new Map(combined.map((item: Listing) => [item.id, item])).values());
        return unique;
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  // Memoized filtering and scoring logic
  const filteredListings = useMemo(() => {
    // 1. First, apply hard filters
    let result = allListings.filter((item: Listing) => {
      // Search filter (title, farmer, location)
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Crop category filter (Default to "Other" if missing or match exact)
      const matchesCrop = selectedCrops.length === 0 ||
        selectedCrops.includes(item.category) ||
        (selectedCrops.includes("Other") && !item.category);

      // Location filter
      const matchesLocation = !selectedLocation || item.location === selectedLocation;

      // Price filter (Max Price Requirement)
      const matchesPrice = item.price <= priceRange[1];

      // Quantity filter (Min Quantity Requirement - Buyer needs at least this much)
      const matchesQuantity = item.quantity >= quantityRange[1];

      return matchesSearch && matchesCrop && matchesLocation && matchesPrice && matchesQuantity;
    });

    // 2. Apply Sorting & Relevance Scoring
    return result.sort((a: Listing, b: Listing) => {
      // Custom sorting for 'relevance' (highest score first)
      if (sortBy === 'newest') {
        // Calculate relevance scores if searching
        if (searchQuery) {
          const getScore = (item: typeof a) => {
            let score = 0;
            const searchLower = searchQuery.toLowerCase();
            if (item.title.toLowerCase().includes(searchLower)) score += 10;
            if (item.category.toLowerCase().includes(searchLower)) score += 5;
            if (item.farmer.toLowerCase().includes(searchLower)) score += 2;
            return score;
          };
          const scoreA = getScore(a);
          const scoreB = getScore(b);
          if (scoreA !== scoreB) return scoreB - scoreA;
        }
        return b.id - a.id; // Fallback to newest
      }

      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;

      return 0;
    });
  }, [allListings, searchQuery, selectedCrops, priceRange, quantityRange, sortBy, selectedLocation]);

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
    setPriceRange([0, 1000]);
    setQuantityRange([0, 0]);
    setSearchQuery("");
    setSelectedLanguage("English");
    setSortBy("newest");
    setMapViewEnabled(false);
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Listings & Search</h1>

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} showSellButton={false} />
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
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              sortBy={sortBy}
              onSortChange={setSortBy}
              mapViewEnabled={mapViewEnabled}
              onMapViewToggle={() => setMapViewEnabled(!mapViewEnabled)}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Listings */}
          <ListingsGrid listings={filteredListings} totalCount={filteredListings.length} />
        </div>

      </div>
    </section>
  );
}
