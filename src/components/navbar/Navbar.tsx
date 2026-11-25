"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import XovaarLogo from "./XovaarLogo";
import { useGetNavCategoriesQuery } from "@/redux/service/banner/bannerApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { toggleCart } from "@/redux/features/cart";
import { logout } from "@/redux/features/auth";
import { AdminStorage } from "@/services/adminStore";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthModal from "@/components/auth/AuthModal";
import SendOtpModal from "@/components/auth/SendOtpModal";
import ResetPasswordModal from "@/components/auth/ResetPasswordModal";
import { toast } from "sonner";

const DEFAULT_CATEGORIES = [
  { id: "drop-shoulder", label: "DROP-SHOULDER T-SHIRTS", href: "/shop?sub=drop-shoulder" },
  { id: "sweat-shirts", label: "SWEAT SHIRTS", href: "/shop?sub=sweat" },
  { id: "hoodies", label: "HOODIES", href: "/shop?sub=hoodie" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<"login" | "signup">("login");
  const [sendOtpModalOpen, setSendOtpModalOpen] = useState(false);
  const [resetPassModalOpen, setResetPassModalOpen] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState("");
  const [recoveryOtpPreview, setRecoveryOtpPreview] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: apiCategories } = useGetNavCategoriesQuery();
  const rawCategories = apiCategories?.data || DEFAULT_CATEGORIES;
  const categories = rawCategories.filter(
    (cat) => cat.id !== "all-men" && cat.label.trim().toUpperCase() !== "MEN"
  );

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check URL query for ?auth=admin (redirected from admin guard)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "admin") {
        setAuthModalInitialView("login");
        setAuthModalOpen(true);
      }
    }
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    dispatch(logout());
    AdminStorage.setAdminLoggedIn(false);
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/70 select-none shadow-2xs">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 gap-3">
            {/* Left: Mobile hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-neutral-700 hover:text-black focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <XovaarLogo />
            </div>

            {/* Center: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
              <Link
                href="/shop"
                className="px-3 py-1.5 border border-black bg-transparent text-black hover:bg-black hover:text-white text-[11px] xl:text-xs font-bold uppercase tracking-wider rounded-xs transition-all duration-200 flex items-center gap-1.5"
              >
                <ShoppingBag size={13} className="shrink-0" />
                <span>Shop Now</span>
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="text-[12px] xl:text-[13px] font-bold tracking-wide transition-colors duration-150 whitespace-nowrap text-neutral-800 hover:text-black relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform py-1"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Tablet/Compact Shop Now button */}
              <Link
                href="/shop"
                className="hidden sm:inline-flex lg:hidden px-3 py-1 border border-black bg-transparent text-black hover:bg-black hover:text-white text-[11px] font-bold uppercase tracking-wider rounded-xs transition-all duration-200 items-center gap-1"
              >
                <ShoppingBag size={12} className="shrink-0" />
                <span>Shop Now</span>
              </Link>

              {/* Action items: Profile/Login, Wishlist, Bag Drawer */}
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                {/* Profile or Login Trigger */}
                {!user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalInitialView("login");
                      setAuthModalOpen(true);
                    }}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none"
                    title="Sign In to your account"
                  >
                    <LogIn
                      size={17}
                      className="text-neutral-800 stroke-[1.8] group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[10px] text-neutral-800 font-bold tracking-tight mt-0.5">
                      Login
                    </span>
                  </button>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex flex-col items-center group cursor-pointer focus:outline-none"
                      aria-expanded={profileDropdownOpen}
                      aria-label="Account menu"
                    >
                      <div className="relative">
                        <User
                          size={17}
                          className="text-neutral-900 stroke-[1.9] group-hover:scale-110 transition-transform"
                        />
                        {user.role === "admin" && (
                          <span
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#16A34A] ring-2 ring-white"
                            title="Administrator Account"
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-900 font-bold tracking-tight mt-0.5 max-w-[55px] truncate">
                        {user.name ? user.name.split(" ")[0] : "Account"}
                      </span>
                    </button>

                    {/* Sharp Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-300 rounded-none shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                        {/* User Identity Header */}
                        <div className="px-3.5 py-2.5 border-b border-neutral-100 bg-[#faf8f5]">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-extrabold text-neutral-900 truncate">
                              {user.name || "Customer Account"}
                            </p>
                            {user.role === "admin" && (
                              <span className="px-1.5 py-0.2 bg-purple-100 text-purple-900 border border-purple-300 text-[8.5px] font-black uppercase rounded-none shadow-2xs">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                            {user.email || user.phone || "Active Member"}
                          </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors font-semibold"
                          >
                            <User size={14} className="text-neutral-500" />
                            <span>My Profile</span>
                          </Link>

                          {/* Admin Dashboard Link - ONLY if user is admin */}
                          {user.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3.5 py-2 text-[#166534] hover:bg-[#f0fdf4] transition-colors font-extrabold border-l-2 border-[#16A34A]"
                            >
                              <LayoutDashboard size={14} className="text-[#166534]" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}

                          <Link
                            href="/wishlist"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors font-semibold"
                          >
                            <Heart size={14} className="text-neutral-500" />
                            <span>My Wishlist ({totalWishlistCount})</span>
                          </Link>
                        </div>

                        {/* Logout Option */}
                        <div className="border-t border-neutral-100 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-600 hover:bg-red-50 transition-colors font-bold text-left cursor-pointer"
                          >
                            <LogOut size={14} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Wishlist Link */}
                <Link
                  href="/wishlist"
                  className="flex flex-col items-center group relative cursor-pointer"
                >
                  <div className="relative">
                    <Heart
                      size={17}
                      className="text-neutral-800 stroke-[1.6] group-hover:scale-110 transition-transform"
                    />
                    {totalWishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 bg-[#16A34A] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                        {totalWishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-700 font-medium tracking-tight mt-0.5">
                    Wishlist
                  </span>
                </Link>

                {/* Bag Drawer Trigger */}
                <button
                  type="button"
                  onClick={() => dispatch(toggleCart())}
                  className="flex flex-col items-center group relative cursor-pointer"
                >
                  <div className="relative">
                    <ShoppingBag
                      size={17}
                      className="text-neutral-800 stroke-[1.6] group-hover:scale-110 transition-transform"
                    />
                    <span className="absolute -top-1 -right-1.5 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {totalCartCount}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-700 font-medium tracking-tight mt-0.5">
                    Bag
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            {/* Top Action in Mobile Drawer: Login button or User Profile Banner */}
            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalInitialView("login");
                  setAuthModalOpen(true);
                }}
                className="w-full h-10 bg-neutral-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mb-2"
              >
                <LogIn size={14} />
                <span>Sign In / Create Account</span>
              </button>
            ) : (
              <div className="p-3 bg-[#faf8f5] border border-neutral-200 rounded-none mb-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-neutral-900">{user.name || "Customer Account"}</span>
                  {user.role === "admin" && (
                    <span className="px-1.5 py-0.2 bg-purple-100 text-purple-900 border border-purple-300 text-[8.5px] font-black uppercase">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-neutral-500 mt-0.5 truncate">
                  {user.email || user.phone}
                </p>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 w-full py-1.5 bg-[#16A34A] text-white text-[11px] font-bold uppercase rounded-none flex items-center justify-center gap-1.5 tracking-wider"
                  >
                    <LayoutDashboard size={13} />
                    <span>Go to Admin Dashboard</span>
                  </Link>
                )}
              </div>
            )}

            {/* Shop Now Primary Button in Mobile Menu */}
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-9 border border-black bg-transparent text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all duration-200 mb-3"
            >
              <ShoppingBag size={14} />
              <span>Shop Now</span>
            </Link>

            <div className="flex flex-col space-y-2.5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm py-1.5 font-bold tracking-wide text-neutral-900"
                >
                  {cat.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2 text-xs font-semibold">
                {user && (
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-neutral-800 flex items-center gap-2 py-1"
                  >
                    <User size={15} /> My Profile
                  </Link>
                )}
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-800 flex items-center gap-2 py-1"
                >
                  <Heart size={15} /> My Wishlist ({totalWishlistCount})
                </Link>
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-red-600 flex items-center gap-2 py-1 font-bold text-left cursor-pointer"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Navbar Height Placeholder to preserve normal document flow without jitter */}
      <div className="h-14 md:h-16 w-full shrink-0" aria-hidden="true" />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Sharp Authentication Modal (Login & Signup) */}
      <AuthModal
        isOpen={authModalOpen}
        initialView={authModalInitialView}
        onClose={() => setAuthModalOpen(false)}
        onForgotPassword={() => {
          setAuthModalOpen(false);
          setSendOtpModalOpen(true);
        }}
      />

      {/* Sharp Send OTP Modal (Account Recovery) */}
      <SendOtpModal
        isOpen={sendOtpModalOpen}
        onClose={() => setSendOtpModalOpen(false)}
        onBackToLogin={() => {
          setSendOtpModalOpen(false);
          setAuthModalInitialView("login");
          setAuthModalOpen(true);
        }}
        onOtpSent={(identifier, previewOtp) => {
          setSendOtpModalOpen(false);
          setRecoveryIdentifier(identifier);
          setRecoveryOtpPreview(previewOtp || "");
          setResetPassModalOpen(true);
        }}
      />

      {/* Sharp Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPassModalOpen}
        identifier={recoveryIdentifier}
        initialOtp={recoveryOtpPreview}
        onClose={() => setResetPassModalOpen(false)}
        onBackToSendOtp={() => {
          setResetPassModalOpen(false);
          setSendOtpModalOpen(true);
        }}
        onSuccess={() => {
          setResetPassModalOpen(false);
          setAuthModalInitialView("login");
          setAuthModalOpen(true);
        }}
      />
    </>
  );
}
