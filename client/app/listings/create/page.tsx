"use client";

import { useState } from "react";
import {
    ChevronLeft,
    Wifi,
    WifiOff,
    Camera,
    Upload,
    X,
    MapPin,
    Navigation,
    CheckCircle2,
    Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
    const router = useRouter();

    // State for form fields
    const [cropType, setCropType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("Kilograms (Kg)");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("Addis Ababa, Ethiopia");
    const [isOffline, setIsOffline] = useState(true);

    // Mock photos
    const [photos, setPhotos] = useState([
        { id: 1, url: "/potatoes.png" },
        { id: 2, url: "/tomatoes.png" }
    ]);

    const removePhoto = (id: number) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, logic to save locally or send to server
        router.push("/listings");
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="mx-auto max-w-4xl px-4 py-8">

                {/* Header & Back Navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/listings"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:text-green-600 shadow-sm transition"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Create Listing</h1>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-1.5 shadow-sm text-sm font-medium">
                        <span className={isOffline ? "text-amber-600" : "text-green-600"}>
                            {isOffline ? "Offline Mode" : "Online Mode"}
                        </span>
                        <button
                            onClick={() => setIsOffline(!isOffline)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isOffline ? "bg-amber-100" : "bg-green-100"}`}
                        >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isOffline ? "translate-x-1" : "translate-x-4.5 shadow-sm"}`} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Offline Submission Status */}
                    <div className="rounded-2xl border border-green-100 bg-green-50/50 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-2 text-green-700">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold text-green-800">Offline Submission Status</h3>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                                <WifiOff className="h-3 w-3" />
                                Offline
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-green-700 font-medium">
                            Your listing is saved locally. 3 items in submission queue, they will sync automatically when you are online.
                        </p>
                    </div>

                    {/* Section 2: Product Details */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                        <p className="mt-1 text-sm text-gray-500">Provide basic information about the produce you want to sell.</p>

                        <div className="mt-8 space-y-6">
                            {/* Crop Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Crop Type</label>
                                <select
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm appearance-none"
                                    value={cropType}
                                    onChange={(e) => setCropType(e.target.value)}
                                >
                                    <option value="">Select a crop</option>
                                    <option value="Tomatoes">Tomatoes</option>
                                    <option value="Coffee Beans">Coffee Beans</option>
                                    <option value="Potatoes">Potatoes</option>
                                    <option value="Teff Grain">Teff Grain</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 500"
                                        className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-bold text-gray-700 opacity-0 hidden sm:block">Unit</label>
                                    <select
                                        className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    >
                                        <option>Kilograms (Kg)</option>
                                        <option>Quintals</option>
                                        <option>Boxes</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Price per unit (ETB)</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 2500"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your produce (e.g., organic, fresh harvest, specific variety, farming practices)"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Photos */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                        <p className="mt-1 text-sm text-gray-500">Add clear photos of your produce to attract buyers.</p>

                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                            {/* Existing Photos */}
                            {photos.map(photo => (
                                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm group">
                                    <img src={photo.url} alt="Produce" className="h-full w-full object-cover" />
                                    <button
                                        onClick={() => removePhoto(photo.id)}
                                        className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600 transition"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {/* Take Photo Action */}
                            <button
                                type="button"
                                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 transition group"
                            >
                                <Camera className="h-6 w-6 text-gray-400 group-hover:text-green-600" />
                                <span className="mt-2 text-xs font-bold text-gray-900">Take Photo</span>
                            </button>

                            {/* Upload Photo Action */}
                            <button
                                type="button"
                                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 transition group"
                            >
                                <Upload className="h-6 w-6 text-gray-400 group-hover:text-green-600" />
                                <span className="mt-2 text-xs font-bold text-gray-900">Upload Photo</span>
                            </button>

                            {/* Add Another Placeholder */}
                            <button
                                type="button"
                                className="flex aspect-square flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition group"
                            >
                                <div className="rounded-lg bg-white p-2 shadow-sm border border-gray-200">
                                    <Plus className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-gray-500">Add another photo</span>
                            </button>
                        </div>
                    </div>

                    {/* Section 4: Location Details */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
                        <p className="mt-1 text-sm text-gray-500">Specify the origin of your produce for local buyers.</p>

                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Location</label>
                                <div className="relative mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-100 transition shadow-sm"
                                >
                                    <Navigation className="h-4 w-4" />
                                    Autofill Location
                                </button>
                            </div>

                            {/* Map Preview Placeholder */}
                            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-200 flex items-center justify-center border border-gray-200">
                                <div className="text-center">
                                    <MapPin className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm font-medium text-gray-500">Map preview (OpenStreetMap)</p>
                                </div>
                                {/* Subtle overlay to look more like a map */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Offline Operations & Sync */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Offline Operations & Sync</h2>
                        <p className="mt-4 text-sm font-medium text-gray-600 leading-relaxed">
                            AgriLink Ethiopia is optimized for low-bandwidth environments and offline use. Your data is safe:
                        </p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    <strong className="text-gray-900">Local Storage:</strong> All form data, including photos, is saved securely on your device (using IndexedDB) even if you lose connection.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    <strong className="text-gray-900">Automatic Sync:</strong> When your device regains internet access, all pending listings will automatically sync with the server.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    <strong className="text-gray-900">Conflict Resolution:</strong> In rare cases of data conflict (e.g., if you edit the same listing on multiple devices offline), the system will prompt you for preferred version or intelligently merge changes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Action */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-green-600 py-4.5 text-lg font-bold text-white shadow-lg shadow-green-100 hover:bg-green-700 hover:-translate-y-0.5 transition active:translate-y-0"
                        >
                            Submit Listing
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

// Simple Plus icon component since lucide-react might not have Exactly what Visily showed in that specific spot
function Plus({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
