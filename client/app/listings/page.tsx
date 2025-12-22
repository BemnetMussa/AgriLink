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
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [sortBy, setSortBy] = useState("newest");
  const [mapViewEnabled, setMapViewEnabled] = useState(false);

  // Sample listing data
  const sampleListings = [
    {
      id: 1,
      title: "Organic Red Tomatoes",
      image: "/tomatoes.png",
      price: 60,
      quantity: 200,
      rating: 4.5,
      soldQuantity: 122,
      location: "Addis Ababa",
      farmer: "Abebe Kebede",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 2,
      title: "Premium Ethiopian Arabica Coffee Beans",
      image: "/farmer.png",
      price: 450,
      quantity: 150,
      rating: 4.8,
      soldQuantity: 215,
      location: "Sidama",
      farmer: "Tigist Hailu",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 3,
      title: "Local Highland Potatoes",
      image: "/potatoes.png",
      price: 35,
      quantity: 500,
      rating: 4.3,
      soldQuantity: 387,
      location: "Oromia Region",
      farmer: "Dawit Lemma",
      status: "offline" as const,
      syncStatus: "pending" as const
    },
    {
      id: 4,
      title: "Finest White Teff Grain",
      image: "/farmer.png",
      price: 150,
      quantity: 300,
      rating: 4.7,
      soldQuantity: 198,
      location: "Amhara Region",
      farmer: "Zeneb Tesfaye",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 5,
      title: "Fresh Green Cabbage",
      image: "/farmer.png",
      price: 25,
      quantity: 180,
      rating: 4.2,
      soldQuantity: 156,
      location: "Tigray Region",
      farmer: "Alem Wolde",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 6,
      title: "Sweet Red Onions",
      image: "/farmer.png",
      price: 40,
      quantity: 250,
      rating: 4.6,
      soldQuantity: 289,
      location: "Addis Ababa",
      farmer: "Mulugeta Girma",
      status: "offline" as const,
      syncStatus: "pending" as const
    },
    {
      id: 7,
      title: "Organic Bananas",
      image: "/farmer.png",
      price: 55,
      quantity: 120,
      rating: 4.4,
      soldQuantity: 98,
      location: "Oromia Region",
      farmer: "Hanna Bekele",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 8,
      title: "Premium Wheat Grain",
      image: "/farmer.png",
      price: 120,
      quantity: 400,
      rating: 4.5,
      soldQuantity: 342,
      location: "Amhara Region",
      farmer: "Yohannes Alemu",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 9,
      title: "Fresh Harvest Carrots",
      image: "/farmer.png",
      price: 45,
      quantity: 160,
      rating: 4.3,
      soldQuantity: 124,
      location: "Sidama",
      farmer: "Sara Negussie",
      status: "online" as const,
      syncStatus: "synced" as const
    },
    {
      id: 10,
      title: "Premium Barley Grain",
      image: "/farmer.png",
      price: 110,
      quantity: 350,
      rating: 4.6,
      soldQuantity: 267,
      location: "Tigray Region",
      farmer: "Tekle Habtemariam",
      status: "offline" as const,
      syncStatus: "pending" as const
    }
  ];

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
    setSelectedLanguage("English");
    setSortBy("newest");
    setMapViewEnabled(false);
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
