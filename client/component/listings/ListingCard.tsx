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
  // Get emoji based on crop type
  const getEmoji = (title: string) => {
    if (title.toLowerCase().includes('tomato')) return '🍅';
    if (title.toLowerCase().includes('coffee')) return '☕';
    if (title.toLowerCase().includes('potato')) return '🥔';
    if (title.toLowerCase().includes('teff')) return '🌾';
    if (title.toLowerCase().includes('cabbage')) return '🥬';
    if (title.toLowerCase().includes('onion')) return '🧅';
    if (title.toLowerCase().includes('banana')) return '🍌';
    if (title.toLowerCase().includes('wheat')) return '🌾';
    if (title.toLowerCase().includes('carrot')) return '🥕';
    if (title.toLowerCase().includes('barley')) return '🌾';
    return '🌱';
  };

  // Get sync status display
  const getSyncStatus = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Offline Synced',
          color: 'text-blue-600'
        };
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          text: 'Sync Pending',
          color: 'text-yellow-600'
        };
      case 'online-only':
        return {
          icon: <Wifi className="h-4 w-4" />,
          text: 'Online Only',
          color: 'text-gray-600'
        };
      default:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Synced',
          color: 'text-gray-600'
        };
    }
  };


  // Helper to render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  const syncInfo = getSyncStatus();

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
        <div className="p-5">
          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>

          {/* Rating and Sold Quantity */}
          <div className="mb-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{soldQuantity} Kg sold</span>
          </div>

          {/* Location */}
          <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          {/* Farmer */}
          <div className="mb-3 text-sm text-gray-500">Farmer: {farmer}</div>

          {/* Price and Quantity */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xl font-bold text-green-600">ETB {price}/Kg</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{quantity} Kg available</span>
          </div>

          {/* Sync Status */}
          <div className="mb-4 flex items-center gap-2">
            <div className={`flex items-center gap-1 text-sm ${syncInfo.color}`}>
              {syncInfo.icon}
              <span>{syncInfo.text}</span>
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