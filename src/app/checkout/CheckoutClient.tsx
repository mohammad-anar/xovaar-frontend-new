"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { removeFromCart, openCart, clearCart } from "@/redux/features/cart";
import { setUser } from "@/redux/features/auth";
import { useCreateOrderMutation } from "@/redux/service/order/orderApi";
import {
  User,
  Truck,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar,
  PhoneCall,
  MapPin,
  Clock,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface OrderSummaryData {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryNote: string;
  deliveryType: "inside" | "outside";
  deliveryFee: number;
  items: Array<{
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    size: string;
    quantity: number;
  }>;
  subtotal: number;
  total: number;
  orderDate: string;
}

export default function CheckoutClient() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart?.items) || [];
  const [createOrderMutation] = useCreateOrderMutation();

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderSummaryData | null>(null);

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 1),
    0
  );
  const hasFreeDelivery = cartItems.some((item) => item?.freeDelivery === true) || subtotal >= 3000;
  const standardDeliveryFee = deliveryMethod === "inside" ? 70 : 130;
  const deliveryFee = hasFreeDelivery ? 0 : standardDeliveryFee;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const cleanPhone = phoneNumber.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      newErrors.phoneNumber = "Mobile phone number is required";
    } else if (!/^01[3-9]\d{7,8}$/.test(cleanPhone)) {
      newErrors.phoneNumber = "Please enter a valid mobile number (e.g. 0162039613)";
    }

    if (!deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Full delivery address is required";
    } else if (deliveryAddress.trim().length < 10) {
      newErrors.deliveryAddress = "Please provide house, road, area, and city details";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Please add products before placing an order.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required delivery details properly.");
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const res = await createOrderMutation({
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryNote: deliveryNote.trim() || undefined,
        deliveryType: deliveryMethod,
        deliveryFee,
        paymentMethod: paymentMethod === "cod" ? "COD" : paymentMethod.toUpperCase(),
        items: cartItems.map((item) => ({
          productId: item.id && /^[0-9a-fA-F]{24}$/.test(item.id) ? item.id : undefined,
          title: item.title,
          price: item.price,
          imageUrl: item.imageUrl,
          size: item.size || "M",
          quantity: item.quantity,
        })),
      }).unwrap();

      const orderNumber = res.data?.orderNumber || `XV-0001`;
      const invoiceNumber = res.data?.invoice?.invoiceNumber || `INV-0001`;

      // Auto-login guest customer if auth payload was returned
      if (res.data?.auth) {
        const { user: authUser, accessToken, refreshToken } = res.data.auth;
        if (typeof document !== "undefined") {
          const maxAge = 30 * 24 * 60 * 60;
          document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
          document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
        dispatch(
          setUser({
            user: {
              userId: authUser.id,
              name: authUser.name,
              email: authUser.email || undefined,
              phone: authUser.phone || undefined,
              role: authUser.role?.toLowerCase() || "customer",
              isDefaultPassword: authUser.isDefaultPassword,
            },
            accessToken,
            refreshToken,
          })
        );
      }

      const orderRecord: OrderSummaryData = {
        orderId: orderNumber,
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryNote: deliveryNote.trim(),
        deliveryType: deliveryMethod,
        deliveryFee,
        items: [...cartItems],
        subtotal,
        total: grandTotal,
        orderDate: formattedDate,
      };

      setConfirmedOrder(orderRecord);
      dispatch(clearCart());
      toast.success("Order Placed Successfully!", {
        description: `Order ID ${orderNumber} confirmed! Invoice #${invoiceNumber} issued.`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Failed to place order. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order has been placed, show the Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="bg-[#faf6f2] min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-neutral-200/90 shadow-sm p-6 sm:p-10">
          {/* Top Success Badge */}
          <div className="text-center pb-8 border-b border-neutral-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={36} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A]">
              Order Confirmation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 uppercase tracking-tight">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto">
              Your order <span className="font-bold text-neutral-900">#{confirmedOrder.orderId}</span> has been placed successfully. A confirmation SMS will be sent to{" "}
              <span className="font-semibold text-neutral-900">{confirmedOrder.phoneNumber}</span>.
            </p>
          </div>

          {/* Delivery & Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-neutral-200 text-xs">
            <div className="space-y-3">
              <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin size={14} className="text-[#16A34A]" /> Delivery Address
              </h3>
              <div className="bg-neutral-50 p-4 border border-neutral-200/80 rounded-xs space-y-1 text-neutral-700">
                <p className="font-bold text-neutral-900">{confirmedOrder.customerName}</p>
                <p>{confirmedOrder.deliveryAddress}</p>
                <p className="flex items-center gap-1 text-neutral-600 pt-1">
                  <PhoneCall size={12} /> {confirmedOrder.phoneNumber}
                </p>
                {confirmedOrder.deliveryNote && (
                  <p className="text-[11px] text-neutral-500 italic pt-1">
                    Note: &ldquo;{confirmedOrder.deliveryNote}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock size={14} className="text-[#16A34A]" /> Order Summary
              </h3>
              <div className="bg-neutral-50 p-4 border border-neutral-200/80 rounded-xs space-y-2 text-neutral-700">
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span className="font-medium text-neutral-900">{confirmedOrder.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Method:</span>
                  <span className="font-medium text-neutral-900">
                    {confirmedOrder.deliveryType === "inside"
                      ? "Dhakar Vitore (24-48 hrs)"
                      : "Dhakar Bahire (2-4 days)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold text-[#16A34A] uppercase">Cash On Delivery</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-200 text-neutral-900 font-bold">
                  <span>Amount Payable:</span>
                  <span className="text-sm">৳ {confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="py-8 border-b border-neutral-200">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] mb-4 flex items-center gap-1.5">
              <Package size={14} className="text-[#16A34A]" /> Items Ordered ({confirmedOrder.items.length})
            </h3>
            <div className="divide-y divide-neutral-100">
              {confirmedOrder.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-16 bg-neutral-100 shrink-0 border border-neutral-200">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 uppercase line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Size: <span className="font-medium text-neutral-800">{item.size}</span> &bull; Qty:{" "}
                        <span className="font-medium text-neutral-800">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 shrink-0">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/profile"
              className="w-full sm:w-auto border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-black text-xs font-bold uppercase tracking-wider px-6 py-3.5 transition-colors text-center"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf6f2] min-h-[90vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title & Subtitle Matching Screenshot */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 uppercase tracking-tight">
            Checkout &amp; Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-normal">
            Fill in your delivery details &mdash; an account will be created automatically
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Form Details (Cols 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Customer Information */}
              <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
                {/* Header */}
                <div className="flex items-center gap-2.5 pb-5 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-xs bg-[#f0fdf4] text-[#166534] flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Customer Information
                    </h2>
                    <p className="text-[11px] text-neutral-500">
                      We will use these details to set up your order tracking portal
                    </p>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4 pt-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Full Name <span className="text-[#166534]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) {
                          setErrors((prev) => ({ ...prev, fullName: "" }));
                        }
                      }}
                      placeholder="e.g. Sadia Rahman"
                      className={`w-full bg-[#fbf9f6] border ${
                        errors.fullName ? "border-red-500" : "border-neutral-200"
                      } px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Mobile Phone Number <span className="text-[#166534]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) {
                          setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                        }
                      }}
                      placeholder="e.g. 017XXXXXXXX"
                      className={`w-full bg-[#fbf9f6] border ${
                        errors.phoneNumber ? "border-red-500" : "border-neutral-200"
                      } px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors`}
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Order SMS notifications &amp; courier tracking will be sent here
                    </p>
                    {errors.phoneNumber && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Delivery Address <span className="text-[#166534]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (errors.deliveryAddress) {
                          setErrors((prev) => ({ ...prev, deliveryAddress: "" }));
                        }
                      }}
                      placeholder="House #, Road #, Area, Police Station, City"
                      className={`w-full bg-[#fbf9f6] border ${
                        errors.deliveryAddress ? "border-red-500" : "border-neutral-200"
                      } px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors resize-none`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-[11px] text-red-600 mt-0.5">{errors.deliveryAddress}</p>
                    )}
                  </div>

                  {/* Delivery Note */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                      Delivery Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="Special instructions for courier..."
                      className="w-full bg-[#fbf9f6] border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Delivery Options Matching Screenshot */}
              <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-xs bg-[#f0fdf4] text-[#166534] flex items-center justify-center shrink-0">
                    <Truck size={16} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Delivery Options
                  </h2>
                </div>

                <div className="space-y-3 pt-4">
                  {/* Option 1: Inside Dhaka */}
                  <label
                    onClick={() => setDeliveryMethod("inside")}
                    className={`flex items-start justify-between p-4 cursor-pointer transition-all border ${
                      deliveryMethod === "inside"
                        ? "border-[#16A34A] bg-[#F0FDF4]"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            deliveryMethod === "inside"
                              ? "border-[#16A34A]"
                              : "border-neutral-400"
                          }`}
                        >
                          {deliveryMethod === "inside" && (
                            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          Dhakar Vitore (Inside Dhaka)
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Fast 24-48 hours standard courier delivery
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 shrink-0">
                      {hasFreeDelivery ? (
                        <span className="text-emerald-700 font-bold uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          FREE
                        </span>
                      ) : (
                        "৳ 70"
                      )}
                    </span>
                  </label>

                  {/* Option 2: Outside Dhaka */}
                  <label
                    onClick={() => setDeliveryMethod("outside")}
                    className={`flex items-start justify-between p-4 cursor-pointer transition-all border ${
                      deliveryMethod === "outside"
                        ? "border-[#16A34A] bg-[#F0FDF4]"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            deliveryMethod === "outside"
                              ? "border-[#16A34A]"
                              : "border-neutral-400"
                          }`}
                        >
                          {deliveryMethod === "outside" && (
                            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          Dhakar Bahire (Outside Dhaka)
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Nationwide courier across all 64 districts (2-4 days)
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 shrink-0">
                      {hasFreeDelivery ? (
                        <span className="text-emerald-700 font-bold uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          FREE
                        </span>
                      ) : (
                        "৳ 130"
                      )}
                    </span>
                  </label>
                </div>
              </div>

              {/* Card 3: Select Payment Method Matching Screenshot */}
              <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-4 border-b border-neutral-100">
                  Select Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  {/* Cash on Delivery (Active) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3.5 border transition-all text-center flex flex-col items-center justify-center min-h-[58px] cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-[#166534] bg-[#fdf9f7] text-neutral-900 shadow-2xs"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-xs font-bold tracking-wider uppercase">
                      Cash On Delivery
                    </span>
                  </button>

                  {/* bKash (Unavailable) */}
                  <div className="p-3.5 border border-dashed border-neutral-300 bg-neutral-50/70 text-neutral-400 text-center flex flex-col items-center justify-center min-h-[58px] cursor-not-allowed select-none">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      bKash
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      (Unavailable)
                    </span>
                  </div>

                  {/* Nagad (Unavailable) */}
                  <div className="p-3.5 border border-dashed border-neutral-300 bg-neutral-50/70 text-neutral-400 text-center flex flex-col items-center justify-center min-h-[58px] cursor-not-allowed select-none">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Nagad
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">
                      (Unavailable)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Items Summary (Cols 5) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-neutral-200/90 p-6 shadow-xs sticky top-24">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Order Items ({cartItems.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => dispatch(openCart())}
                    className="text-[11px] font-bold text-neutral-600 hover:text-black uppercase tracking-wider cursor-pointer underline underline-offset-2"
                  >
                    Edit Cart
                  </button>
                </div>

                {/* Items List */}
                <div className="py-4 space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center text-neutral-400 text-xs">
                      <ShoppingBag size={24} className="mx-auto mb-2 opacity-40" />
                      Your shopping bag is empty.
                      <div className="mt-3">
                        <Link
                          href="/shop"
                          className="text-[#166534] font-bold underline text-[11px]"
                        >
                          Browse Products
                        </Link>
                      </div>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-3 items-start justify-between pb-3 border-b border-neutral-100 last:border-0"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-12 h-16 bg-neutral-100 shrink-0 border border-neutral-200">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 uppercase line-clamp-1">
                              {item.title}
                            </h4>
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              Size: {item.size} &bull; Qty: {item.quantity}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  removeFromCart({ id: item.id, size: item.size })
                                )
                              }
                              className="text-[10px] uppercase font-bold text-[#166534] hover:underline mt-1 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-neutral-900 shrink-0">
                          ৳ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Breakdown Costs */}
                <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">
                      ৳ {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>
                      Delivery (
                      {deliveryMethod === "inside"
                        ? "Dhakar Vitore"
                        : "Dhakar Bahire"}
                      )
                    </span>
                    <span className="font-medium text-neutral-900">
                      {hasFreeDelivery ? (
                        <span className="text-emerald-700 font-bold uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          FREE
                        </span>
                      ) : (
                        `৳ ${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                    <span className="uppercase tracking-wider">Total Amount</span>
                    <span className="text-base text-neutral-900">
                      ৳ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>Confirm &amp; Place Order</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-neutral-400 text-center mt-2.5">
                    Account is automatically set up for your phone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}