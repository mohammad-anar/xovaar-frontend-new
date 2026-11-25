"use client";

import React from "react";
import TableSkeleton from "./TableSkeleton";

export function ProfileSkeleton() {
  return (
    <div className="w-full bg-[#faf9f8] min-h-[75vh] py-8 sm:py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        {/* Profile Header Card Skeleton */}
        <div className="bg-white border border-neutral-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-neutral-200 skeleton-shimmer shrink-0" />
            <div className="space-y-2">
              <div className="w-40 h-5 bg-neutral-300" />
              <div className="w-48 h-3.5 bg-neutral-200" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-9 bg-neutral-200" />
          </div>
        </div>

        {/* Orders Table Skeleton */}
        <div className="space-y-3">
          <div className="w-36 h-4 bg-neutral-300" />
          <TableSkeleton rows={4} columns={5} hasThumbnails={true} />
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
