"use client";

import React from "react";

export function MetricCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200/90 p-5 shadow-2xs select-none animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-24 h-3 bg-neutral-200 rounded-none" />
        <div className="w-8 h-8 bg-neutral-100 rounded-none skeleton-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="w-32 h-7 bg-neutral-300 rounded-none skeleton-shimmer" />
        <div className="flex items-center gap-2 pt-1">
          <div className="w-12 h-3.5 bg-neutral-200 rounded-none" />
          <div className="w-20 h-3 bg-neutral-100 rounded-none" />
        </div>
      </div>
    </div>
  );
}

export function MetricGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default MetricCardSkeleton;
