"use client";

import { useState, useMemo } from "react";
import FilterPanel from "@/component/listings/FilterPanel";
import ListingsGrid from "@/component/listings/ListingsGrid";
import SearchBar from "@/component/listings/SearchBar";

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

  // Sample listing data
  const sampleListings = [
    {
      id: 1,
      title: "Organic Red Tomatoes",
      category: "Tomatoes",
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
      category: "Coffee Beans",
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
      category: "Potatoes",
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
      category: "Teff Grain",
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
      category: "Cabbage",
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
      category: "Onions",
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
      category: "Bananas",
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
      category: "Wheat Grain",
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
      category: "Carrots",
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
      category: "Barley Grain",
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

  // Memoized filtering and scoring logic
  const filteredListings = useMemo(() => {
    // 1. First, apply hard filters
    let result = sampleListings.filter(item => {
      // Search filter (title, farmer, location)
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Crop category filter (Exact match against category field)
      const matchesCrop = selectedCrops.length === 0 || selectedCrops.includes(item.category);

      // Location filter
      const matchesLocation = !selectedLocation || item.location === selectedLocation;

      // Price filter (Max Price Requirement)
      const matchesPrice = item.price <= priceRange[1];

      // Quantity filter (Min Quantity Requirement - Buyer needs at least this much)
      const matchesQuantity = item.quantity >= quantityRange[1];

      return matchesSearch && matchesCrop && matchesLocation && matchesPrice && matchesQuantity;
    });

    // 2. Apply Sorting & Relevance Scoring
    return result.sort((a, b) => {
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
  }, [searchQuery, selectedCrops, priceRange, quantityRange, sortBy, selectedLocation]);

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
