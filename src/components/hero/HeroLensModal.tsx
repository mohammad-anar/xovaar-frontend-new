"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { X, ExternalLink, ZoomIn } from "lucide-react";
import { HeroBannerSlide } from "@/redux/service/banner/bannerApi";

interface HeroLensModalProps {
  slide: HeroBannerSlide;
  onClose: () => void;
}

export default function HeroLensModal({ slide, onClose }: HeroLensModalProps) {
  const [lensPos, setLensPos] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    show: false,
  });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setLensPos({
        x,
        y,
        width: rect.width,
        height: rect.height,
        show: true,
      });
    } else {
      setLensPos((prev) => ({ ...prev, show: false }));
    }
  };

  const handleMouseLeave = () => {
    setLensPos((prev) => ({ ...prev, show: false }));
  };

  // Dimensions of the lens
  const lensSize = 180;
  const zoomFactor = 2.5;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-neutral-900 text-white rounded-full">
              <ZoomIn size={14} />
            </span>
            <div>
              <h3 className="font-bold text-sm text-neutral-900 leading-tight">
                Lens Loupe Inspector
              </h3>
              <p className="text-[11px] text-neutral-500">
                Move cursor over the fabric to zoom in high definition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
            aria-label="Close inspection lens"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col md:flex-row gap-6 items-center">
          {/* Magnifier Image Viewport */}
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-64 sm:w-72 aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden cursor-crosshair border border-neutral-200 shadow-inner select-none shrink-0"
          >
            {/* Base Image */}
            <img
              src={slide?.productImage || slide?.imageUrl || "/banners/banner-1.jpg"}
              alt={slide?.productTitle || slide?.title || "Product"}
              className="w-full h-full object-cover object-top pointer-events-none"
            />

            {/* Square Zoom Lens Loupe - Exact pixel match */}
            {lensPos.show && lensPos.width > 0 && (
              <div
                style={{
                  width: `${lensSize}px`,
                  height: `${lensSize}px`,
                  top: `${lensPos.y - lensSize / 2}px`,
                  left: `${lensPos.x - lensSize / 2}px`,
                }}
                className="absolute rounded-xs overflow-hidden border-2 border-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-none ring-1 ring-black/40 z-20 bg-neutral-100"
              >
                <img
                  src={slide.productImage || slide.imageUrl}
                  alt={slide.productTitle || slide.title}
                  className="absolute max-w-none pointer-events-none select-none"
                  style={{
                    width: `${lensPos.width * zoomFactor}px`,
                    height: `${lensPos.height * zoomFactor}px`,
                    left: `${-(lensPos.x * zoomFactor - lensSize / 2)}px`,
                    top: `${-(lensPos.y * zoomFactor - lensSize / 2)}px`,
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-2.5 h-0.5 bg-black/30 absolute" />
                  <div className="h-2.5 w-0.5 bg-black/30 absolute" />
                </div>
              </div>
            )}

            {/* Floating Lens hint */}
            {!lensPos.show && (
              <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
                <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <ZoomIn size={12} /> Hover to zoom fabric
                </span>
              </div>
            )}
          </div>

          {/* Product Info & Direct Action */}
          <div className="flex-1 space-y-4 text-left">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded mb-2">
                Featured Hero Product
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                {slide?.productTitle || slide?.title || "Featured Product"}
              </h2>
              <p className="text-base font-extrabold text-neutral-900 mt-1">
                ৳ {slide?.productPrice ? slide.productPrice.toFixed(2) : "0.00"}
              </p>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Explore the detailed weave, texture, and refined construction of
              our {slide?.titleHighlight || ""} series. Made with premium grade fabric
              designed for longevity and breathability.
            </p>

            <div className="pt-2">
              <Link
                href={`/product/${slide.productId}`}
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded transition-all shadow hover:shadow-md cursor-pointer"
              >
                <span>View Full Product Details</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
