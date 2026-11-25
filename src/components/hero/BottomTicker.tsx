"use client";

import React from "react";
import { RotateCcw, Truck, Banknote } from "lucide-react";

export default function BottomTicker() {
  const marqueeItems = [
    {
      id: "exchange",
      icon: <RotateCcw size={14} className="text-[#16A34A] shrink-0" />,
      text: "Exchange within 7 days",
    },
    {
      id: "delivery",
      icon: <Truck size={14} className="text-[#16A34A] shrink-0" />,
      text: "Free delivery all over Bangladesh over ৳3,000",
    },
    {
      id: "cod",
      icon: <Banknote size={14} className="text-[#16A34A] shrink-0" />,
      text: "Cash on delivery all over Bangladesh",
    },
  ];

  // Repeat items so two halves are completely identical for seamless loop
  const repeatedItems = [
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
    ...marqueeItems,
  ];

  return (
    <aside
      aria-label="Store highlights and policy announcements"
      className="w-full bg-[#111111] border-t border-white/10 select-none overflow-hidden py-2.5 z-20 text-white"
    >
      <style>{`
        @keyframes scrollLeftToRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        .marquee-ltr {
          display: flex !important;
          width: max-content !important;
          animation: scrollLeftToRight 70s linear infinite !important;
          will-change: transform;
        }
        .marquee-ltr:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="relative w-full max-w-full overflow-hidden flex items-center">
        {/* Animated Marquee Strip - Scrolling smoothly from Left to Right */}
        <div className="marquee-ltr whitespace-nowrap items-center text-xs sm:text-[13px] tracking-wide">
          {repeatedItems.map((item, idx) => (
            <div
              key={`item-${idx}`}
              className="inline-flex items-center shrink-0"
            >
              <div className="inline-flex items-center gap-2.5 text-neutral-200 hover:text-white transition-colors cursor-default pr-6 sm:pr-8">
                {item.icon}
                <span className="font-medium">{item.text}</span>
              </div>
              <span className="text-[#16A34A] text-xs select-none pr-6 sm:pr-8">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
