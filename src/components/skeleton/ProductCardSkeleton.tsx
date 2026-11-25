"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-neutral-200/90 rounded-none overflow-hidden select-none animate-pulse">
      {/* Image Container Skeleton with Shimmer */}
      <div className="relative aspect-[3/4] w-full bg-neutral-100 skeleton-shimmer overflow-hidden">
        {/* Top Badges Skeleton */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          <div className="w-16 h-4 bg-neutral-200 rounded-none" />
        </div>
        <div className="absolute top-2.5 right-2.5 z-10">
          <div className="w-7 h-7 bg-neutral-200/80 rounded-full" />
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div className="space-y-2">
          {/* Subcategory */}
          <div className="w-20 h-2.5 bg-neutral-200 rounded-none" />
          {/* Title 2-lines */}
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-neutral-200 rounded-none" />
            <div className="w-2/3 h-3.5 bg-neutral-200 rounded-none" />
          </div>
        </div>

        {/* Price & Rating */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-neutral-300 rounded-none" />
            <div className="w-10 h-3 bg-neutral-200 rounded-none" />
          </div>
          <div className="w-8 h-3 bg-neutral-200 rounded-none" />
        </div>

        {/* Sizes Placeholder */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-none" />
          <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-none" />
          <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-none" />
          <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-none" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number;
  columns?: 2 | 3 | 4;
}) {
  const gridClasses = {
    2: "grid grid-cols-2 gap-3.5 sm:gap-4",
    3: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5",
    4: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6",
  }[columns];

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;
