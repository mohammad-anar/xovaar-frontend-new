"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import { AdminStorage } from "@/services/adminStore";

interface AdminHeaderProps {
  onOpenMobile: () => void;
}

export default function AdminHeader({ onOpenMobile }: AdminHeaderProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    if (pathname.includes("/admin/analytics")) return "Analytics & Reports";
    if (pathname.includes("/admin/products")) return "Product Management";
    if (pathname.includes("/admin/categories")) return "Categories & Sub-Categories";
    if (pathname.includes("/admin/orders")) return "Order Management";
    if (pathname.includes("/admin/users")) return "User & Customer Management";
    if (pathname.includes("/admin/settings")) return "Settings & Admin Profile";
    return "Admin Panel";
  };

  const notifications = [
    {
      id: 1,
      title: "New order #XV-91338 received",
      time: "10 mins ago",
      icon: PackageCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: 2,
      title: "Low stock alert: Vintage Wash Tee",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: 3,
      title: "Order #XV-89421 delivered successfully",
      time: "3 hours ago",
      icon: CheckCircle,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile menu button & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#166534] font-semibold">
              {pathname.replace("/admin", "").replace("/", "") || "overview"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications, Store shortcut */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* View Store Shortcut */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black border border-neutral-300 hover:border-neutral-900 px-3 py-1.5 rounded transition-all"
        >
          <span>Live Store</span>
          <ExternalLink size={12} />
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#166534] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 shadow-xl rounded-md z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Notifications (3)
                  </span>
                  <span className="text-[10px] text-[#166534] font-semibold cursor-pointer">
                    Mark read
                  </span>
                </div>

                <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => {
                    const NIcon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="p-3 hover:bg-neutral-50 transition-colors flex items-start gap-3 cursor-pointer"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${n.color}`}
                        >
                          <NIcon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 line-clamp-1">
                            {n.title}
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-neutral-100 text-center bg-neutral-50/50">
                  <Link
                    href="/admin/orders"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] font-bold text-[#166534] hover:underline"
                  >
                    View All Orders &rarr;
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-[#111827] text-white font-bold flex items-center justify-center text-xs">
            SA
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-neutral-900 leading-tight">
              Admin
            </span>
            <span className="block text-[10px] text-neutral-500 font-medium">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}