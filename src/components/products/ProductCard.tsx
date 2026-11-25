"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductItem } from "@/redux/service/product/productApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { addToCart, closeCart } from "@/redux/features/cart";
import { toggleWishlist } from "@/redux/features/wishlist";
import { toast } from "sonner";
import { Heart, ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: ProductItem }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const primaryImage = product.imageUrl || product.images?.[0];
  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1]
      : product.imageUrl;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize =
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M";
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: primaryImage,
        size: defaultSize,
        quantity: 1,
        freeDelivery: product.freeDelivery,
      })
    );
    toast.success(`Added to bag`, {
      description: `${product.title} - ৳ ${product.price.toFixed(0)}`,
    });
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize =
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M";
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: primaryImage,
        size: defaultSize,
        quantity: 1,
        freeDelivery: product.freeDelivery,
      })
    );
    dispatch(closeCart());
    router.push("/checkout");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast.message(
      isWishlisted ? "Removed from wishlist" : "Saved to wishlist",
      { description: product.title }
    );
  };

  return (
    <div className="group relative flex flex-col bg-white border border-neutral-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow select-none">
      {/* Product Image Area with Slide-Up Close Shot */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full relative">
          {/* Base Static Image */}
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            unoptimized={primaryImage?.startsWith("data:")}
            className="object-cover object-top select-none"
          />

          {/* Secondary Close-Shot Image - Slides up smoothly from bottom to top on hover */}
          {secondaryImage && (
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out will-change-transform overflow-hidden z-1 bg-neutral-100">
              <Image
                src={secondaryImage}
                alt={`${product.title} close shot`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                unoptimized={secondaryImage?.startsWith("data:")}
                className="object-cover object-center scale-115 transition-transform duration-700 ease-out select-none"
              />
              {/* Subtle close-shot badge tag */}
              <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium tracking-wide px-1.5 py-0.5 rounded-xs">
                  Close View
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Free Delivery Badge */}
        {product.freeDelivery && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-800 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs z-10">
            Free Delivery
          </span>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all cursor-pointer z-10 ${
            isWishlisted
              ? "bg-green-50 text-green-600 scale-105"
              : "bg-white/90 hover:bg-white text-neutral-600 hover:text-black"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={13}
            className={isWishlisted ? "fill-green-600 text-green-600" : ""}
          />
        </button>
      </div>

      {/* Details Area matching Wishlist Card layout */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#16A34A]">
            {product.subCategory || "Men"}
          </span>
          <Link
            href={`/product/${product.id}`}
            className="block text-xs font-bold text-neutral-900 hover:underline line-clamp-1 mt-0.5"
          >
            {product.title}
          </Link>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            <span className="text-sm font-extrabold text-neutral-900">
              ৳ {product.price.toFixed(0)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                ৳ {product.originalPrice.toFixed(0)}
              </span>
            )}
            {discountPercent && discountPercent > 0 && (
              <span className="bg-red-50 text-red-700 font-bold text-[9.5px] px-1.5 py-0.5 rounded border border-red-200 leading-none">
                {discountPercent}% Off
              </span>
            )}
          </div>
        </div>

        {/* Action Row: Add To Bag + Buy Now (Equal width, flex-wrap on narrow screens) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="group/btn relative overflow-hidden flex-1 min-w-[100px] h-8.5 border border-neutral-900 bg-white text-neutral-900 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer px-2"
          >
            {/* Sliding background from left to right */}
            <span className="absolute inset-0 bg-neutral-900 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out will-change-transform" />

            {/* Content with text and icon color transition */}
            <span className="relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-300 text-neutral-900 group-hover/btn:text-white">
              <ShoppingBag size={12} className="shrink-0 transition-colors duration-300" />
              <span className="truncate">Add To Bag</span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleDirectBuy}
            className="group/btn relative overflow-hidden flex-1 min-w-[100px] h-8.5 border border-[#16A34A] bg-transparent text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xs flex items-center justify-center transition-all shadow-xs cursor-pointer px-2"
            title="Buy Now (Direct Checkout)"
          >
            {/* Red background that slides out from left to right on hover */}
            <span className="absolute inset-0 bg-[#16A34A] translate-x-0 group-hover/btn:translate-x-full transition-transform duration-300 ease-out will-change-transform" />

            {/* Button text that transitions from white to red */}
            <span className="relative z-10 truncate transition-colors duration-300 text-white group-hover/btn:text-[#16A34A]">
              Buy Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
