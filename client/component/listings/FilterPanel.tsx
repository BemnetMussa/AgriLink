"use client";

import { Filter } from 'lucide-react';

type FilterPanelProps = {
  selectedCrops: string[];
  onCropToggle: (crop: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  quantityRange: [number, number];
  onQuantityChange: (range: [number, number]) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  mapViewEnabled: boolean;
  onMapViewToggle: () => void;
  onClearFilters: () => void;
};

export default function FilterPanel({
  selectedCrops,
  onCropToggle,
  priceRange,
  onPriceChange,
  quantityRange,
  onQuantityChange,
  selectedLanguage,
  onLanguageChange,
  selectedLocation,
  onLocationChange,
  sortBy,
  onSortChange,
  mapViewEnabled,
  onMapViewToggle,
  onClearFilters
}: FilterPanelProps) {
  const crops = [
    'Tomatoes', 'Coffee Beans', 'Potatoes', 'Teff Grain', 'Cabbage',
    'Onions', 'Bananas', 'Wheat Grain', 'Carrots', 'Barley Grain'
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      {/* Crop Type */}
      <div className="mb-8">
        <h3 className="mb-3 font-medium text-gray-700">Crop Type</h3>
        <div className="space-y-2">
          {crops.map(crop => (
            <label key={crop} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCrops.includes(crop)}
                onChange={() => onCropToggle(crop)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">{crop}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-8">
        <h3 className="mb-3 font-medium text-gray-700">Location</h3>
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Regions</option>
          <option value="Addis Ababa">Addis Ababa</option>
          <option value="Oromia Region">Oromia Region</option>
          <option value="Amhara Region">Amhara Region</option>
          <option value="Sidama">Sidama</option>
          <option value="Tigray Region">Tigray Region</option>
        </select>
      </div>

      {/* Quantity */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Quantity (kg)</h3>
          <span className="text-sm text-gray-500">{quantityRange[0]} - {quantityRange[1]} kg</span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          step="50"
          value={quantityRange[1]}
          onChange={(e) => onQuantityChange([0, parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600"
        />
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Price (ETB)</h3>
          <span className="text-sm text-gray-500">ETB {priceRange[0]} - {priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600"
        />
      </div>

      {/* Language */}
      <div className="mb-8">
        <h3 className="mb-3 font-medium text-gray-700">Language</h3>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="English">English</option>
          <option value="Amharic">Amharic</option>
          <option value="Afaan Oromoo">Afaan Oromoo</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="mb-8">
        <h3 className="mb-3 font-medium text-gray-700">Sort By</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value="newest"
              checked={sortBy === 'newest'}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">Newest</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value="price-low"
              checked={sortBy === 'price-low'}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">Price (Low to High)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="sortBy"
              value="price-high"
              checked={sortBy === 'price-high'}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">Price (High to Low)</span>
          </label>
        </div>
      </div>

      {/* Map-Dark View Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Map-Dark View</h3>
          <button
            type="button"
            onClick={onMapViewToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mapViewEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mapViewEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full rounded-lg bg-gray-100 py-2.5 font-medium text-gray-700 hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}