"use client";

import { MapPin, User, CheckCircle, WifiOff } from 'lucide-react';

export default function ListingCard(props: any) {
  return (
    <div className="flex flex-col text-gray-900 rounded-xl bg-white p-4 shadow-sm hover:shadow-md border border-gray-100">
      <div className="relative">
        <img
          src={props.image}
          alt={props.title}
          className="h-40 w-full rounded-lg object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1 text-xs font-medium">
          <WifiOff size={12} />
          Offline Synced
        </div>
      </div>

      <h3 className="mt-4 font-semibold text-lg">{props.title}</h3>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold text-green-600 text-lg">
          {props.price} ETB/Kg
        </span>
        <span className="text-gray-600 text-sm font-medium">
          {props.quantity} Kg available
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <p className="text-sm text-gray-600">{props.location}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <p className="text-sm text-gray-600">Farmer: {props.farmer}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
          <CheckCircle size={14} className="text-green-600" />
          <span className="text-xs text-green-700 font-medium">Escrow Verified</span>
        </div>

      </div>

      <button className="mt-4 w-full rounded-lg border border-green-600 py-3 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
        Quick Contact
      </button>
    </div>
  );
}