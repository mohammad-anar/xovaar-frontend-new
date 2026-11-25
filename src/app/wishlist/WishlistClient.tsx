"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { removeFromWishlist, toggleWishlist } from "@/redux/features/wishlist";
import { addToCart } from "@/redux/features/cart";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/redux/service/wishlist/wishlistApi";
import { Heart, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProductItem } from "@/redux/service/product/productApi";
import { ProductGridSkeleton } from "@/components/skeleton";
import { getImageUrl } from "@/lib/utils";

export default function WishlistClient() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth?.accessToken);
  const { data: apiWishlist } = useGetWishlistQuery(undefined, { skip: !token });
  const [toggleWishlistApi] = useToggleWishlistMutation();

  const reduxItems = useAppSelector((state) => state.wishlist?.items) || [];
  const items: ProductItem[] =
    token && Array.isArray(apiWishlist?.data) && apiWishlist.data.length > 0
      ? apiWishlist.data
      : reduxItems;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveToBag = (product: ProductItem) => {
    dispatch(
      addToCart({
        id: product?.id,
        title: product?.title,
        price: product?.price,
        imageUrl: product?.imageUrl,
        size: "M",
        quantity: 1,
      })
    );
    dispatch(removeFromWishlist(product?.id));
    if (token) {
      toggleWishlistApi(product?.id).catch(() => { });
    }
    toast.success("Moved to Shopping Bag", {
      description: `${product?.title} (Size: M)`,
    });
  };

  const handleRemove = (id: string, title: string) => {
    dispatch(removeFromWishlist(id));
    if (token) {
      toggleWishlistApi(id).catch(() => { });
    }
    toast.info("Removed from wishlist", { description: title });
  };

  return (
    <div className="w-full min-h-[70vh] bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-[1500px] mx-auto">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-900 flex items-center gap-2.5">
              <span>My Wishlist</span>
              <span className="text-base font-medium text-neutral-500 lowercase">
                ({items.length} items)
              </span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Save your favorite items here and move them to your bag anytime.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Wishlist Items Grid */}
        {!mounted ? (
          <ProductGridSkeleton count={4} columns={4} />
        ) : items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
              <Heart size={30} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Explore our curated Drop-Shoulder T-Shirts, Sweat Shirts, and
              Hoodies and save items you love.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors shadow"
            >
              Discover Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {items.map((product) => (
              <div
                key={product?.id}
                className="group relative flex flex-col bg-white border border-neutral-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image with Slide-Up Close View */}
                <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
                  <Link href={product?.id ? `/product/${product.id}` : "/shop"} className="block w-full h-full relative">
                    <Image
                      src={getImageUrl(product?.imageUrl || product?.images?.[0] || "/products/product-1.jpg")}
                      alt={product?.title || ""}
                      fill
                      unoptimized={(product?.imageUrl || "").startsWith("data:")}
                      className="object-cover object-top select-none"
                    />

                    {/* Secondary Close-Shot Image - Slides up smoothly from bottom to top on hover */}
                    {product?.images && product?.images.length > 1 && (
                      <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out will-change-transform overflow-hidden z-1 bg-neutral-100">
                        <Image
                          src={getImageUrl(product?.images[1])}
                          alt={`${product?.title || ""} close view`}
                          fill
                          unoptimized={(product?.images[1] || "").startsWith("data:")}
                          className="object-cover object-center scale-115 transition-transform duration-700 ease-out select-none"
                        />
                        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium tracking-wide px-1.5 py-0.5 rounded-xs">
                            Close View
                          </span>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product?.id, product?.title)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 flex items-center justify-center shadow transition-colors cursor-pointer z-10"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#16A34A]">
                      {product?.subCategory || "Men"}
                    </span>
                    <Link
                      href={product?.id ? `/product/${product.id}` : "/shop"}
                      className="block text-xs font-bold text-neutral-900 hover:underline line-clamp-1 mt-0.5"
                    >
                      {product?.title}
                    </Link>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className="text-sm font-extrabold text-neutral-900">
                        ৳ {product?.price.toFixed(0)}
                      </span>
                      {product?.originalPrice &&
                        product?.originalPrice > product?.price && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            ৳ {product?.originalPrice.toFixed(0)}
                          </span>
                        )}
                      {product?.originalPrice &&
                        product?.originalPrice > product?.price && (
                          <span className="bg-red-50 text-red-700 font-bold text-[9.5px] px-1.5 py-0.5 rounded border border-red-200 leading-none">
                            {Math.round(
                              ((product?.originalPrice - product?.price) /
                                product?.originalPrice) *
                              100
                            )}
                            % Off
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Move to Bag CTA */}
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(product)}
                    className="group/btn relative overflow-hidden w-full h-8.5 border border-neutral-900 bg-white text-neutral-900 text-[11px] font-bold uppercase tracking-wider rounded-xs flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-neutral-900 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out will-change-transform" />
                    <span className="relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-300 text-neutral-900 group-hover/btn:text-white">
                      <ShoppingBag size={13} className="shrink-0 transition-colors duration-300" />
                      <span>Move To Bag</span>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
