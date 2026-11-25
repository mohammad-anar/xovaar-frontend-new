"use client";

import React, { useState, useEffect } from "react";
import { AdminStorage } from "@/services/adminStore";

export default function FloatingWhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState("880162039613");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    try {
      const settings = AdminStorage.getSettings();
      if (settings?.supportPhone) {
        const clean = settings.supportPhone.replace(/[^0-9]/g, "");
        if (clean.length >= 8) {
          setPhoneNumber(clean.startsWith("88") ? clean : `88${clean.replace(/^0+/, "")}`);
        }
      }
    } catch {
      // Fallback to default
    }
  }, []);

  const message = encodeURIComponent(
    "Hello Xovaar Support! I would like to inquire about your products."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <aside
      aria-label="WhatsApp customer support"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 select-none"
    >
      {/* Tooltip on hover */}
      <div
        className={`hidden sm:flex items-center bg-white text-neutral-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-neutral-100 transition-all duration-200 pointer-events-none ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] mr-1.5 animate-pulse" />
        Chat on WhatsApp
      </div>

      {/* Floating Action WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-lg hover:shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Chat with Xovaar customer support on WhatsApp"
      >
        {/* Subtle breathing ripple wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none duration-1000" />

        {/* Official WhatsApp SVG Logo */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 md:w-7 md:h-7 relative z-10 transition-transform group-hover:scale-105"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </aside>
  );
}
