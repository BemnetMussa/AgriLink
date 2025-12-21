"use client";

import { Phone, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';

type ListingCardProps = {
  title: string;
  price: number;
  quantity: number;
  location: string;
  farmer: string;
  status: 'online' | 'offline';
  syncStatus: 'synced' | 'pending' | 'online-only';
  image?: string;
};

export default function ListingCard({
  title,
  price,
  quantity,
  location,
  farmer,
  status,
  syncStatus,
  image
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

  const syncInfo = getSyncStatus();
  const emoji = image || getEmoji(title);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
      {/* Header with emoji and status */}
      <div className="mb-4 flex items-start justify-between">
        <div className="text-4xl">{emoji}</div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {status === 'online' ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">
        {title}
      </h3>

      {/* Details */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl font-bold text-green-600">ETB {price}/Kg</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{quantity} Kg available</span>
        </div>
        <div className="text-gray-600">{location}</div>
        <div className="text-sm text-gray-500">Farmer: {farmer}</div>
      </div>

      {/* Sync Status */}
      <div className="mb-4 flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm ${syncInfo.color}`}>
          {syncInfo.icon}
          <span>{syncInfo.text}</span>
        </div>
      </div>

      {/* Quick Contact Button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 py-2.5 font-medium text-green-700 hover:bg-green-100 transition-colors">
        <Phone className="h-4 w-4" />
        Quick Contact
      </button>
    </div>
  );
}