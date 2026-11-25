"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  tag: string;
  tagColor: string;
  image: string;
  bgGradient: string;
}

const CARDS: CardItem[] = [
  {
    id: "card-1",
    title: "Minimal Identity Graphic Tee",
    subtitle: "Signature Brush Identity • 240 GSM",
    price: "৳ 890",
    tag: "LIMITED DROP",
    tagColor: "bg-red-600 text-white shadow-red-900/50",
    image: "/loading-card.jpg",
    bgGradient: "from-[#850812] via-[#400409] to-[#120103]",
  },
  {
    id: "card-2",
    title: "Men White 'SILENCE' Oversized Tee",
    subtitle: "Ultra Combed Heavy Cotton",
    price: "৳ 790",
    tag: "BESTSELLER",
    tagColor: "bg-neutral-800 text-white shadow-black/60",
    image: "/products/product-5.jpg",
    bgGradient: "from-[#202024] via-[#121214] to-[#08080a]",
  },
  {
    id: "card-3",
    title: "Twin Streetwear Graphic Drop Tee",
    subtitle: "Boxy Streetwear Fit • Enzyme Washed",
    price: "৳ 890",
    tag: "NEW DROP",
    tagColor: "bg-emerald-700 text-white shadow-emerald-950/50",
    image: "/products/product-11.jpg",
    bgGradient: "from-[#14301a] via-[#0b1a0e] to-[#040905]",
  },
  {
    id: "card-4",
    title: "'DOPE' Heavyweight Fleece Hoodie",
    subtitle: "380 GSM Thermal Brushed Cotton",
    price: "৳ 2,290",
    tag: "SIGNATURE",
    tagColor: "bg-amber-600 text-white shadow-amber-950/50",
    image: "/products/product-8.jpg",
    bgGradient: "from-[#382713] via-[#1c1308] to-[#0a0703]",
  },
  {
    id: "card-5",
    title: "Japanese Vintage Street Tee",
    subtitle: "Deep Charcoal • High Density Print",
    price: "৳ 990",
    tag: "EXCLUSIVE",
    tagColor: "bg-indigo-700 text-white shadow-indigo-950/50",
    image: "/products/product-1.jpg",
    bgGradient: "from-[#231e3d] via-[#120e24] to-[#06040d]",
  },
  {
    id: "card-6",
    title: "Minimalist Drop-Shoulder Signature",
    subtitle: "240 GSM Pure Combed Cotton",
    price: "৳ 850",
    tag: "SPECIAL EDITION",
    tagColor: "bg-rose-700 text-white shadow-rose-950/50",
    image: "/products/product-2.jpg",
    bgGradient: "from-[#3b1219] via-[#1e080c] to-[#0a0204]",
  },
];

export default function GlobalSiteLoader() {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  // Lock document scroll while loader is visible to eliminate mobile scrollbars
  useEffect(() => {
    if (loading) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [loading]);

  // Responsive breakpoint listener for mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fast continuous sliding loop (every 450ms) as long as loading is not completed
  useEffect(() => {
    if (fadingOut) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CARDS.length);
    }, 450);

    return () => clearInterval(interval);
  }, [fadingOut]);

  // Smooth loading progress bar (reaches 100% in ~2.5s while cards slide rapidly)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const step = Math.floor(Math.random() * 4) + 4;
        return Math.min(prev + step, 100);
      });
    }, 95);

    return () => clearInterval(timer);
  }, []);

  // When progress reaches 100%, trigger smooth fade out
  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setFadingOut(true);
      }, 350);

      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 950);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress]);

  // Don't render once finished
  if (!loading) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading Xovaar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed inset-0 z-[99999] w-full max-w-[100vw] h-[100dvh] max-h-[100dvh] bg-[#09090b] text-white flex flex-col justify-between items-center overflow-hidden overscroll-none touch-none transition-opacity duration-600 select-none ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ contain: "paint" }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[500px] h-[240px] sm:h-[500px] bg-red-600/18 rounded-full blur-[80px] sm:blur-[140px] animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-[160px] sm:w-[220px] h-[160px] sm:h-[220px] bg-white/5 rounded-full blur-[60px] sm:blur-[90px]" />
      </div>

      {/* Center 3D Swiper Coverflow Card View */}
      <main className="relative z-10 flex-1 w-full max-w-full overflow-hidden flex flex-col items-center justify-center my-auto">
        {/* Swiper Stack Container with 3D Perspective */}
        <div
          className="relative w-full max-w-full flex items-center justify-center overflow-hidden py-2"
          style={{ perspective: isMobile ? "650px" : "1200px", contain: "paint" }}
        >
          <div className="relative w-[155px] xs:w-[170px] sm:w-[260px] md:w-[300px] h-[230px] xs:h-[250px] sm:h-[370px] md:h-[420px] flex items-center justify-center">
            {CARDS.map((card, index) => {
              // Calculate offset relative to currentIndex (-2, -1, 0, 1, 2)
              let offset = (index - currentIndex + CARDS.length) % CARDS.length;
              if (offset > CARDS.length / 2) {
                offset -= CARDS.length;
              }

              const isCenter = offset === 0;
              const isImmediateRight = offset === 1;
              const isImmediateLeft = offset === -1;
              const isFarRight = offset === 2;
              const isFarLeft = offset === -2;

              // On mobile: show only 3 cards (center + left + right) to strictly eliminate all horizontal overflow
              if (isMobile && Math.abs(offset) > 1) return null;
              // On desktop: show 5 cards
              if (!isMobile && Math.abs(offset) > 2) return null;

              // Dynamic 3D transform calculations with mobile-optimized tight gap
              let translateX = 0;
              let scale = 1;
              let rotate = 0;
              let zIndex = 30;
              let opacity = 1;

              if (isCenter) {
                translateX = 0;
                scale = 1;
                rotate = 0;
                zIndex = 30;
                opacity = 1;
              } else if (isImmediateRight) {
                translateX = isMobile ? 28 : 54;
                scale = isMobile ? 0.90 : 0.88;
                rotate = isMobile ? 4 : 7;
                zIndex = 20;
                opacity = 0.75;
              } else if (isImmediateLeft) {
                translateX = isMobile ? -28 : -54;
                scale = isMobile ? 0.90 : 0.88;
                rotate = isMobile ? -4 : -7;
                zIndex = 20;
                opacity = 0.75;
              } else if (isFarRight) {
                translateX = 90;
                scale = 0.76;
                rotate = 14;
                zIndex = 10;
                opacity = 0.32;
              } else if (isFarLeft) {
                translateX = -90;
                scale = 0.76;
                rotate = -14;
                zIndex = 10;
                opacity = 0.32;
              }

              return (
                <div
                  key={card.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`absolute inset-0 rounded-xl sm:rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b ${card.bgGradient} shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.2,1,0.3,1)] cursor-pointer select-none`}
                  style={{
                    transform: `translate3d(${translateX}%, 0, ${isCenter ? 0 : -80}px) scale(${scale}) rotate(${rotate}deg)`,
                    zIndex,
                    opacity,
                    boxShadow: isCenter
                      ? "0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 30px 2px rgba(255, 255, 255, 0.08)"
                      : "0 10px 25px -8px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {/* Subtle Top Card Glare */}
                  <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-white/12 to-transparent pointer-events-none z-10" />

                  {/* Card Top Pill Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20">
                    <span
                      className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md ${card.tagColor} border border-white/20 inline-block`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* T-Shirt / Apparel Display (Exact Card Look) */}
                  <div className="relative w-full h-[62%] sm:h-[70%] flex items-center justify-center p-2 sm:p-4 mt-1 sm:mt-2">
                    <div className="relative w-full h-full">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 640px) 175px, 320px"
                        priority
                        className="object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Card Bottom Expanded Details Footer */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col justify-end z-20">
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className="text-[11px] sm:text-sm font-bold text-white tracking-tight line-clamp-1">
                        {card.title}
                      </h3>
                      <span className="text-[11px] sm:text-sm font-black text-amber-400 shrink-0">
                        {card.price}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-neutral-300 line-clamp-1 mt-0.5 font-medium">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Dots Indicator */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-3 sm:mt-6 z-10">
          {CARDS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-1 sm:h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                dotIdx === currentIndex
                  ? "w-4 sm:w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  : "w-1 sm:w-1.5 bg-neutral-600 hover:bg-neutral-400"
              }`}
              aria-label={`Jump to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </main>

      {/* Bottom Footer: Progress Bar */}
      <footer className="relative z-10 w-full max-w-md px-4 pb-6 sm:px-6 sm:pb-10 flex flex-col items-center shrink-0">
        {/* Progress Bar Container */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 mb-2">
          <span className="uppercase font-sans font-bold text-[10px] text-neutral-300">
            Loading Collection
          </span>
          <span>{progress}%</span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-white transition-all duration-150 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>
    </div>
  );
}
