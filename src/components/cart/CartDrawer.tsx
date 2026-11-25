"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {
  closeCart,
  updateQuantity,
  removeFromCart,
} from "@/redux/features/cart";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CartDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);
  const items = cartState?.items || [];
  const isOpen = !!cartState?.isOpen;

  const subtotal = items.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 1),
    0
  );
  const totalItemsCount = items.reduce((sum, item) => sum + (item?.quantity || 1), 0);

  const hasFreeDeliveryItem = items.some((item) => item?.freeDelivery === true);
  const isFreeDelivery = hasFreeDeliveryItem || subtotal >= 3000 || subtotal === 0;
  const shippingCost = isFreeDelivery ? 0 : 80;
  const grandTotal = subtotal + shippingCost;

  const handleCheckout = () => {
    dispatch(closeCart());
    router.push("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-[visibility] duration-500 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={() => dispatch(closeCart())}
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 transform transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-neutral-900" />
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 uppercase">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => dispatch(closeCart())}
              className="p-1 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
              aria-label="Close bag drawer"
            >
              <X size={19} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-base text-neutral-900">
                  Your bag is empty
                </h3>
                <p className="text-xs text-neutral-500 mt-1 mb-5 max-w-xs">
                  Discover our exclusive Drop-Shoulder T-Shirts, Sweat Shirts,
                  and Hoodies.
                </p>
                <Link
                  href="/shop"
                  onClick={() => dispatch(closeCart())}
                  className="bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-black transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3.5 pb-4 border-b border-neutral-100 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 aspect-[3/4] bg-neutral-100 rounded overflow-hidden shrink-0 border border-neutral-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.id}`}
                          onClick={() => dispatch(closeCart())}
                          className="text-xs font-bold text-neutral-900 hover:underline line-clamp-2 leading-snug"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              removeFromCart({ id: item.id, size: item.size })
                            )
                          }
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center border border-neutral-300 rounded h-7 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                size: item.size,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="w-6 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                size: item.size,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="w-6 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900">
                        ৳ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-3">
              {/* Free delivery tracker */}
              <div className="text-[11px] text-neutral-600">
                {hasFreeDeliveryItem ? (
                  <p className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span>🎉</span> Free Delivery Applied to Bag!
                  </p>
                ) : subtotal >= 3000 ? (
                  <p className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span>🎉</span> You qualify for FREE Delivery!
                  </p>
                ) : (
                  <p>
                    Add <strong>৳ {(3000 - subtotal).toFixed(0)}</strong> more
                    to get <strong>FREE Delivery</strong>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">
                    ৳ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-neutral-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">
                        FREE
                      </span>
                    ) : (
                      `৳ ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span>৳ {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full h-11 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="w-full text-center text-[11px] text-neutral-500 hover:text-black font-semibold pt-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
