"use client";

import Link from 'next/link';
import { Phone, CheckCircle, Clock, Wifi, WifiOff, MapPin } from 'lucide-react';

type ListingCardProps = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  location: string;
  farmer: string;
  status: 'online' | 'offline';
  syncStatus: 'synced' | 'pending' | 'online-only';
  image: string;
  rating: number;
  soldQuantity: number;
};

export default function ListingCard({
  id,
  title,
  price,
  quantity,
  location,
  farmer,
  status,
  syncStatus,
  image,
  rating,
  soldQuantity
}: ListingCardProps) {
  // Helper to render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? "text-yellow-400" : (i === fullStars && hasHalfStar ? "text-yellow-400" : "text-gray-300")}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/listings/${id}`}>
        {/* Product Image */}
        <div className="relative w-full h-48 bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Status Badge on Image */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${status === 'offline' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            {status === 'offline' ? 'Offline' : 'Online'}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-1 text-base font-semibold text-gray-800 line-clamp-1">
            {title}
          </h3>

          {/* Rating and Sold Quantity */}
          <div className="mb-2 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-0.5">
              {renderStars()}
              <span className="ml-1 text-gray-500">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{soldQuantity} sold</span>
          </div>

          {/* Location & Farmer */}
          <div className="mb-3 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{location}</span>
            </div>
            <span className="truncate">Farmer: {farmer}</span>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 font-medium">Price</span>
              <span className="text-lg font-bold text-green-600 leading-none">ETB {price}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Stock</span>
              <span className="text-sm font-semibold text-gray-700">{quantity} Kg</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        {/* Quick Contact Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 py-2.5 font-medium text-green-700 hover:bg-green-100 transition-colors">
          <Phone className="h-4 w-4" />
          Quick Contact
        </button>
      </div>
    </div>
  );
}