"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Eye,
  Printer,
  X,
  FileText,
  PhoneCall,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import OrderPrintInvoice from "@/components/invoice/OrderPrintInvoice";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { useGetMyOrdersQuery } from "@/redux/service/order/orderApi";
import { useGetMeQuery } from "@/redux/service/user/userApi";
import {
  useSendOtpMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
} from "@/redux/service/auth/authApi";
import { toast } from "sonner";

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
}

export interface OrderItemDetail {
  id?: string;
  title: string;
  size?: string;
  quantity?: number;
  price?: number;
  imageUrl?: string;
}

export interface UserOrder {
  id: string;
  date: string;
  status: string;
  itemsCount: number;
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  deliveryNote?: string;
  paymentMethod?: string;
  deliveryType?: "inside" | "outside";
  items: Array<string | OrderItemDetail>;
}

const SAMPLE_ORDERS: UserOrder[] = [
  {
    id: "FL-89421",
    date: "20 Nov 2026, 02:45 PM",
    status: "DELIVERED",
    itemsCount: 2,
    subtotal: 2980.0,
    deliveryFee: 70.0,
    total: 3050.0,
    customerName: "Tanzid Mahmud",
    customerPhone: "+880 1712-345678",
    deliveryAddress: "House 42, Road 11, Banani, Dhaka-1213",
    paymentMethod: "Cash On Delivery",
    deliveryType: "inside",
    items: [
      {
        title: "Men Oversized Heavyweight Drop-Shoulder Tee - Charcoal",
        size: "L",
        quantity: 1,
        price: 790.0,
      },
      {
        title: "Men Heavyweight Fleece Pullover Hoodie - Charcoal Heather",
        size: "XL",
        quantity: 1,
        price: 2190.0,
      },
    ],
  },
  {
    id: "FL-87114",
    date: "04 Nov 2026, 11:30 AM",
    status: "DELIVERED",
    itemsCount: 1,
    subtotal: 1250.0,
    deliveryFee: 70.0,
    total: 1320.0,
    customerName: "Tanzid Mahmud",
    customerPhone: "+880 1712-345678",
    deliveryAddress: "House 42, Road 11, Banani, Dhaka-1213",
    paymentMethod: "Cash On Delivery",
    deliveryType: "inside",
    items: [
      {
        title: "Men French Terry Ribbed Sweat Shirt - Cream Stone",
        size: "M",
        quantity: 1,
        price: 1250.0,
      },
    ],
  },
  {
    id: "FL-90245",
    date: "24 Nov 2026, 09:15 AM",
    status: "SHIPPED",
    itemsCount: 1,
    subtotal: 2390.0,
    deliveryFee: 130.0,
    total: 2520.0,
    customerName: "Tanzid Mahmud",
    customerPhone: "+880 1712-345678",
    deliveryAddress: "House 42, Road 11, Banani, Dhaka-1213",
    paymentMethod: "Cash On Delivery",
    deliveryType: "outside",
    items: [
      {
        title: "Men Premium Half-Zip Thermal Fleece Hoodie - Rust Brick",
        size: "L",
        quantity: 1,
        price: 2390.0,
      },
    ],
  },
];

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState<
    "orders" | "details" | "addresses" | "security"
  >("orders");

  const { data: apiOrders } = useGetMyOrdersQuery();
  const { data: meData } = useGetMeQuery();

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Security & Password change states
  const [sendOtpMutation, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [resetPasswordMutation, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Hook must be called unconditionally before any early returns (Rules of Hooks)
  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "Tanzid Mahmud",
      email: "tanzid.mahmud@example.com",
      phone: "+880 1712-345678",
      gender: "Male",
      address: "House 42, Road 11, Banani, Dhaka-1213",
    },
  });

  useEffect(() => {
    if (meData?.data) {
      reset({
        name: meData?.data?.name || "Tanzid Mahmud",
        email: meData?.data?.email || "tanzid.mahmud@example.com",
        phone: meData?.data?.phone || "+880 1712-345678",
        gender: "Male",
        address: "House 42, Road 11, Banani, Dhaka-1213",
      });
    }
  }, [meData, reset]);

  useEffect(() => {
    if (apiOrders?.data && Array.isArray(apiOrders.data) && apiOrders.data.length > 0) {
      const mappedApiOrders: UserOrder[] = apiOrders.data.map((o) => ({
        id: o?.orderNumber || o?.id || "ORDER",
        date: o?.createdAt ? new Date(o.createdAt).toLocaleDateString("en-BD", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) : "N/A",
        status: o?.status,
        itemsCount: o?.items?.length || 0,
        subtotal: o?.subtotal || 0,
        deliveryFee: o?.deliveryFee || 0,
        total: o?.total || 0,
        customerName: o?.customerName || "",
        customerPhone: o?.phoneNumber || "",
        deliveryAddress: o?.deliveryAddress || "",
        deliveryNote: o?.deliveryNote || undefined,
        paymentMethod: o?.paymentMethod === "COD" ? "Cash On Delivery" : (o?.paymentMethod || "COD"),
        deliveryType: (o?.deliveryType as "inside" | "outside") || "inside",
        items: (o?.items || []).map((it) => ({
          id: it?.id || "",
          title: it?.title || "",
          size: it?.size || "",
          quantity: it?.quantity || 1,
          price: it?.price || 0,
          imageUrl: it?.imageUrl || "",
        })),
      }));
      setOrders(mappedApiOrders);
      setIsInitialLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsInitialLoading(false);
      }
    } else {
      setIsInitialLoading(false);
    }
  }, [apiOrders]);

  if (isInitialLoading) {
    return <ProfileSkeleton />;
  }

  const handlePrintInvoice = () => {
    toast.info("Opening print dialog...", {
      description: "Select 'Save as PDF' to download or select your printer.",
    });
    window.print();
  };

  const parseItemInfo = (it: string | OrderItemDetail, index: number, orderTotal: number) => {
    if (typeof it === "string") {
      const match = it.match(/^(.*?)(?:\s*\((.*?)\))?(?:\s*x(\d+))?$/);
      const title = match && match[1] ? match[1].trim() : it;
      const size = match && match[2] ? match[2] : "M";
      const quantity = match && match[3] ? parseInt(match[3]) : 1;
      const approxPrice = Math.max(300, Math.round((orderTotal - 70) / (index + 1)));
      return {
        title,
        size,
        quantity,
        price: approxPrice,
        total: approxPrice * quantity,
      };
    }
    const quantity = it.quantity || 1;
    const price = it.price || 790;
    return {
      title: it.title,
      size: it.size || "M",
      quantity,
      price,
      total: price * quantity,
    };
  };

  const onUpdateProfile = (data: ProfileFormValues) => {
    toast.success("Profile updated successfully!", {
      description: `Name updated to ${data.name}`,
    });
  };

  const handleLogout = () => {
    toast.info("Logged out successfully");
  };

  return (
    <div className="w-full bg-[#fbfbfb] py-8 sm:py-12 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Header Card */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
              TM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-neutral-900">
                  Tanzid Mahmud
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck size={11} /> Verified Member
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                tanzid.mahmud@example.com • Member since 2024
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors py-1.5 px-3 rounded hover:bg-neutral-50 border border-neutral-200 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
            <div className="p-3 bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Account Menu
            </div>
            <nav className="divide-y divide-neutral-100">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package size={16} />
                  <span>My Orders</span>
                </div>
                <span className="text-[10px] opacity-75">{orders.length} orders</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  <span>Profile Information</span>
                </div>
                <ChevronRight size={14} className="opacity-40" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Delivery Addresses</span>
                </div>
                <ChevronRight size={14} className="opacity-40" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "security"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock size={16} />
                  <span>Security & Password</span>
                </div>
                <ChevronRight size={14} className="opacity-40" />
              </button>
            </nav>
          </div>

          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-lg p-6 shadow-xs">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h2 className="text-base font-bold text-neutral-900">
                    Order History
                  </h2>
                  <span className="text-xs text-neutral-500">
                    Showing latest {orders.length} orders
                  </span>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-neutral-200 rounded-lg p-4 space-y-3 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-extrabold text-neutral-900">
                            Order #{order.id}
                          </span>
                          <span className="text-neutral-400 mx-1.5">•</span>
                          <span className="text-neutral-500">{order.date}</span>
                        </div>
                        <div>
                          {order.status === "DELIVERED" || order.status === "Delivered" ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={12} /> DELIVERED
                            </span>
                          ) : order.status === "CANCELED" || order.status === "Cancelled" ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              <AlertCircle size={12} /> CANCELED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                              <Clock size={12} /> {order.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded">
                        <p className="font-medium text-neutral-800 mb-1">
                          Items Ordered ({order.itemsCount || order.items.length}):
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-neutral-600">
                          {order.items.map((it, idx) => {
                            const info = parseItemInfo(it, idx, order.total);
                            return (
                              <li key={idx}>
                                {info.title} ({info.size}) x{info.quantity}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Bottom Row with Price on Left and View Order button on Right */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-neutral-100">
                        <div className="text-xs">
                          <span className="text-neutral-500">
                            Total Amount Paid:{" "}
                          </span>
                          <span className="font-extrabold text-sm text-neutral-900">
                            ৳ {order.total.toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-all shadow-2xs hover:shadow cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>View Order</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Details Tab */}
            {activeTab === "details" && (
              <form
                onSubmit={handleSubmit(onUpdateProfile)}
                className="space-y-5"
              >
                <div className="pb-3 border-b border-neutral-100">
                  <h2 className="text-base font-bold text-neutral-900">
                    Personal Information
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Update your personal profile information and contact info.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">
                    Default Shipping Address
                  </label>
                  <textarea
                    rows={3}
                    {...register("address")}
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded transition-colors shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h2 className="text-base font-bold text-neutral-900">
                    Saved Addresses
                  </h2>
                  <button
                    type="button"
                    onClick={() => toast.info("Add new address modal opened")}
                    className="text-xs font-bold text-[#16A34A] hover:underline"
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-neutral-900 rounded-lg p-4 space-y-2 relative bg-neutral-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Home (Default)
                      </span>
                      <span className="bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Primary
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      House 42, Road 11, Block D<br />
                      Banani, Dhaka-1213<br />
                      Phone: +880 1712-345678
                    </p>
                  </div>

                  <div className="border border-neutral-200 rounded-lg p-4 space-y-2 relative hover:border-neutral-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Office
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Level 8, Crystal Point, Gulshan-2<br />
                      Dhaka-1212<br />
                      Phone: +880 1712-345678
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-neutral-100">
                  <h2 className="text-base font-bold text-neutral-900">
                    Security & Password
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Ensure your account is protected with two-factor email verification.
                  </p>
                </div>

                {!meData?.data?.email ? (
                  <div className="bg-amber-50 border border-amber-300 p-4 text-xs text-amber-900 flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-bold uppercase tracking-wider text-[11px]">
                        Email Required for Password Change
                      </p>
                      <p className="leading-relaxed">
                        Tumi tumar password change korte caile email add koro. Please add your email address first in your profile details so you can receive an OTP verification code and change your password.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("details")}
                        className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors"
                      >
                        Add Email in Profile Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div className="bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-700">
                      <p className="font-semibold text-neutral-900">Verification Target:</p>
                      <p className="text-neutral-600 font-mono mt-0.5">{meData.data.email}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded-none text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        New Password * <span className="text-[10px] text-neutral-400 font-normal">(min 6 chars)</span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded-none text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-10 px-3 bg-neutral-50 border border-neutral-300 rounded-none text-xs focus:bg-white focus:outline-none"
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        disabled={isSendingOtp}
                        onClick={async () => {
                          if (!currentPassword) {
                            toast.error("Please enter your current password");
                            return;
                          }
                          if (!newPassword || newPassword.length < 6) {
                            toast.error("New password must be at least 6 characters");
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            toast.error("Passwords do not match");
                            return;
                          }

                          try {
                            await sendOtpMutation({ identifier: meData.data.email }).unwrap();
                            setOtpSent(true);
                            toast.success("Verification code sent to your email!");
                          } catch (err: any) {
                            toast.error(err?.data?.message || "Failed to send OTP code");
                          }
                        }}
                        className="bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors disabled:opacity-50"
                      >
                        {isSendingOtp ? "Sending OTP..." : "Send Verification Code to Email"}
                      </button>
                    ) : (
                      <div className="space-y-3 pt-2 border-t border-neutral-200">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-neutral-900">
                            Enter 6-Digit Email OTP Code *
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full h-10 px-3 bg-neutral-50 border border-neutral-400 font-mono tracking-widest text-center text-sm rounded-none focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isResettingPassword}
                            onClick={async () => {
                              if (!otpCode || otpCode.trim().length !== 6) {
                                toast.error("Please enter the 6-digit OTP code");
                                return;
                              }
                              try {
                                await resetPasswordMutation({
                                  identifier: meData.data.email,
                                  otp: otpCode.trim(),
                                  newPassword: newPassword.trim(),
                                }).unwrap();
                                toast.success("Password changed successfully!");
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setOtpCode("");
                                setOtpSent(false);
                              } catch (err: any) {
                                toast.error(err?.data?.message || "Invalid OTP code");
                              }
                            }}
                            className="bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors disabled:opacity-50"
                          >
                            {isResettingPassword ? "Verifying..." : "Verify & Change Password"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-xs text-neutral-500 hover:text-black underline px-2 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details & Tax Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 max-w-2xl w-full shadow-2xl rounded-md overflow-hidden my-6">
            {/* Modal Top Action Bar (Hidden on print) */}
            <div className="no-print bg-[#111827] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#86efac]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Order Details &amp; Tax Invoice
                </span>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-neutral-300">
                  #{selectedOrder.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={13} />
                  <span>Print Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <OrderPrintInvoice
              order={{
                id: selectedOrder.id,
                customerName: selectedOrder.customerName || "Tanzid Mahmud",
                phoneNumber: selectedOrder.customerPhone || "0162039613",
                deliveryAddress: selectedOrder.deliveryAddress || "House 42, Road 11, Banani, Dhaka-1213",
                deliveryType: selectedOrder.deliveryType || "inside",
                deliveryFee: selectedOrder.deliveryFee || (selectedOrder.deliveryType === "outside" ? 130 : 70),
                subtotal: selectedOrder.subtotal || selectedOrder.total - (selectedOrder.deliveryFee || 70),
                total: selectedOrder.total,
                status: selectedOrder.status,
                date: selectedOrder.date,
                paymentMethod: selectedOrder.paymentMethod || "Cash On Delivery",
                items: selectedOrder.items.map((it, idx) => {
                  const itemInfo = parseItemInfo(it, idx, selectedOrder.total);
                  return {
                    id: `item-${idx}`,
                    title: itemInfo.title,
                    price: itemInfo.price,
                    quantity: itemInfo.quantity,
                    size: itemInfo.size,
                  };
                }),
              }}
            />

            {/* Modal Bottom Action Bar (Hidden on print) */}
            <div className="no-print bg-neutral-50 px-6 py-3.5 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                You can save this invoice as PDF or print directly.
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider px-5 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
