"use client";

import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasThumbnails?: boolean;
}

export function TableSkeleton({
  rows = 6,
  columns = 6,
  hasThumbnails = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full bg-white border border-neutral-200/90 shadow-2xs overflow-hidden select-none">
      {/* Table Header Skeleton */}
      <div className="bg-[#faf6f2] border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, idx) => (
          <div
            key={idx}
            className="h-3 bg-neutral-300 rounded-none skeleton-shimmer"
            style={{ width: `${Math.floor(100 / columns) - 4}%` }}
          />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="px-4 py-3.5 flex items-center justify-between gap-4 animate-pulse"
          >
            {/* First Column: Thumbnail + 2-line title */}
            <div className="flex items-center gap-3 w-1/3 min-w-[180px]">
              {hasThumbnails && (
                <div className="w-10 h-10 bg-neutral-200 shrink-0 rounded-none skeleton-shimmer" />
              )}
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-4/5 bg-neutral-200 rounded-none" />
                <div className="h-2.5 w-1/2 bg-neutral-100 rounded-none" />
              </div>
            </div>

            {/* Middle Columns */}
            {Array.from({ length: columns - 2 }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="hidden sm:flex flex-col gap-1.5"
                style={{ width: `${Math.floor(60 / (columns - 2))}%` }}
              >
                <div className="h-3 bg-neutral-200 rounded-none w-3/4" />
                <div className="h-2 bg-neutral-100 rounded-none w-1/2" />
              </div>
            ))}

            {/* Action Column */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <div className="w-14 h-6 bg-neutral-200 rounded-none skeleton-shimmer" />
              <div className="w-7 h-6 bg-neutral-100 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;
