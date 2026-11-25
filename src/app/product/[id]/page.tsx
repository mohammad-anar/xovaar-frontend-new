import React, { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FloatingChat from "@/components/chat/FloatingChat";
import ProductDetailsClient from "./ProductDetailsClient";
import ProductDetailSkeleton from "@/components/skeleton/ProductDetailSkeleton";
import { DEFAULT_NEW_ARRIVALS } from "@/redux/service/product/productApi";

export function generateStaticParams() {
  return DEFAULT_NEW_ARRIVALS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = DEFAULT_NEW_ARRIVALS.find((p) => p.id === id);
  return {
    title: product ? `${product.title} - Xovaar` : "Product Details - Xovaar",
    description: "Explore fabric composition, styling, and specs at Xovaar.",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Top Main Navbar */}
      <Navbar />

      {/* Product Details Section (Matching Screenshot) */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailsClient productId={id} />
      </Suspense>

      {/* Website Footer */}
      <Footer />

      {/* Floating Chat Bubble */}
      <FloatingChat />
    </main>
  );
}
