"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_NEW_ARRIVALS,
  ProductItem,
  useGetNewArrivalsQuery,
} from "@/redux/service/product/productApi";
import { AdminStorage } from "@/services/adminStore";

export default function BestSalesSlider() {
  const { data: apiData } = useGetNewArrivalsQuery();
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_NEW_ARRIVALS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (apiData?.data && apiData.data.length > 0) {
      setProducts(apiData.data);
    } else {
      setProducts(AdminStorage.getProducts());
    }
  }, [apiData]);

  // Use active products; repeat items to make continuous, seamless loop
  const displayProducts = products.length > 0 ? products : DEFAULT_NEW_ARRIVALS;
  const loopProducts = [
    ...displayProducts,
    ...displayProducts,
    ...displayProducts,
  ];

  return (
    <section className="w-full bg-[#fbfbfa] py-8 md:py-12 border-b border-neutral-200/80 overflow-hidden select-none">
      <style>{`
        @keyframes slideCardsRightToLeft {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .cards-slider-track {
          display: flex !important;
          width: max-content !important;
          animation: slideCardsRightToLeft 160s linear infinite !important;
          will-change: transform;
        }
        .cards-slider-track.paused,
        .cards-slider-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Section Header - NEW ARRIVAL */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 font-sans">
          NEW ARRIVAL
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1 max-w-xl mx-auto">
          Fresh Drops. Fresh Style. Discover the latest styles, curated to define your identity.
        </p>
        <div className="w-12 h-1 bg-[#16A34A] mx-auto mt-2.5 rounded-full" />
      </div>

      {/* Infinite Card Slider Area - Moving Right to Left Very Slowly */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className={`cards-slider-track items-stretch gap-4 sm:gap-6 px-4 ${
            isPaused ? "paused" : ""
          }`}
        >
          {loopProducts.map((product, idx) => {
            const primaryImage = product.imageUrl || product.images?.[0];
            const secondaryImage =
              product.images && product.images.length > 1
                ? product.images[1]
                : product.imageUrl;

            return (
              <Link
                key={`slider-card-${product.id}-${idx}`}
                href={`/product/${product.id}`}
                className="group w-[240px] sm:w-[270px] md:w-[285px] shrink-0 bg-white border border-neutral-200/90 rounded-[20px] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Product Image Area with Slide-Up Close Shot on Hover */}
                <div className="relative w-full aspect-[4/3.8] bg-[#f5f5f7] overflow-hidden border-b border-neutral-100">
                  {/* Primary Image */}
                  <Image
                    src={primaryImage}
                    alt={product.title}
                    fill
                    unoptimized={primaryImage?.startsWith("data:")}
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none p-2 sm:p-3"
                  />

                  {/* Secondary Close-Shot Image - Slides up smoothly from bottom */}
                  {secondaryImage && secondaryImage !== primaryImage && (
                    <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out will-change-transform overflow-hidden z-1 bg-[#f5f5f7]">
                      <Image
                        src={secondaryImage}
                        alt={`${product.title} close view`}
                        fill
                        unoptimized={secondaryImage?.startsWith("data:")}
                        className="object-cover object-center scale-110 transition-transform duration-700 ease-out select-none p-2 sm:p-3"
                      />
                    </div>
                  )}

                  {/* Free Delivery Badge */}
                  {product.freeDelivery && (
                    <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs z-10">
                      Free Delivery
                    </span>
                  )}
                </div>

                {/* Card Content: Title, Price, Strikethrough, In Stock badge (Exact match to screenshot) */}
                <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1">
                  {/* Title */}
                  <h3
                    className="text-[13.5px] sm:text-[14.5px] font-bold text-neutral-900 group-hover:text-[#16A34A] transition-colors line-clamp-1"
                    title={product.title}
                  >
                    {product.title}
                  </h3>

                  {/* Price & In Stock Row */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[16px] sm:text-[17px] font-extrabold text-neutral-950 tracking-tight">
                        ৳ {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through font-normal">
                            ৳ {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                    </div>

                    {/* Pastel Green In Stock Badge - Exact match to screenshot */}
                    <span className="bg-[#e6f4ea] text-[#137333] text-[11px] font-medium px-2.5 py-0.5 rounded-md shrink-0">
                      {product.inStock !== false ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
