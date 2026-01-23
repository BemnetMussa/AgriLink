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
import { productApi, api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function CreateListingPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    // State for form fields
    const [cropType, setCropType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("kg");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("Addis Ababa, Ethiopia");
    const [isOffline, setIsOffline] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 9.03, lng: 38.74 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [isLocating, setIsLocating] = useState(false);
    const [locationModalState, setLocationModalState] = useState<'request' | 'locating' | 'error' | null>(null);
    const [locationErrorCode, setLocationErrorCode] = useState<number | null>(null);

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

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Photos state - store as base64 or URLs
    const [photos, setPhotos] = useState<Array<{ id: number; url: string }>>([]);

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

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Convert to base64 for now (in production, upload to S3)
                const base64 = await api.uploadFile(file);
                setPhotos([...photos, { id: Date.now(), url: base64 }]);
            } catch (err) {
                console.error("Error uploading file:", err);
                alert("Failed to upload image");
            }
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleAutofillLocation = () => {
        setLocationModalState('request');
    };

    const startLocating = () => {
        setLocationModalState('locating');
        setIsLocating(true);

        if (!navigator.geolocation) {
            setLocationModalState('error');
            setLocationErrorCode(0);
            setIsLocating(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        const successCallback = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setCoords({ lat: latitude, lng: longitude });
            setLocation(`Detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setIsLocating(false);
            setLocationModalState(null);
        };

        const errorCallback = (error: GeolocationPositionError) => {
            const errCode = error.code;
            const errMsg = error.message;

            if ((errCode === 3 || errCode === 2) && options.enableHighAccuracy) {
                console.warn("High accuracy geolocation timed out/failed, falling back to network...");
                navigator.geolocation.getCurrentPosition(successCallback, (fallbackError) => {
                    console.error(`Geolocation Final Error [${fallbackError.code}]: ${fallbackError.message}`);
                    setLocationErrorCode(fallbackError.code);
                    setLocationModalState('error');
                    setIsLocating(false);
                }, { enableHighAccuracy: false, timeout: 15000 });
                return;
            }

            console.error(`Geolocation Error [${errCode}]: ${errMsg}`);
            setLocationErrorCode(errCode);
            setLocationModalState('error');
            setIsLocating(false);
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!cropType || !quantity || !price) {
            setError("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const imageUrls = photos.map(p => p.url);

            const productData = {
                title: cropType || "Fresh Produce",
                description: description || undefined,
                category: cropType,
                price: Number(price),
                quantity: Number(quantity),
                minOrder: Number(quantity) * 0.1, // 10% of total as min order
                unit: unit === "Kilograms (Kg)" ? "kg" : unit.toLowerCase(),
                images: imageUrls.length > 0 ? imageUrls : undefined,
                location: location,
                latitude: coords.lat,
                longitude: coords.lng,
            };

            if (isOffline) {
                // Save to localStorage for offline sync
                const newListing = {
                    id: Date.now(),
                    ...productData,
                    farmer: user?.firstName + " " + user?.lastName || "Unknown",
                    status: 'offline',
                    syncStatus: 'pending',
                    image: imageUrls[0] || "/potatoes.png",
                    rating: 0,
                    soldQuantity: 0,
                    createdAt: new Date().toISOString()
                };

                const existingListings = JSON.parse(localStorage.getItem("local_listings") || "[]");
                localStorage.setItem("local_listings", JSON.stringify([newListing, ...existingListings]));

                alert("Saved locally! It will sync when online.");
                router.push("/listings");
            } else {
                // Submit to backend
                const response = await productApi.createProduct(productData);
                
                if (response.success) {
                    alert("Listing posted successfully!");
                    router.push("/listings");
                } else {
                    throw new Error(response.message || "Failed to create listing");
                }
            }
        } catch (err: any) {
            setError(extractErrorMessage(err) || "Failed to create listing. Please try again.");
            console.error("Error creating listing:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return null; // Will redirect
    }

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

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Offline Submission Status */}
                    {isOffline && (
                        <div className="rounded-2xl border border-green-100 bg-green-50/50 p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-100 p-2 text-green-700">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold text-green-800">Offline Submission Status</h3>
                            </div>
                            <p className="mt-3 text-sm text-green-700 font-medium">
                                Your listing will be saved locally and synced when you are online.
                            </p>
                        </div>
                    )}

                    {/* Section 2: Product Details */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                        <p className="mt-1 text-sm text-gray-500">Provide basic information about the produce you want to sell.</p>

                        <div className="mt-8 space-y-6">
                            {/* Crop Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Crop Type *</label>
                                <select
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm appearance-none"
                                    value={cropType}
                                    onChange={(e) => setCropType(e.target.value)}
                                    required
                                >
                                    <option value="">Select a crop</option>
                                    <option value="Tomatoes">Tomatoes</option>
                                    <option value="Coffee Beans">Coffee Beans</option>
                                    <option value="Potatoes">Potatoes</option>
                                    <option value="Teff Grain">Teff Grain</option>
                                    <option value="Wheat Grain">Wheat Grain</option>
                                    <option value="Barley Grain">Barley Grain</option>
                                    <option value="Onions">Onions</option>
                                    <option value="Cabbage">Cabbage</option>
                                    <option value="Carrots">Carrots</option>
                                    <option value="Bananas">Bananas</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700">Quantity *</label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 500"
                                        className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-bold text-gray-700 opacity-0 hidden sm:block">Unit</label>
                                    <select
                                        className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    >
                                        <option value="kg">Kilograms (Kg)</option>
                                        <option value="quintal">Quintals</option>
                                        <option value="box">Boxes</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Price per unit (ETB) *</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 2500"
                                    className="mt-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    min="1"
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
                        </div>
                    </div>

                    {/* Section 4: Location Details */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
                        <p className="mt-1 text-sm text-gray-500">Specify the origin of your produce for local buyers.</p>

                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Location *</label>
                                <div className="relative mt-2">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 focus:border-green-500 focus:ring-green-500 transition shadow-sm"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
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
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-green-600 py-4.5 text-lg font-bold text-white shadow-lg shadow-green-100 hover:bg-green-700 hover:-translate-y-0.5 transition active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Listing"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Camera Modal - Keep existing camera modal code */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">
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

            {/* Location Permission Modal - Keep existing location modal code */}
            {locationModalState && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl">
                        <button
                            onClick={() => setLocationModalState(null)}
                            className="absolute top-6 right-6 z-10 rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="p-8 pt-12 text-center">
                            {locationModalState === 'request' && (
                                <>
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 border-2 border-green-100">
                                        <MapPin className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Device Location Required</h3>
                                    <div className="mt-6 text-left space-y-4 rounded-3xl bg-gray-50 p-6 border border-gray-100">
                                        <div className="flex gap-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm shadow-sm">1</div>
                                            <p className="text-gray-700 leading-tight">Open your device's <b>Quick Settings</b> (swipe down from the top or open Settings).</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm shadow-sm">2</div>
                                            <p className="text-gray-700 leading-tight">Ensure <b>Location / GPS</b> is toggled <b>ON</b> so we can find your farm.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">3</div>
                                            <p className="text-gray-700 leading-tight text-blue-800">Once turned on, click the button below to automatically fill your address.</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        <button
                                            onClick={startLocating}
                                            className="w-full rounded-2xl bg-green-600 py-4 font-bold text-white hover:bg-green-700 transition shadow-lg shadow-green-100 active:scale-[0.98]"
                                        >
                                            Locate My Produce
                                        </button>
                                        <button
                                            onClick={() => setLocationModalState(null)}
                                            className="w-full rounded-2xl py-3 font-medium text-gray-400 hover:text-gray-600 transition"
                                        >
                                            Enter Manually
                                        </button>
                                    </div>
                                </>
                            )}
                            {locationModalState === 'locating' && (
                                <>
                                    <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                                        <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75"></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                                            <MapPin className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Finding Location...</h3>
                                    <p className="mt-4 text-gray-600">
                                        Communicating with satellites and network towers. This usually takes a few seconds.
                                    </p>
                                    <div className="mt-10">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div className="h-full w-1/3 animate-progress rounded-full bg-green-600"></div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {locationModalState === 'error' && (
                                <>
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
                                        <MapPin className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Location Missing</h3>
                                    <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left border border-gray-100">
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                                            <Info className="h-4 w-4 text-blue-500" />
                                            How to fix this:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            {locationErrorCode === 1 ? (
                                                <>
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold text-green-600">1.</span>
                                                        <span>Check your browser address bar for a blocked location icon and click <b>"Allow"</b>.</span>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold text-green-600">1.</span>
                                                        <span>Open your device's <b>Settings</b>.</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold text-green-600">2.</span>
                                                        <span>Search for <b>"Location Services"</b> and ensure the switch is <b>ON</b>.</span>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="mt-8 flex flex-col gap-3">
                                        <button
                                            onClick={startLocating}
                                            className="w-full rounded-2xl bg-gray-900 py-4 font-bold text-white hover:bg-black transition shadow-lg"
                                        >
                                            Try High Precision Again
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLocationModalState('locating');
                                                navigator.geolocation.getCurrentPosition(
                                                    (pos) => {
                                                        const { latitude, longitude } = pos.coords;
                                                        setCoords({ lat: latitude, lng: longitude });
                                                        setLocation(`Detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                                        setIsLocating(false);
                                                        setLocationModalState(null);
                                                    },
                                                    (err) => {
                                                        console.error("Low Accuracy Retry Failed", err);
                                                        setLocationErrorCode(err.code);
                                                        setLocationModalState('error');
                                                        setIsLocating(false);
                                                    },
                                                    { enableHighAccuracy: false, timeout: 10000 }
                                                );
                                            }}
                                            className="w-full rounded-2xl border-2 border-gray-900 py-3.5 font-bold text-gray-900 hover:bg-gray-50 transition"
                                        >
                                            Try WiFi/Network Only
                                        </button>
                                        <button
                                            onClick={() => setLocationModalState(null)}
                                            className="mt-2 w-full rounded-2xl py-2 font-medium text-gray-400 hover:text-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
