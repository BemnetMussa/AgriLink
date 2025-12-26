import Link from 'next/link';
import { Plus } from 'lucide-react';
import ListingCard from './ListingCard';

type Listing = {
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

type ListingsGridProps = {
  listings: Listing[];
  totalCount?: number;
};

export default function ListingsGrid({ listings, totalCount = 10 }: ListingsGridProps) {
  return (
    <div className="lg:w-3/4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Available Listings ({totalCount})</h2>
          <div className="text-sm text-gray-500">
            Showing {listings.length} of {totalCount} listings
          </div>
        </div>

        <Link
          href="/listings/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-700 transition-all shadow-md shadow-green-200 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            quantity={listing.quantity}
            location={listing.location}
            farmer={listing.farmer}
            status={listing.status}
            syncStatus={listing.syncStatus}
            image={listing.image}
            rating={listing.rating}
            soldQuantity={listing.soldQuantity}
          />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-4xl mb-4">🌾</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No listings found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later</p>
        </div>
      )}
    </div>
  );
}