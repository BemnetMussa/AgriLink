"use client";

import { use, useState, useEffect } from "react";
import {
    MapPin,
    MessageSquare,
    CreditCard,
    CheckCircle,
    Globe,
    Accessibility,
    Clock,
    ChevronLeft,
    Star,
    Package,
    CircleDollarSign,
    CalendarDays,
    Truck,
    Check
} from "lucide-react";
import Link from "next/link";
import { sampleListings } from "@/data/sampleListings";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [listing, setListing] = useState<any>(null);
    const [activeImage, setActiveImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Try sample data
        let foundListing = sampleListings.find((item) => item.id === parseInt(id));

        // 2. Try local storage if not in samples
        if (!foundListing) {
            const localItems = JSON.parse(localStorage.getItem("local_listings") || "[]");
            foundListing = localItems.find((item: any) => item.id === parseInt(id));
        }

        if (foundListing) {
            setListing(foundListing);
            setActiveImage(foundListing.image);
        }
        setIsLoading(false);
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Listing not found</h1>
                <p className="mt-2 text-gray-600">The product you are looking for does not exist or has been removed.</p>
                <Link href="/listings" className="mt-6 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition">
                    Back to Listings
                </Link>
            </div>
        );
    }

    // Helper to render stars
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-600">({rating.toFixed(1)} / 5)</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="mx-auto max-w-7xl px-6 py-8">

                {/* Breadcrumbs / Back */}
                <Link href="/listings" className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-green-600 transition">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Listings
                </Link>

                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Left Column: Gallery & Product Info */}
                    <div className="flex-1 space-y-8">

                        {/* Gallery Section */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
                                <img
                                    src={activeImage}
                                    alt={listing.title}
                                    className="h-full w-full object-cover transition-all duration-300"
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-4">
                                {(listing.gallery || [listing.image]).map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-square overflow-hidden rounded-lg border-2 transition ${activeImage === img ? "border-green-600" : "border-transparent hover:border-gray-300"}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Metadata Section */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                {listing.description || "Freshly harvested produce directly from the source. High quality and organically grown."}
                            </p>

                            <hr className="my-8 border-gray-100" />

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Crop Type</h4>
                                        <p className="text-gray-900 font-medium">{listing.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Quantity</h4>
                                        <p className="text-gray-900 font-medium">{listing.quantity} kg (Min order: {listing.minOrder || 1} kg)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                                        <CircleDollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Unit Price</h4>
                                        <p className="text-2xl font-bold text-green-600">{listing.price} ETB / kg</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                        <p className="text-gray-900 font-medium">{listing.location}, Ethiopia</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                                        <p className="text-gray-900 font-medium">{listing.updatedAt || "2023-12-24"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Status Timeline */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-xl font-bold text-gray-900">Order Status</h2>
                            <div className="space-y-8">

                                {/* Step 1 */}
                                <div className="relative flex items-center gap-4">
                                    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-white">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-100"></div>
                                    <span className="font-medium text-gray-400">Order Placed</span>
                                </div>

                                {/* Step 2 */}
                                <div className="relative flex items-center gap-4">
                                    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-white">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-100"></div>
                                    <span className="font-medium text-gray-400">Payment Confirmed</span>
                                </div>

                                {/* Step 3 */}
                                <div className="relative flex items-center gap-4">
                                    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-white">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-100"></div>
                                    <span className="font-medium text-gray-400">Produce Shipped</span>
                                </div>

                                {/* Step 4 */}
                                <div className="relative flex items-center gap-4">
                                    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-white">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-gray-400">Delivered</span>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="w-full space-y-6 lg:w-[380px]">

                        {/* Farmer Profile Card */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-green-50">
                                <img src="/farmer.png" alt={listing.farmer} className="h-full w-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{listing.farmer}</h3>
                            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-4 w-4" />
                                <span>{listing.farmerLocation || "Hawassa, Sidama Region"}</span>
                            </div>
                            <div className="mt-3 flex justify-center">
                                {renderStars(4.3)}
                            </div>
                            <button className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                                View Profile
                            </button>
                        </div>

                        {/* Actions Card */}
                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white hover:bg-green-700 transition shadow-lg shadow-green-100">
                                <MessageSquare className="h-5 w-5" />
                                Chat / Make Offer
                            </button>
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 py-3 font-bold text-green-600 hover:bg-green-50 transition">
                                <CreditCard className="h-5 w-5" />
                                Escrow Payment (Telebirr)
                            </button>
                        </div>

                        {/* Platform Features Card */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Platform Features</h3>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-50 p-2 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Offline Sync Status</span>
                                    </div>
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Synced</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                                            <Globe className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Translation Toggle</span>
                                    </div>
                                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-purple-50 p-2 text-purple-600">
                                            <Accessibility className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Accessibility Options</span>
                                    </div>
                                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
