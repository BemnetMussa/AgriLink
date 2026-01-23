"use client";

import { use, useState, useEffect } from "react";
import {
    MapPin,
    MessageSquare,
    CreditCard,
    CheckCircle,
    Globe,
    Accessibility,
    Info,
    Clock,
    ChevronLeft,
    Star,
    Package,
    CircleDollarSign,
    CalendarDays,
    Truck,
    Phone,
    Mail,
    X,
    Copy,
    Check,
} from "lucide-react";
import Link from "next/link";
import { productApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [listing, setListing] = useState<any>(null);
    const [activeImage, setActiveImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { isAuthenticated } = useAuth();
    const [showContactModal, setShowContactModal] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await productApi.getProductById(id);
            if (response.success && response.data) {
                const product = response.data;
                setListing({
                    ...product,
                    farmer: product.farmer?.firstName + " " + product.farmer?.lastName || "Unknown",
                    farmerLocation: product.farmer?.farmerProfile?.farmLocation || product.location,
                    farmerPhone: product.farmer?.phoneNumber,
                    farmerEmail: product.farmer?.email,
                    farmName: product.farmer?.farmerProfile?.farmName,
                    farmLocation: product.farmer?.farmerProfile?.farmLocation,
                    farmLatitude: product.farmer?.farmerProfile?.latitude,
                    farmLongitude: product.farmer?.farmerProfile?.longitude,
                    image: product.images?.[0] || product.image || "/potatoes.png",
                    gallery: product.images || [product.image || "/potatoes.png"],
                });
                setActiveImage(product.images?.[0] || product.image || "/potatoes.png");
            }
        } catch (err: any) {
            setError(extractErrorMessage(err) || "Failed to load product");
            console.error("Error fetching product:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Listing not found</h1>
                <p className="mt-2 text-gray-600">{error || "The product you are looking for does not exist or has been removed."}</p>
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

    // Copy to clipboard helper
    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
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
                            {(listing.gallery && listing.gallery.length > 1) && (
                                <div className="grid grid-cols-4 gap-4">
                                    {listing.gallery.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`aspect-square overflow-hidden rounded-lg border-2 transition ${activeImage === img ? "border-green-600" : "border-transparent hover:border-gray-300"}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
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
                                        <p className="text-gray-900 font-medium">{listing.quantity} {listing.unit || 'kg'} (Min order: {listing.minOrder || 1} {listing.unit || 'kg'})</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                                        <CircleDollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Unit Price</h4>
                                        <p className="text-2xl font-bold text-green-600">{listing.price} ETB / {listing.unit || 'kg'}</p>
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
                                        <p className="text-gray-900 font-medium">{listing.updatedAt ? new Date(listing.updatedAt).toLocaleDateString() : "Recently"}</p>
                                    </div>
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
                                <span>{listing.farmerLocation || listing.location}</span>
                            </div>
                            <div className="mt-3 flex justify-center">
                                {renderStars(listing.rating || 0)}
                            </div>
                            <button className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                                View Profile
                            </button>
                        </div>

                        {/* Actions Card */}
                        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            {isAuthenticated ? (
                                <>
                                    <button 
                                        onClick={() => setShowContactModal(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white hover:bg-green-700 transition shadow-lg shadow-green-100"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        Chat / Make Offer
                                    </button>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 py-3 font-bold text-green-600 hover:bg-green-50 transition">
                                        <CreditCard className="h-5 w-5" />
                                        Escrow Payment (Telebirr)
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white hover:bg-green-700 transition shadow-lg shadow-green-100"
                                >
                                    Login to Order
                                </Link>
                            )}
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
                                        <span className="text-sm font-medium text-gray-700">Sync Status</span>
                                    </div>
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                        {listing.syncStatus === 'synced' ? 'Synced' : listing.syncStatus || 'Online'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-green-50 to-white px-6 py-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                                <p className="mt-1 text-sm text-gray-600">Get in touch with {listing.farmer}</p>
                            </div>
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Farmer Name & Farm */}
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{listing.farmer}</h3>
                                    {listing.farmName && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Farm:</span> {listing.farmName}
                                        </p>
                                    )}
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-4">
                                    {/* Phone Number */}
                                    {listing.farmerPhone && (
                                        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-full bg-green-100 p-3">
                                                    <Phone className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Phone Number</p>
                                                    <p className="text-base font-semibold text-gray-900">{listing.farmerPhone}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(listing.farmerPhone, 'phone')}
                                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                                            >
                                                {copiedField === 'phone' ? (
                                                    <>
                                                        <Check className="h-4 w-4 text-green-600" />
                                                        <span className="text-green-600">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* Email */}
                                    {listing.farmerEmail && (
                                        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-full bg-blue-100 p-3">
                                                    <Mail className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">Email Address</p>
                                                    <p className="text-base font-semibold text-gray-900">{listing.farmerEmail}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(listing.farmerEmail, 'email')}
                                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                                            >
                                                {copiedField === 'email' ? (
                                                    <>
                                                        <Check className="h-4 w-4 text-green-600" />
                                                        <span className="text-green-600">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* Farm Location */}
                                    {listing.farmLocation && (
                                        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
                                            <div className="rounded-full bg-orange-100 p-3">
                                                <MapPin className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Farm Location</p>
                                                <p className="text-base font-semibold text-gray-900">{listing.farmLocation}</p>
                                                {listing.farmLatitude && listing.farmLongitude && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${listing.farmLatitude},${listing.farmLongitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                                                    >
                                                        <MapPin className="h-4 w-4" />
                                                        View on Map
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Location */}
                                    {listing.location && (
                                        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
                                            <div className="rounded-full bg-purple-100 p-3">
                                                <Package className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Product Location</p>
                                                <p className="text-base font-semibold text-gray-900">{listing.location}, Ethiopia</p>
                                                {listing.latitude && listing.longitude && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                                                    >
                                                        <MapPin className="h-4 w-4" />
                                                        View on Map
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Information */}
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-blue-900 mb-1">How to Contact</p>
                                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                                <li>Call or text the phone number above to discuss pricing and delivery</li>
                                                <li>Email for detailed inquiries or bulk orders</li>
                                                <li>Visit the farm location to inspect the produce in person</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="rounded-xl border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Close
                                </button>
                                {listing.farmerPhone && (
                                    <a
                                        href={`tel:${listing.farmerPhone}`}
                                        className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 font-bold text-white hover:bg-green-700 transition shadow-md"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Call Now
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
