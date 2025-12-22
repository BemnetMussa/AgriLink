"use client";

type Props = {
  selectedCrops: string[];
  onCropToggle: (crop: string) => void;

  selectedQuantity: string;
  onQuantityChange: (q: string) => void;

  selectedPrice: string;
  onPriceChange: (p: string) => void;

  selectedLocation: string;
  onLocationChange: (l: string) => void;

  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;

  sortBy: string;
  onSortChange: (sort: string) => void;
};

const CROPS = [
  "Tomatoes",
  "Coffee Beans",
  "Potatoes",
  "Teff Grain",
  "Cabbage",
  "Onions",
  "Bananas",
  "Wheat Grain",
  "Carrots",
  "Barley Grain",
];

const QUANTITIES = [
  "Any",
  "0 - 100 Kg",
  "100 - 500 Kg",
  "500 - 1000 Kg",
  "1000+ Kg",
];

const PRICES = [
  "Any",
  "0 - 50 ETB",
  "50 - 100 ETB",
  "100 - 200 ETB",
  "200+ ETB",
];

const LOCATIONS = [
  "All Locations",
  "Addis Ababa",
  "Oromia",
  "Amhara",
  "Sidama",
  "Tigray",
];

const LANGUAGES = ["All","English", "Amharic", "Afaan Oromoo"];

const SORT_OPTIONS = [
  "Newest",
  "Relevance",
  "Price: Low to High",
  "Price: High to Low",
];

export default function FilterPanel({
  selectedCrops,
  onCropToggle,
  selectedQuantity,
  onQuantityChange,
  selectedPrice,
  onPriceChange,
  selectedLocation,
  onLocationChange,
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
          <div className="rounded-xl text-gray-900 border bg-white p-4 ">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>

            {/* Crop Type */}
            <div className="mb-6">
              <h3 className="mb-2 font-medium">Crop Type</h3>
              {CROPS.map((crop) => (
                <label key={crop} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCrops.includes(crop)}
                    onChange={() => onCropToggle(crop)}
                    className="accent-green-600"
                  />
                  {crop}
                </label>
              ))}
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 bg-white"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">Quantity (Kg)</label>
              <select
                value={selectedQuantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 bg-white"
              >
                {QUANTITIES.map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">Price (ETB)</label>
              <select
                value={selectedPrice}
                onChange={(e) => onPriceChange(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 bg-white"
              >
                {PRICES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 bg-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="mb-2 font-medium">Sort By</h3>
              {SORT_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === option}
                    onChange={() => onSortChange(option)}
                    className="accent-green-600"
                  />
                  {option}
                </label>
              ))}
            </div>
            
          </div>
  );
}
