"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useGetProductsQuery,
  DEFAULT_NEW_ARRIVALS,
  ProductItem,
} from "@/redux/service/product/productApi";
import { AdminStorage } from "@/services/adminStore";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/skeleton";
import { Search, ArrowUpDown, ChevronRight, X } from "lucide-react";

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") || "";
  const subParam = searchParams.get("sub") || "";

  // Local state for top-bar search and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // RTK Query hook (direct fetching without Next server API)
  const { data: apiData, isLoading } = useGetProductsQuery({
    category: categoryParam || "Men",
    search: searchTerm || undefined,
    sort: sortBy !== "default" ? sortBy : undefined,
  });

  // Client-side fallback computation for seamless offline/mock mode
  const filteredProducts = useMemo(() => {
    if (apiData?.data && apiData.data.length > 0) {
      return apiData.data;
    }

    let list: ProductItem[] =
      typeof window !== "undefined"
        ? [...AdminStorage.getProducts()]
        : [...DEFAULT_NEW_ARRIVALS];

    if (subParam) {
      const cleanSub = subParam.toLowerCase().replace(/[\s-_]/g, "");
      const isSweatFilter = cleanSub.includes("sweat") || cleanSub.includes("sweet");
      list = list.filter((item) => {
        const itemSub = (item.subCategory || "").toLowerCase().replace(/[\s-_]/g, "");
        const itemTitle = (item.title || "").toLowerCase().replace(/[\s-_]/g, "");
        if (isSweatFilter) {
          return (
            itemSub.includes("sweat") ||
            itemSub.includes("sweet") ||
            itemTitle.includes("sweat") ||
            itemTitle.includes("sweet")
          );
        }
        return (
          itemSub.includes(cleanSub) ||
          cleanSub.includes(itemSub) ||
          itemTitle.includes(cleanSub)
        );
      });
    }

    // Filter by top-bar search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.subCategory?.toLowerCase().includes(q)
      );
    }

    // Top-bar sorting
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [apiData, subParam, searchTerm, sortBy]);

  const clearCategory = () => {
    router.push("/shop");
  };

  const getPageTitle = () => {
    if (subParam) {
      if (subParam.includes("drop")) return "DROP-SHOULDER T-SHIRTS";
      if (subParam.includes("sweat") || subParam.includes("sweet")) return "SWEAT SHIRTS";
      if (subParam.includes("hoodie")) return "MEN'S HOODIES";
      return `${subParam.toUpperCase()} COLLECTION`;
    }
    if (categoryParam.toLowerCase() === "men") {
      return "MEN'S COLLECTION";
    }
    if (categoryParam) {
      return `${categoryParam.toUpperCase()} COLLECTION`;
    }
    return "SHOP ALL COLLECTION";
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Breadcrumb & Title Section */}
      <div className="w-full bg-[#fdfaf5] border-b border-neutral-200/60 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2 font-medium">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-neutral-400" />
            <Link href="/shop" className="hover:text-black transition-colors">
              Shop
            </Link>
            {categoryParam && (
              <>
                <ChevronRight size={13} className="text-neutral-400" />
                <span className="text-neutral-900 font-semibold capitalize">
                  {categoryParam}
                </span>
              </>
            )}
          </nav>

          {/* Title & Filter Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-900">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Showing {filteredProducts.length} items
              </p>
            </div>

            {categoryParam && (
              <div className="flex items-center gap-1.5 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-full select-none shadow-sm">
                <span className="capitalize">Filtered: {categoryParam}</span>
                <button
                  onClick={clearCategory}
                  className="hover:text-green-300 ml-1 cursor-pointer focus:outline-none"
                  aria-label="Remove category filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Filter Bar (No sidebar - only search and sort as requested) */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Top Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products in this collection..."
              className="w-full h-9.5 pl-9 pr-8 bg-neutral-50 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 border border-neutral-300 rounded focus:bg-white focus:border-neutral-500 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Top Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label
              htmlFor="shop-sort"
              className="flex items-center gap-1 text-xs font-semibold text-neutral-700 whitespace-nowrap"
            >
              <ArrowUpDown size={13} className="text-neutral-500" />
              <span>Sort by:</span>
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9.5 pl-3 pr-8 bg-neutral-50 border border-neutral-300 text-xs font-medium text-neutral-900 rounded focus:bg-white focus:border-neutral-500 focus:outline-none cursor-pointer"
            >
              <option value="default">Default (Featured)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Product Grid Area */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-6 md:py-8">
        {isLoading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              No products found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
              We couldn&apos;t find any products matching your search criteria.
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-xs font-semibold bg-neutral-100 text-neutral-800 rounded hover:bg-neutral-200 transition-colors"
                >
                  Clear search
                </button>
              )}
              {categoryParam && (
                <button
                  onClick={clearCategory}
                  className="px-4 py-2 text-xs font-semibold bg-black text-white rounded hover:bg-neutral-800 transition-colors"
                >
                  View all products
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
