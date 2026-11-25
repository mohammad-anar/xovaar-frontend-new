"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ProductItem,
  useGetProductByIdQuery,
  DEFAULT_NEW_ARRIVALS,
} from "@/redux/service/product/productApi";
import { AdminStorage } from "@/services/adminStore";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { addToCart, closeCart } from "@/redux/features/cart";
import { toggleWishlist } from "@/redux/features/wishlist";
import {
  Heart,
  ChevronRight,
  Minus,
  Plus,
  CheckCircle2,
  ChevronDown,
  ZoomIn,
  ShoppingBag,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetailsClient({ productId }: { productId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: apiData } = useGetProductByIdQuery(productId);

  // Fallback to default product if backend is not yet populated
  const [product, setProduct] = useState<ProductItem>(() => {
    return (
      apiData?.data ||
      DEFAULT_NEW_ARRIVALS.find((p) => p.id === productId || p.slug === productId) ||
      DEFAULT_NEW_ARRIVALS[0]
    );
  });

  useEffect(() => {
    if (apiData?.data) {
      setProduct(apiData.data);
    } else if (typeof window !== "undefined") {
      const stored = AdminStorage.getProducts().find((p) => p.id === productId);
      if (stored) {
        setProduct(stored);
      }
    }
  }, [apiData, productId]);

  const rawGallery =
    product?.images && product?.images.length > 0
      ? product?.images
      : [product?.imageUrl || "/products/product-1.jpg"];
  const galleryImages = rawGallery.map((img) => getImageUrl(img));

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes?.[0] || "M"
  );

  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0]);
    }
    if (product?.sizes && product?.sizes.length > 0) {
      if (!product?.sizes.includes(selectedSize)) {
        setSelectedSize(product?.sizes[0]);
      }
    }
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [isPolicyOpen, setIsPolicyOpen] = useState(true);

  // Wishlist state from Redux
  const wishlistItems = useAppSelector((state) => state.wishlist?.items) || [];
  const isWishlisted = wishlistItems.some((item) => item?.id === product?.id);

  // Interactive Lens Loupe Zoom
  const [lensPos, setLensPos] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    show: false,
  });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const lensSize = 220; // Larger square lens as requested
  const zoomFactor = 2.5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
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

  const discountPercent =
    product?.originalPrice && product?.originalPrice > product?.price
      ? Math.round(
        ((product?.originalPrice - product?.price) / product?.originalPrice) * 100
      )
      : null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product?.id,
        title: product?.title,
        price: product?.price,
        imageUrl: activeImage,
        size: selectedSize,
        quantity,
        freeDelivery: product?.freeDelivery,
      })
    );
    toast.success("Added to Shopping Bag", {
      description: `${quantity}x ${product?.title} (Size: ${selectedSize})`,
    });
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        id: product?.id,
        title: product?.title,
        price: product?.price,
        imageUrl: activeImage,
        size: selectedSize,
        quantity,
        freeDelivery: product?.freeDelivery,
      })
    );
    dispatch(closeCart());
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast.message(
      isWishlisted ? "Removed from wishlist" : "Saved to wishlist",
      { description: product?.title }
    );
  };

  return (
    <div className="w-full bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 font-medium">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <span className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-md">
            {product?.title}
          </span>
        </nav>

        {/* 2-Column Product Details Layout (Matching Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Product Gallery & Lens Zoom */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image with Zoom Lens - Max height 560px as requested */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[448px] max-h-[560px] aspect-[4/5] bg-neutral-100 rounded-sm overflow-hidden cursor-crosshair border border-neutral-200 select-none shadow-sm mx-auto lg:mx-0"
            >
              {/* SALE Badge - Top Left */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#f04438] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none shadow-sm">
                  SALE
                </span>
              </div>

              {/* Base Image */}
              <img
                src={activeImage}
                alt={product?.title}
                className="w-full h-full object-cover object-top pointer-events-none"
              />

              {/* Square Magnifier Lens Loupe - Exact 1-to-1 pixel zoom underneath cursor */}
              {lensPos.show && lensPos.width > 0 && (
                <div
                  style={{
                    width: `${lensSize}px`,
                    height: `${lensSize}px`,
                    top: `${lensPos.y - lensSize / 2}px`,
                    left: `${lensPos.x - lensSize / 2}px`,
                  }}
                  className="absolute rounded-xs overflow-hidden border-2 border-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-none ring-1 ring-black/40 z-30 bg-neutral-100"
                >
                  <img
                    src={activeImage}
                    alt="Zoom preview"
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
                  {/* Subtle precision center crosshair indicator */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-black/30 absolute" />
                    <div className="h-3 w-0.5 bg-black/30 absolute" />
                  </div>
                </div>
              )}

              {/* Lens Zoom Hint at bottom */}
              <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
                <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <ZoomIn size={12} /> Hover to zoom fabric
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 max-w-[448px] mx-auto lg:mx-0">
              {galleryImages.map((img, idx) => {
                const isActive = img === activeImage;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 sm:w-20 aspect-[4/5] rounded overflow-hidden border-2 transition-all cursor-pointer ${isActive
                      ? "border-black shadow-md scale-102"
                      : "border-neutral-200 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized={img.startsWith("data:")}
                      className="object-cover object-top"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Title, Price, Size, Add to Cart, Details */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header: Title & Wishlist Button */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                {product?.title}
              </h1>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full border transition-colors cursor-pointer shrink-0 ${isWishlisted
                  ? "border-green-200 bg-green-50 text-green-600"
                  : "border-neutral-200 hover:border-neutral-400 text-neutral-600"
                  }`}
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-green-600 text-green-600" : ""}
                />
              </button>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                ৳ {product?.price.toFixed(0)}
              </span>
              {product?.originalPrice && product?.originalPrice > product?.price && (
                <span className="text-base text-neutral-400 line-through">
                  ৳ {product?.originalPrice.toFixed(0)}
                </span>
              )}
              {discountPercent && (
                <span className="bg-red-50 text-red-700 font-bold text-xs px-2 py-0.5 rounded border border-red-200">
                  {discountPercent}% Off
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-800">
                Select Size:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {(product?.sizes || ["S", "M", "L", "XL", "XXL"]).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-9 px-3 text-xs font-bold rounded-sm border transition-all cursor-pointer ${isSelected
                        ? "border-black bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                Quantity:
              </label>
              <div className="inline-flex items-center border border-neutral-300 rounded h-10 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons Underneath Quantity: Add To Bag + Buy Now (Matching ProductCard 2-col side-by-side layout) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 my-1">
              {/* Add To Cart (Add To Bag) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="group/btn relative overflow-hidden h-11 sm:h-12 border border-neutral-900 bg-white text-neutral-900 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer px-2 sm:px-4"
              >
                {/* Sliding background from left to right */}
                <span className="absolute inset-0 bg-neutral-900 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out will-change-transform" />

                {/* Content with text and icon color transition */}
                <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-300 text-neutral-900 group-hover/btn:text-white truncate">
                  <ShoppingBag size={14} className="shrink-0 transition-colors duration-300" />
                  <span className="truncate">Add To Bag</span>
                </span>
              </button>

              {/* Buy Now with sliding background from left to right to become transparent */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="group/btn relative overflow-hidden h-11 sm:h-12 border border-[#16A34A] bg-transparent font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xs flex items-center justify-center transition-all shadow-xs cursor-pointer px-2 sm:px-4"
                title="Buy Now (Direct Checkout)"
              >
                {/* Green background that slides out from left to right on hover */}
                <span className="absolute inset-0 bg-[#16A34A] translate-x-0 group-hover/btn:translate-x-full transition-transform duration-300 ease-out will-change-transform" />

                {/* Button text that transitions from white to green */}
                <span className="relative z-10 transition-colors duration-300 text-white group-hover/btn:text-[#16A34A] truncate">
                  Buy Now
                </span>
              </button>
            </div>

            {/* Easy Returns & Exchange Box - Matching Screenshot */}
            <div className="border border-neutral-200 rounded-lg p-3.5 bg-neutral-50/60 space-y-2">
              <button
                type="button"
                onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                className="w-full flex items-center justify-between text-left font-bold text-xs text-neutral-900 cursor-pointer"
              >
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Easy Returns & Exchange
                </span>
                <ChevronDown
                  size={15}
                  className={`text-neutral-500 transition-transform ${isPolicyOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isPolicyOpen && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-600 pt-1 border-t border-neutral-200/60">
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-600">✔</span> Tell us within 7 days
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-600">✔</span> Free return shipping*
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-600">✔</span> Instant refund on receipt
                  </span>
                </div>
              )}
            </div>

            {/* Product Narrative Description */}
            <div className="space-y-3 pt-2 text-xs text-neutral-600 leading-relaxed border-t border-neutral-200/60">
              <p>
                {product?.description ||
                  "Crafted with meticulous attention to detail and designed for superior comfort and durability. The fabric moves effortlessly with you while retaining structured elegance throughout the day."}
              </p>
            </div>

            {/* Fabric & Composition Specifications List - Matching Screenshot */}
            <div className="space-y-3 pt-3 border-t border-neutral-200/60">
              <h3 className="font-extrabold text-[13px] text-neutral-950 uppercase tracking-wide">
                FABRIC &amp; COMPOSITION
              </h3>
              {typeof product?.fabricComposition === "string" ? (
                <div
                  className="prose prose-neutral max-w-none text-[13px] text-neutral-700 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&_strong]:text-neutral-950 [&_strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: product?.fabricComposition }}
                />
              ) : (
                <ul className="space-y-2 text-[13px] text-neutral-700 list-disc pl-5 leading-relaxed">
                  <li>
                    <strong className="text-neutral-950 font-bold">Main Fabric:</strong>{" "}
                    {product?.fabricComposition?.mainFabric ||
                      "Enzyme-washed combed cotton jersey"}
                  </li>
                  <li>
                    <strong className="text-neutral-950 font-bold">Weight:</strong>{" "}
                    {product?.fabricComposition?.weight ||
                      "240 GSM — premium heavy texture"}
                  </li>
                  <li>
                    <strong className="text-neutral-950 font-bold">Material:</strong>{" "}
                    {product?.fabricComposition?.material || "100% Cotton"}
                  </li>
                  <li>
                    <strong className="text-neutral-950 font-bold">Cuffs:</strong>{" "}
                    {product?.fabricComposition?.cuffs ||
                      "Ribbed fabric that holds its shape wear after wear"}
                  </li>
                  <li>
                    <strong className="text-neutral-950 font-bold">Zipper:</strong>{" "}
                    {product?.fabricComposition?.zipper ||
                      "Hidden front zip for a clean, uninterrupted look"}
                  </li>
                  <li>
                    <strong className="text-neutral-950 font-bold">Stitching:</strong>{" "}
                    {product?.fabricComposition?.stitching ||
                      "Fine matching-colour thread throughout"}
                  </li>
                  <li>
                    <strong className="text-neutral-950 font-bold">Silhouette:</strong>{" "}
                    {product?.fabricComposition?.silhouette ||
                      "Relaxed drop-shoulder streetwear cut"}
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
