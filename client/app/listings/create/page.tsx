"use client";

import { useState, useRef, useEffect } from "react";
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
    Info,
    Loader2
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
    const [isOffline, setIsOffline] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 9.03, lng: 38.74 }); // Default Addis

    // Monitor network status
    useEffect(() => {
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isLocating, setIsLocating] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Mock photos
    const [photos, setPhotos] = useState([
        { id: 1, url: "/potatoes.png" },
        { id: 2, url: "/tomatoes.png" }
    ]);

    const removePhoto = (id: number) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    const startCamera = async () => {
        setIsCameraOpen(true);
        setCapturedImage(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera", err);
            alert("Could not access camera. Please check permissions.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const confirmPhoto = () => {
        if (capturedImage) {
            setPhotos([...photos, { id: Date.now(), url: capturedImage }]);
            setIsCameraOpen(false);
            setCapturedImage(null);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPhotos([...photos, { id: Date.now(), url }]);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleAutofillLocation = () => {
        setIsLocating(true);

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            setIsLocating(false);
            return;
        }

        // Request position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                setLocation(`Detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation Error Detail:", {
                    code: error.code,
                    message: error.message
                });

                let message = "Could not get location.";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Location access denied. Please allow location permissions in your browser and device settings to use autofill.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "Device location is turned off or unavailable. Please ensure your GPS/Location services are enabled at the system level.";
                        break;
                    case error.TIMEOUT:
                        message = "The request to get user location timed out. Please try again or enter your location manually.";
                        break;
                    default:
                        message = "An unknown error occurred while detecting location.";
                        break;
                }

                alert(message);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true, // Prefer high accuracy for better results
                timeout: 10000,           // 10 second timeout
                maximumAge: 0            // No cached locations
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create new listing object
        const newListing = {
            id: Date.now(),
            title: cropType || "Fresh Produce",
            category: cropType || "Other", // Match filtering field
            price: Number(price) || 0,
            quantity: Number(quantity) || 0,
            location: location,
            farmer: "Abebe Bikila", // Mock current farmer
            status: isOffline ? 'offline' : 'online',
            syncStatus: isOffline ? 'pending' : 'synced',
            image: photos[0]?.url || "/potatoes.png",
            rating: 5.0,
            soldQuantity: 0,
            description: description,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const existingListings = JSON.parse(localStorage.getItem("local_listings") || "[]");
        localStorage.setItem("local_listings", JSON.stringify([newListing, ...existingListings]));

        // Alert user
        alert(isOffline ? "Saved locally! It will sync when online." : "Listing posted successfully!");

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
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 text-green-700">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-green-800">Offline Submission Status</h3>
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
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />

                            {/* Existing Photos */}
                            {photos.map(photo => (
                                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm group">
                                    <img src={photo.url} alt="Produce" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
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
                                onClick={startCamera}
                                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 transition group"
                            >
                                <Camera className="h-6 w-6 text-gray-400 group-hover:text-green-600" />
                                <span className="mt-2 text-xs font-bold text-gray-900">Take Photo</span>
                            </button>

                            {/* Upload Photo Action */}
                            <button
                                type="button"
                                onClick={triggerUpload}
                                className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-green-500 transition group"
                            >
                                <Upload className="h-6 w-6 text-gray-400 group-hover:text-green-600" />
                                <span className="mt-2 text-xs font-bold text-gray-900">Upload Photo</span>
                            </button>

                            {/* Add Another Placeholder */}
                            <button
                                type="button"
                                onClick={triggerUpload}
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
                                    onClick={handleAutofillLocation}
                                    disabled={isLocating}
                                    className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-100 transition shadow-sm disabled:opacity-50"
                                >
                                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                                    {isLocating ? "Detecting..." : "Autofill Location"}
                                </button>
                            </div>

                            {/* Map Preview Placeholder */}
                            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
                                <iframe
                                    className="h-full w-full"
                                    title="Map Preview"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                                ></iframe>
                                <div className="absolute top-3 right-3 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm border border-gray-100 flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5 text-blue-500" />
                                    OpenStreetMap Active
                                </div>
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

            {/* Camera Modal */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">

                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
                            <h3 className="text-lg font-bold text-white">
                                {capturedImage ? "Review Photo" : "Capture Produce"}
                            </h3>
                            <button
                                onClick={() => { setIsCameraOpen(false); stopCamera(); }}
                                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Viewport */}
                        <div className="relative aspect-[3/4] w-full bg-black flex items-center justify-center">
                            {!capturedImage ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <img src={capturedImage} className="h-full w-full object-cover" />
                            )}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* Controls */}
                        <div className="p-8">
                            {!capturedImage ? (
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white p-1 hover:scale-105 transition active:scale-95"
                                    >
                                        <div className="h-full w-full rounded-full bg-white shadow-lg shadow-white/20" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        className="flex-1 rounded-2xl border border-white/20 bg-white/10 py-4 font-bold text-white hover:bg-white/20 transition"
                                    >
                                        Retake
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmPhoto}
                                        className="flex-1 rounded-2xl bg-green-600 py-4 font-bold text-white hover:bg-green-700 transition shadow-lg shadow-green-900/40"
                                    >
                                        Use Photo
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
