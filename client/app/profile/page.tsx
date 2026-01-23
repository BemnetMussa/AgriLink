"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, MapPin, Save, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, authApi } from "@/lib/api";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    language: "english",
  });

  const [farmerProfile, setFarmerProfile] = useState({
    farmName: "",
    farmLocation: "",
  });

  const [buyerProfile, setBuyerProfile] = useState({
    businessName: "",
    businessType: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          language: user.language?.toLowerCase() || "english",
        });
        
        // Fetch full user data with farmer/buyer profiles
        try {
          const response = await userApi.getMe();
          if (response.success && response.data) {
            const fullUser = response.data;
            
            // Load farmer profile if exists
            if (fullUser.farmerProfile) {
              setFarmerProfile({
                farmName: fullUser.farmerProfile.farmName || "",
                farmLocation: fullUser.farmerProfile.farmLocation || "",
              });
            }
            
            // Load buyer profile if exists
            if (fullUser.buyerProfile) {
              setBuyerProfile({
                businessName: fullUser.buyerProfile.businessName || "",
                businessType: fullUser.buyerProfile.businessType || "",
                address: fullUser.buyerProfile.address || "",
              });
            }
          }
        } catch (err) {
          console.error("Failed to load profile data:", err);
        }
      }
    };
    
    loadUserData();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Update basic profile
      await userApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        language: formData.language,
      });

      // Update role-specific profile
      if (user?.role === 'FARMER') {
        await userApi.updateFarmerProfile({
          farmName: farmerProfile.farmName || undefined,
          farmLocation: farmerProfile.farmLocation || undefined,
        });
      } else if (user?.role === 'BUYER') {
        await userApi.updateBuyerProfile({
          businessName: buyerProfile.businessName || undefined,
          businessType: buyerProfile.businessType || undefined,
          address: buyerProfile.address || undefined,
        });
      }

      await refreshUser();
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(extractErrorMessage(err) || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.changePassword(passwordData.oldPassword, passwordData.newPassword);
      setSuccess("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordSection(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(extractErrorMessage(err) || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 text-green-600 hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} />
            Personal Information
          </h2>

          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                >
                  <option value="english">English</option>
                  <option value="amharic">አማርኛ</option>
                  <option value="oromo">Afaan Oromoo</option>
                </select>
              </div>

              {/* Farmer Profile Fields */}
              {user?.role === 'FARMER' && (
                <div className="pt-4 border-t">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Farm Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        value={farmerProfile.farmName}
                        onChange={(e) => setFarmerProfile({...farmerProfile, farmName: e.target.value})}
                        placeholder="Enter your farm name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Location
                      </label>
                      <input
                        type="text"
                        value={farmerProfile.farmLocation}
                        onChange={(e) => setFarmerProfile({...farmerProfile, farmLocation: e.target.value})}
                        placeholder="e.g., Addis Ababa, Ethiopia"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Profile Fields */}
              {user?.role === 'BUYER' && (
                <div className="pt-4 border-t">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={buyerProfile.businessName}
                        onChange={(e) => setBuyerProfile({...buyerProfile, businessName: e.target.value})}
                        placeholder="Enter your business name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <input
                        type="text"
                        value={buyerProfile.businessType}
                        onChange={(e) => setBuyerProfile({...buyerProfile, businessType: e.target.value})}
                        placeholder="e.g., Retail, Wholesale, Restaurant"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <input
                        type="text"
                        value={buyerProfile.address}
                        onChange={(e) => setBuyerProfile({...buyerProfile, address: e.target.value})}
                        placeholder="Enter your business address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock size={20} />
              Password
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowPasswordSection(!showPasswordSection);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setError("");
              }}
              className="text-sm text-green-600 hover:underline"
            >
              {showPasswordSection ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must contain uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                    minLength={8}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {!showPasswordSection && (
            <p className="text-sm text-gray-500">
              {user.passwordHash 
                ? "Your password is set. Click 'Change Password' to update it."
                : "No password set. You can set one during profile setup or use OTP login."}
            </p>
          )}
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-medium text-gray-900">+251 {user.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
