"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  User,
  ShieldCheck,
  Truck,
  DollarSign,
  Save,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Bell,
} from "lucide-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateAdminProfileMutation,
  StoreSettings,
} from "@/redux/service/settings/settingsApi";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { data: apiSettings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isSavingSettings }] = useUpdateSettingsMutation();
  const [updateAdminProfile, { isLoading: isSavingProfile }] = useUpdateAdminProfileMutation();

  const [activeTab, setActiveTab] = useState<"store" | "profile">("store");
  const [settings, setSettings] = useState<Partial<StoreSettings>>({
    storeName: "XOVAAR",
    storeTagline: "Aura Streetwear & Minimalist Luxury",
    supportEmail: "support@xovaar.com",
    supportPhone: "+880 1700-000000",
    currency: "BDT (৳)",
    insideDhakaShipping: 70,
    outsideDhakaShipping: 130,
    freeShippingThreshold: 2500,
    noticeTicker: "FREE SHIPPING ON ORDERS OVER ৳2,500 | CASH ON DELIVERY AVAILABLE NATIONWIDE",
    adminName: "XOVAAR Admin",
    adminEmail: "admin@xovaar.com",
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (apiSettings?.data) {
      setSettings((prev) => ({ ...prev, ...apiSettings.data }));
    }
  }, [apiSettings]);

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settings).unwrap();
      toast.success("Store configurations updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save settings");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminProfile({
        name: settings.adminName,
        email: settings.adminEmail,
      }).unwrap();
      toast.success("Admin profile details saved!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in current and new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await updateAdminProfile({
        currentPassword,
        newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534]">
            System Configuration
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight uppercase mt-0.5">
            Admin Settings &amp; Profile
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Configure courier rates, store metadata, notice banner, and administrative security credentials.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#faf6f2] p-1 border border-neutral-200">
          <button
            onClick={() => setActiveTab("store")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "store"
                ? "bg-[#166534] text-white shadow-2xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Store Operations
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#166534] text-white shadow-2xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Admin Profile &amp; Security
          </button>
        </div>
      </div>

      {/* Tab 1: Store Operations */}
      {activeTab === "store" && (
        <form onSubmit={handleSaveStoreSettings} className="space-y-6">
          {/* Card: Courier & Shipping Rates */}
          <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-xs bg-[#f0fdf4] text-[#166534] flex items-center justify-center">
                <Truck size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Courier Delivery Rates (BDT)
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Rates configured here calculate automatically on Checkout and Cart Drawer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Dhakar Vitore (Inside Dhaka)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={settings.insideDhakaShipping}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        insideDhakaShipping: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#fbf9f6] border border-neutral-200 pl-8 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Fast 24-48 hours courier rate
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Dhakar Bahire (Outside Dhaka)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={settings.outsideDhakaShipping}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        outsideDhakaShipping: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#fbf9f6] border border-neutral-200 pl-8 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Nationwide courier (2-4 days)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Free Shipping Minimum
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        freeShippingThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#fbf9f6] border border-neutral-200 pl-8 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Orders over this amount get free shipping
                </p>
              </div>
            </div>
          </div>

          {/* Card: Brand & Customer Contacts */}
          <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-xs bg-[#f0fdf4] text-[#166534] flex items-center justify-center">
                <Settings size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Store Information &amp; Support
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Public customer details shown on Navbar, Footer, and Invoices
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value })
                  }
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.storeTagline}
                  onChange={(e) =>
                    setSettings({ ...settings, storeTagline: e.target.value })
                  }
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Support Hotline
                </label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, supportPhone: e.target.value })
                  }
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                Store Notice Marquee / Ticker Message
              </label>
              <textarea
                rows={2}
                value={settings.noticeTicker}
                onChange={(e) =>
                  setSettings({ ...settings, noticeTicker: e.target.value })
                }
                className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Save size={15} />
              <span>Save Store Configurations</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Admin Profile & Security */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Card 1: Profile Information */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-xs bg-[#f0fdf4] text-[#166534] flex items-center justify-center">
                <User size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Administrator Profile
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Identity details displayed across Admin logs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-full bg-[#111827] text-white font-bold flex items-center justify-center text-lg shadow-md">
                SA
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  {settings.adminName}
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Session
                  </span>
                </h4>
                <p className="text-xs text-neutral-500">{settings.adminEmail}</p>
                <p className="text-[10px] text-neutral-400 mt-1">Role: Super Administrator (Owner)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={settings.adminName}
                  onChange={(e) =>
                    setSettings({ ...settings, adminName: e.target.value })
                  }
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, adminEmail: e.target.value })
                  }
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors cursor-pointer"
              >
                Update Profile Info
              </button>
            </div>
          </form>

          {/* Card 2: Security & Password */}
          <form
            onSubmit={handleChangePassword}
            className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-2xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-xs bg-[#f0fdf4] text-[#166534] flex items-center justify-center">
                <Lock size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Change Password
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Update administrative authentication credentials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors cursor-pointer shadow-2xs"
              >
                Change Admin Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}