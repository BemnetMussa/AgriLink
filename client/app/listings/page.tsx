"use client";

import { useState } from "react";
import FilterPanel from "@/component/listings/FilterPanel";
import ListingsGrid from "@/component/listings/ListingsGrid";
import SearchBar from "@/component/listings/SearchBar";

const ALL_LISTINGS = [
  {
    id: 1,
    title: "Organic Red Tomatoes",
    price: 50,
    quantity: 500,
    location: "Addis Ababa",
    farmer: "Abebe Kebede",
    status: "online",
    syncStatus: "synced",
    image: "/tomatoes.png",
    crop: "Tomatoes",
  },
  {
    id: 2,
    title: "Premium Ethiopian Coffee Beans",
    price: 350,
    quantity: 150,
    location: "Sidama",
    farmer: "Tadele Fikadu",
    status: "offline",
    syncStatus: "pending",
    image: "/coffee bean.png",
    crop: "Coffee Beans",
  },
  {
    id: 3,
    title: "Local Highland Potatoes",
    price: 30,
    quantity: 1200,
    location: "Oromia",
    farmer: "Chaltu Biratu",
    status: "online",
    syncStatus: "online-only",
    image: "/potatoes.png",
    crop: "Potatoes",
  },
];

export default function ListingsPage() {
  /* =======================
     STATE
  ======================= */
  const [search, setSearch] = useState("");

  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState("Any");
  const [selectedPrice, setSelectedPrice] = useState("Any");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [sortBy, setSortBy] = useState("Newest");

  /* =======================
     HELPERS
  ======================= */
  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop)
        ? prev.filter((c) => c !== crop)
        : [...prev, crop]
    );
  };

  const matchQuantity = (qty: number) => {
    switch (selectedQuantity) {
      case "0 - 100 Kg":
        return qty <= 100;
      case "100 - 500 Kg":
        return qty > 100 && qty <= 500;
      case "500 - 1000 Kg":
        return qty > 500 && qty <= 1000;
      case "1000+ Kg":
        return qty > 1000;
      default:
        return true;
    }
  };

  const matchPrice = (price: number) => {
    switch (selectedPrice) {
      case "0 - 50 ETB":
        return price <= 50;
      case "50 - 100 ETB":
        return price > 50 && price <= 100;
      case "100 - 200 ETB":
        return price > 100 && price <= 200;
      case "200+ ETB":
        return price > 200;
      default:
        return true;
    }
  };

  /* =======================
     FILTER
  ======================= */
  let filtered = ALL_LISTINGS.filter((l) => {
    const cropMatch =
      selectedCrops.length === 0 || selectedCrops.includes(l.crop);

    const searchMatch = l.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const locationMatch =
      selectedLocation === "All Locations" ||
      l.location === selectedLocation;

    return (
      cropMatch &&
      searchMatch &&
      locationMatch &&
      matchQuantity(l.quantity) &&
      matchPrice(l.price)
    );
  });

  /* =======================
     SORT
  ======================= */
  if (sortBy === "Price: Low to High") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy === "Price: High to Low") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  /* =======================
     UI
  ======================= */
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <SearchBar onSearch={setSearch} />

        <h1 className="mt-8 mb-6 text-2xl font-bold text-gray-900">
          Available Listings ({filtered.length})
        </h1>

        <div className="flex gap-10">
          {/* LEFT FILTERS */}
          <aside className="w-72 shrink-0">
            <FilterPanel
              selectedCrops={selectedCrops}
              onCropToggle={toggleCrop}
              selectedQuantity={selectedQuantity}
              onQuantityChange={setSelectedQuantity}
              selectedPrice={selectedPrice}
              onPriceChange={setSelectedPrice}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </aside>

          {/* RIGHT LISTINGS */}
          <ListingsGrid
            listings={filtered}
            totalCount={ALL_LISTINGS.length}
          />
        </div>
        
      </div>
    </section>
  );
}
