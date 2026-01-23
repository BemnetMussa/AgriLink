"use client";

import { useState, useMemo, useEffect } from "react";
import FilterPanel from "@/component/listings/FilterPanel";
import ListingsGrid from "@/component/listings/ListingsGrid";
import SearchBar from "@/component/listings/SearchBar";
import { productApi } from "@/lib/api";
import { extractErrorMessage } from "@/utils/errorHandler";

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
  farmer: string;
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
  const [mounted, setMounted] = useState(false);

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [mounted, selectedCrops, priceRange, quantityRange, searchQuery, selectedLocation, sortBy, page]);

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
        params.category = selectedCrops[0];
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
        const productsArray = Array.isArray(response.data) ? response.data : (response.data.products || []);
        const products = productsArray.map((product: any) => ({
          ...product,
          farmer: product.farmer 
            ? `${product.farmer.firstName || ''} ${product.farmer.lastName || ''}`.trim() || 'Unknown'
            : 'Unknown',
          image: product.images?.[0] || product.image || "/potatoes.png",
        }));
        setListings(products);
        setTotal(response.pagination?.total || productsArray.length);
      } else {
        setListings([]);
        setTotal(0);
      }
    } catch (err: any) {
      setError(extractErrorMessage(err) || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized filtering (client-side for additional filtering if needed)
  const filteredListings = useMemo(() => {
    let result = listings;

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
    setPage(1);
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

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <section className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">Browse Listings</h1>
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Browse Listings
          </h1>
          <p className="text-lg text-gray-600">
            Discover fresh produce from farmers across Ethiopia
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">{error}</p>
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 shrink-0">
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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
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