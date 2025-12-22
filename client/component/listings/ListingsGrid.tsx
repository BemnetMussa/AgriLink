"use client";

import ListingCard from "./ListingCard";

export default function ListingsGrid({ listings, totalCount }: any) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((l: any) => (
          <ListingCard key={l.id} {...l} />
        ))}
      </div>
    </div>
  );
}
