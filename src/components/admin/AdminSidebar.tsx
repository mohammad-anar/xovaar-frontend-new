"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { AdminStorage } from "@/services/adminStore";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    badge: "Live",
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    badge: null,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Layers,
    badge: null,
  },
  {
    name: "Hero Banners",
    href: "/admin/banners",
    icon: ImageIcon,
    badge: null,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    badge: "New",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    name: "Settings & Profile",
    href: "/admin/settings",
    icon: Settings,
    badge: null,
  },
];

export default function AdminSidebar({
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    AdminStorage.setAdminLoggedIn(false);
    window.location.href = "/";
  };

  const isExactActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111827] text-white border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-neutral-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative h-7 w-32 flex items-center overflow-visible">
              <Image
                src="/logo.png"
                alt="Xovaar"
                width={140}
                height={40}
                priority
                className="h-full w-auto object-contain scale-150 origin-left"
              />
            </div>
            <span className="text-[9px] bg-[#166534] text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest shrink-0 ml-2">
              Admin
            </span>
          </Link>

          <button
            onClick={onCloseMobile}
            className="lg:hidden text-neutral-400 hover:text-white p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            Main Menu
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isExactActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-[#166534] text-white shadow-sm font-bold"
                    : "text-neutral-300 hover:bg-neutral-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={active ? "text-white" : "text-neutral-400"}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#166534]/30 text-[#86efac]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            Store Links
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white transition-all font-medium"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={16} className="text-neutral-400" />
              <span>View Live Store</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">↗</span>
          </Link>
        </div>

        {/* Footer Admin Info & Logout */}
        <div className="p-4 border-t border-neutral-800 bg-[#0d121c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#166534] text-white font-bold flex items-center justify-center text-xs shadow-inner">
                SA
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                  Super Admin
                  <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  admin@xovaar.com
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-neutral-400 hover:text-red-400 p-1.5 rounded transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}