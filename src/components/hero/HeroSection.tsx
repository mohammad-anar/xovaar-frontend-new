"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomTicker from "./BottomTicker";
import HeroLensModal from "./HeroLensModal";
import WaterRippleCursor from "./WaterRippleCursor";
import {
  useGetHeroSlidesQuery,
  DEFAULT_HERO_SLIDES,
  HeroBannerSlide,
} from "@/redux/service/banner/bannerApi";
import { ChevronLeft, ChevronRight, Search, ZoomIn, MoveRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export default function HeroSection() {
  const router = useRouter();
  const { data: apiSlides } = useGetHeroSlidesQuery();
  const slides: HeroBannerSlide[] =
    Array.isArray(apiSlides?.data) && apiSlides.data.length > 0
      ? apiSlides.data
      : DEFAULT_HERO_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lensSlide, setLensSlide] = useState<HeroBannerSlide | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const hasMultipleSlides = slides.length > 1;

  const nextSlide = useCallback(() => {
    if (!hasMultipleSlides) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [hasMultipleSlides, slides.length]);

  const prevSlide = useCallback(() => {
    if (!hasMultipleSlides) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [hasMultipleSlides, slides.length]);

  // Auto-play slider with smooth fade transitions every 5 seconds if multiple slides
  useEffect(() => {
    if (!hasMultipleSlides || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [hasMultipleSlides, isPaused, nextSlide]);

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_HERO_SLIDES[0];
  const isLeftAligned =
    currentSlide?.align === "left" ||
    (currentSlide?.align === undefined && currentIndex % 2 === 1);

  const handleBannerClick = () => {
    if (currentSlide?.ctaLink) {
      router.push(currentSlide.ctaLink);
    } else if (currentSlide?.productId) {
      router.push(`/product/${currentSlide.productId}`);
    }
  };

  const handleLensClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide) {
      setLensSlide(currentSlide);
    }
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-full overflow-hidden flex flex-col select-none"
    >
      {/* Banner Slide Area: Aspect Video on mobile, Full Screen min-height minus 104px on desktop (reduced by 40px) */}
      <div className="relative w-full aspect-video md:aspect-auto md:min-h-[calc(100vh-104px)] md:h-[calc(100vh-104px)] flex flex-col justify-between overflow-hidden">
        {/* Background Slides with Fade-In Transition */}
        <div
          onClick={handleBannerClick}
          className="absolute inset-0 z-0 cursor-pointer group"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                <Image
                  src={getImageUrl(slide.imageUrl)}
                  alt={`${slide.title}${slide.titleHighlight}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center select-none"
                />
                {/* Cinematic subtle contrast gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Interactive Fluid Water Drop Ripple & Cursor Tail Canvas Overlay */}
        <WaterRippleCursor />

        {/* Top Floating Lens Zoom Button */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto px-3 sm:px-8 lg:px-12 pt-2.5 sm:pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleLensClick}
            className="group/lens flex items-center gap-1.5 sm:gap-2 bg-white/90 hover:bg-white text-neutral-900 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 border border-neutral-200/80 cursor-pointer text-[10px] sm:text-xs"
            title="Zoom and inspect product fabric with interactive lens"
            aria-label="Inspect product details with lens"
          >
            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <ZoomIn size={11} className="sm:w-3.5 sm:h-3.5 group-hover/lens:scale-110 transition-transform" />
            </div>
            <span className="font-bold tracking-tight pr-1">
              Product Lens
            </span>
          </button>
        </div>

        {/* Slider Left/Right Arrows - ONLY shown if multiple slides exist */}
        {hasMultipleSlides && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-110 opacity-75 hover:opacity-100 focus:outline-none cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} className="sm:w-[22px] sm:h-[22px]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-110 opacity-75 hover:opacity-100 focus:outline-none cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={16} className="sm:w-[22px] sm:h-[22px]" />
            </button>
          </>
        )}

        {/* Main Hero Content: Left or Right aligned depending on slide design */}
        <div
          onClick={handleBannerClick}
          className={`relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 flex-1 flex items-end ${isLeftAligned ? "justify-start" : "justify-end"
            } pb-3 sm:pb-8 md:pb-14 cursor-pointer`}
        >
          <div
            className={`${isLeftAligned ? "text-left" : "text-right"
              } text-white max-w-lg select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]`}
          >
            <h1 className="font-serif text-lg sm:text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white/95 leading-tight">
              <span>{currentSlide?.title || "Xovaar"}</span>
              <span className="italic font-light text-white ml-0.5">
                {currentSlide?.titleHighlight || ""}
              </span>
            </h1>
            <p className="font-sans text-[10px] sm:text-xs md:text-base text-neutral-200 tracking-wide font-light mt-0.5 sm:mt-1 md:mt-2 line-clamp-1 sm:line-clamp-none">
              {currentSlide?.subtitle || ""}
            </p>
            <div
              className={`mt-1 sm:mt-2 md:mt-3 flex items-center ${isLeftAligned ? "justify-start" : "justify-end"
                }`}
            >
              <span className="inline-flex items-center gap-2 bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/25 shadow-md transition-all duration-200 hover:scale-105 group/btn">
                <span>Click to view</span>
                <MoveRight
                  size={15}
                  className="transition-transform duration-200 group-hover/btn:translate-x-1 stroke-[2.2]"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Slide Pagination Dots - ONLY shown if multiple slides exist */}
        {hasMultipleSlides && (
          <div className="relative z-20 flex justify-center items-center gap-1.5 sm:gap-2 pb-1.5 sm:pb-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${idx === currentIndex
                  ? "w-5 sm:w-7 h-1.5 sm:h-2 bg-white"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Promotion Ticker / Marquee directly underneath */}
      <div className="relative z-20 w-full">
        <BottomTicker />
      </div>

      {/* Interactive Lens Inspection Modal */}
      {lensSlide && (
        <HeroLensModal
          slide={lensSlide}
          onClose={() => setLensSlide(null)}
        />
      )}
    </section>
  );
}
