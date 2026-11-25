import React, { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FloatingChat from "@/components/chat/FloatingChat";
import ShopContent from "./ShopContent";

export const metadata = {
  title: "Shop - Xovaar",
  description: "Browse premium men's, women's, and kid's collection.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Shop Content with Top Filter Bar (Wrapped in Suspense for Next.js searchParams) */}
      <Suspense
        fallback={
          <div className="w-full min-h-[60vh] flex items-center justify-center text-sm text-neutral-500">
            Loading collection...
          </div>
        }
      >
        <ShopContent />
      </Suspense>

      {/* Footer */}
      <Footer />

      {/* Floating Chat */}
      <FloatingChat />
    </main>
  );
}
