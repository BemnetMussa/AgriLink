"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, CheckCircle, Globe } from "lucide-react";

export default function ProfileSetupPage() {
  const [userType, setUserType] = useState<"farmer" | "buyer" | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    kebele: "",
    woreda: "",
    zone: "",
    primaryCrops: [] as string[],
  });
  const [language, setLanguage] = useState("english");
  const router = useRouter();

  const crops = ["Teff", "Wheat", "Barley", "Maize", "Coffee", "Vegetables"];

  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter(c => c !== crop)
        : [...prev.primaryCrops, crop]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType || !formData.fullName) {
      alert("Please select account type and enter your full name");
      return;
    }

    // TODO: Submit profile data to backend
    console.log({ userType, ...formData });
    
    // Redirect to dashboard based on user type
    setTimeout(() => {
      router.push(`/dashboard/${userType}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-500" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="english">English</option>
              <option value="amharic">አማርኛ</option>
              <option value="oromo">Afaan Oromoo</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 text-sm">
            Tell us more about yourself to get started
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Account Type
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType("farmer")}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                userType === "farmer"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="p-2 bg-green-100 rounded-full">
                <User size={24} className="text-green-600" />
              </div>
              <span className="font-medium text-gray-900">Farmer</span>
              <span className="text-xs text-gray-500 text-center">
                Sell your crops directly
              </span>
            </button>

            <button
              type="button"
              onClick={() => setUserType("buyer")}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                userType === "buyer"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="p-2 bg-blue-100 rounded-full">
                <User size={24} className="text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Buyer</span>
              <span className="text-xs text-gray-500 text-center">
                Purchase fresh produce
              </span>
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border">
          {/* Full Name */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} />
                Kebele
              </label>
              <input
                type="text"
                value={formData.kebele}
                onChange={(e) => setFormData({...formData, kebele: e.target.value})}
                placeholder="Bole Sub City"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} />
                Woreda
              </label>
              <input
                type="text"
                value={formData.woreda}
                onChange={(e) => setFormData({...formData, woreda: e.target.value})}
                placeholder="Woreda 03"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} />
              Zone
            </label>
            <input
              type="text"
              value={formData.zone}
              onChange={(e) => setFormData({...formData, zone: e.target.value})}
              placeholder="Addis Ababa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Primary Crops (only show for farmers) */}
          {userType === "farmer" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Primary Crops
              </label>
              <div className="flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => handleCropToggle(crop)}
                    className={`px-4 py-2 rounded-full text-sm border ${
                      formData.primaryCrops.includes(crop)
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verification Badge */}
          <div className="mb-6 p-3 bg-green-50 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700">Verified Farmer</p>
              <p className="text-xs text-green-600">Your identity has been verified</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!userType || !formData.fullName}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}