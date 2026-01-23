"use client";

import { useState, useMemo, useEffect } from "react";
import FilterPanel from "@/component/listings/FilterPanel";
import ListingsGrid from "@/component/listings/ListingsGrid";
import SearchBar from "@/component/listings/SearchBar";
import { productApi } from "@/lib/api";

interface Product {
  id: string;
  title: string;
  category: string;
  image?: string;
  images?: string[];
  price: number;
  quantity: number;
  minOrder?: number;
  rating: number;
  soldQuantity: number;
  location: string;
  farmer: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    farmerProfile?: {
      verificationStatus: string;
      rating: number;
    };
  };
  status: string;
  syncStatus: string;
  description?: string;
  updatedAt?: string;
}

export default function ListingsPage() {
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([0, 0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("newest");
  const [mapViewEnabled, setMapViewEnabled] = useState(false);
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [selectedCrops, priceRange, quantityRange, searchQuery, selectedLocation, sortBy, page]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page,
        limit: 20,
        sortBy,
      };

      if (selectedCrops.length > 0) {
        params.category = selectedCrops[0]; // Backend supports single category for now
      }
      if (selectedLocation) {
        params.location = selectedLocation;
      }
      if (priceRange[1] < 1000) {
        params.maxPrice = priceRange[1];
      }
      if (priceRange[0] > 0) {
        params.minPrice = priceRange[0];
      }
      if (quantityRange[1] > 0) {
        params.minQuantity = quantityRange[1];
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await productApi.getProducts(params);
      
      if (response.success && response.data) {
        const products = response.data.map((product: any) => ({
          ...product,
          farmer: product.farmer?.firstName + " " + product.farmer?.lastName || "Unknown",
          image: product.images?.[0] || product.image || "/potatoes.png",
        }));
        setListings(products);
        setTotal(response.pagination?.total || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized filtering (client-side for additional filtering if needed)
  const filteredListings = useMemo(() => {
    let result = listings;

    // Additional client-side filtering if needed
    if (selectedCrops.length > 0) {
      result = result.filter((item) => 
        selectedCrops.includes(item.category) ||
        (selectedCrops.includes("Other") && !item.category)
      );
    }

    return result;
  }, [listings, selectedCrops]);

  const handleCropToggle = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop)
        ? prev.filter((c) => c !== crop)
        : [...prev, crop]
    );
    setPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setSelectedCrops([]);
    setPriceRange([0, 1000]);
    setQuantityRange([0, 0]);
    setSearchQuery("");
    setSelectedLanguage("English");
    setSortBy("newest");
    setMapViewEnabled(false);
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Listings & Search</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Bar Container */}
        <div className="mb-8">
          <SearchBar 
            onSearch={(query) => {
              setSearchQuery(query);
              setPage(1);
            }} 
            showSellButton={false} 
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-[280px] shrink-0">
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
              onLocationChange={(loc) => {
                setSelectedLocation(loc);
                setPage(1);
              }}
              sortBy={sortBy}
              onSortChange={(sort) => {
                setSortBy(sort as any);
                setPage(1);
              }}
              mapViewEnabled={mapViewEnabled}
              onMapViewToggle={() => setMapViewEnabled(!mapViewEnabled)}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main Listings Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
              </div>
            ) : (
              <ListingsGrid 
                listings={filteredListings as any} 
                totalCount={total} 
              />
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
