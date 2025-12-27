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
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Available Listings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse through {totalCount} high-quality agricultural products
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            {listings.length} Results
          </span>
        </div>
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
    </div>
  );
}
