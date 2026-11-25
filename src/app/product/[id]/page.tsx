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
  const title = product ? `${product.title} | XOVAAR` : "Product Details | XOVAAR";
  const description =
    product?.description ||
    "Signature contemporary streetwear engineered with heavyweight fabric by XOVAAR.";
  const imageUrl = product?.imageUrl || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://xovaar.com/product/${id}`,
      siteName: "XOVAAR",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: product?.title || "XOVAAR Fashion",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "product:price:amount": product?.price ? String(product.price) : "0",
      "product:price:currency": "BDT",
      "product:availability": "in stock",
      "product:brand": "XOVAAR",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = DEFAULT_NEW_ARRIVALS.find((p) => p.id === id);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product?.title || "XOVAAR Contemporary Fashion",
    image: [product?.imageUrl || "https://xovaar.com/og-image.png"],
    description:
      product?.description || "Signature contemporary streetwear engineered by XOVAAR.",
    brand: {
      "@type": "Brand",
      name: "XOVAAR",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product?.price || 1250,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "XOVAAR",
      },
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Product JSON-LD Structured Data for Meta Ads & Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Main Navbar */}
      <Navbar />

      {/* Product Details Section */}
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
