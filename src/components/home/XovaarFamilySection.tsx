"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MomentItem {
  id: string;
  imageUrl: string;
  name: string;
  title: string;
  role: string;
  location: string;
}

const FAMILY_MOMENTS: MomentItem[] = [
  {
    id: "fam-1",
    imageUrl: "/community/community-1.jpg",
    name: "Anarul Islam",
    title: "Chief Executive Officer",
    role: "CEO",
    location: "Corporate Suite",
  },
  {
    id: "fam-2",
    imageUrl: "/community/community-2.jpg",
    name: "Tanvir Ahmed",
    title: "Chief Operating Officer",
    role: "COO",
    location: "Dhaka HQ",
  },
  {
    id: "fam-3",
    imageUrl: "/community/community-3.jpg",
    name: "Mahmud Hasan",
    title: "Chief Technology Officer",
    role: "CTO",
    location: "Tech Studio",
  },
  {
    id: "fam-4",
    imageUrl: "/community/community-4.jpg",
    name: "Zubair Rahman",
    title: "Chief Financial Officer",
    role: "CFO",
    location: "Central Hub",
  },
  {
    id: "fam-5",
    imageUrl: "/community/community-5.jpg",
    name: "Shakil Hossain",
    title: "Software & Web Engineer",
    role: "Developer",
    location: "Engineering Hub",
  },
  {
    id: "fam-6",
    imageUrl: "/community/community-6.jpg",
    name: "Afnan Chowdhury",
    title: "Brand & Cultural Ambassador",
    role: "Brand Ambassador",
    location: "Xovaar Studio",
  },
  {
    id: "fam-7",
    imageUrl: "/community/community-7.jpg",
    name: "Nabil Farhan",
    title: "Creative Visual Production",
    role: "Photographer",
    location: "HQ Studio",
  },
];

export default function XovaarFamilySection() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicated for completely seamless infinite loop
  const loopMoments = [
    ...FAMILY_MOMENTS,
    ...FAMILY_MOMENTS,
    ...FAMILY_MOMENTS,
  ];

  return (
    <section className="w-full bg-[#fcfbf9] py-10 md:py-16 border-t border-neutral-200/80 overflow-hidden select-none">
      <style>{`
        @keyframes familySlideRightToLeft {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .family-slider-track {
          display: flex !important;
          width: max-content !important;
          animation: familySlideRightToLeft 70s linear infinite !important;
          will-change: transform;
        }
        .family-slider-track.paused,
        .family-slider-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Header Area Centered - Xovaar Community */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 font-sans">
          Xovaar Community
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Wear Your Identity . Define Your Style
        </p>
        <div className="w-12 h-1 bg-[#16A34A] mt-2.5 rounded-full mx-auto" />
      </div>

      {/* Infinite Slider Track inside Container - Right to Left Slow Smooth Motion */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            className={`family-slider-track items-stretch gap-4 sm:gap-6 ${
              isPaused ? "paused" : ""
            }`}
          >
            {loopMoments.map((item, idx) => (
              <div
                key={`family-moment-${item.id}-${idx}`}
                className="group relative w-[260px] sm:w-[290px] md:w-[325px] aspect-[3/3.8] shrink-0 bg-neutral-200 rounded-[20px] overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-200/90"
              >
                {/* Moment Photo */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 290px, 325px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                />

                {/* Bottom Subtle Contrast Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Bottom Row: Left Member Name Pill + Right Role Badge */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-[10.5px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-xs truncate max-w-[145px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="tracking-wide truncate">{item.name}</span>
                  </div>

                  <div className="bg-white/95 backdrop-blur-md text-neutral-900 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/30 shadow-sm shrink-0">
                    {item.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
