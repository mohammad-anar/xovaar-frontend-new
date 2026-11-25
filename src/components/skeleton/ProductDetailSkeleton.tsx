"use client";

import React from "react";

export function ProductDetailSkeleton() {
  return (
    <div className="w-full bg-white select-none py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-12 h-3 bg-neutral-200" />
          <div className="w-3 h-3 bg-neutral-200" />
          <div className="w-20 h-3 bg-neutral-200" />
          <div className="w-3 h-3 bg-neutral-200" />
          <div className="w-32 h-3 bg-neutral-300" />
        </div>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery Images Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full max-w-[480px] mx-auto bg-neutral-100 skeleton-shimmer border border-neutral-200" />
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-20 bg-neutral-200 skeleton-shimmer" />
              <div className="w-16 h-20 bg-neutral-200 skeleton-shimmer" />
              <div className="w-16 h-20 bg-neutral-200 skeleton-shimmer" />
              <div className="w-16 h-20 bg-neutral-200 skeleton-shimmer" />
            </div>
          </div>

          {/* Right: Product Meta & Purchase Panel */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-5 bg-neutral-200" />
              <div className="w-20 h-5 bg-neutral-200" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="w-full h-7 bg-neutral-300 skeleton-shimmer" />
              <div className="w-3/4 h-7 bg-neutral-300 skeleton-shimmer" />
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <div className="w-28 h-8 bg-neutral-300 skeleton-shimmer" />
              <div className="w-20 h-5 bg-neutral-200" />
            </div>

            {/* Sizes */}
            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <div className="w-24 h-3 bg-neutral-200" />
              <div className="flex gap-2">
                <div className="w-12 h-10 bg-neutral-100 border border-neutral-200" />
                <div className="w-12 h-10 bg-neutral-100 border border-neutral-200" />
                <div className="w-12 h-10 bg-neutral-100 border border-neutral-200" />
                <div className="w-12 h-10 bg-neutral-100 border border-neutral-200" />
                <div className="w-12 h-10 bg-neutral-100 border border-neutral-200" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <div className="flex-1 h-12 bg-neutral-900/10 skeleton-shimmer" />
              <div className="flex-1 h-12 bg-neutral-900/10 skeleton-shimmer" />
            </div>

            {/* Description & Specifications Skeleton */}
            <div className="space-y-3 pt-6 border-t border-neutral-200">
              <div className="w-36 h-4 bg-neutral-300" />
              <div className="space-y-2">
                <div className="w-full h-3 bg-neutral-200" />
                <div className="w-5/6 h-3 bg-neutral-200" />
                <div className="w-4/6 h-3 bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
