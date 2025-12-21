"use client";

import { Filter } from 'lucide-react';

type FilterPanelProps = {
  selectedCrops: string[];
  onCropToggle: (crop: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  quantityRange: [number, number];
  onQuantityChange: (range: [number, number]) => void;
  onClearFilters: () => void;
};

export default function FilterPanel({ 
  selectedCrops, 
  onCropToggle, 
  priceRange, 
  onPriceChange, 
  quantityRange, 
  onQuantityChange,
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
        <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200">
          <option>Select Region</option>
          <option>Addis Ababa</option>
          <option>Oromia Region</option>
          <option>Amhara Region</option>
          <option>Sidama</option>
          <option>Tigray Region</option>
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

      <button 
        onClick={onClearFilters}
        className="w-full rounded-lg bg-gray-100 py-2.5 font-medium text-gray-700 hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}