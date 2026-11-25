"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/skeleton";
import {
  useGetNewArrivalsQuery,
  DEFAULT_NEW_ARRIVALS,
  ProductItem,
} from "@/redux/service/product/productApi";
import { AdminStorage } from "@/services/adminStore";

export default function NewArrivalSection() {
  const { data: apiData, isLoading } = useGetNewArrivalsQuery();
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_NEW_ARRIVALS);

  useEffect(() => {
    if (apiData?.data && apiData.data.length > 0) {
      setProducts(apiData.data);
    } else {
      setProducts(AdminStorage.getProducts());
    }
  }, [apiData]);

  return (
    <section className="w-full bg-white py-8 md:py-12">
      {/* Section Header - Clean Container Header without background banner */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 font-sans">
          ALL PRODUCTS
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1 max-w-xl mx-auto">
          Explore Our Complete Collection.
        </p>
        <div className="w-12 h-1 bg-[#16A34A] mx-auto mt-2.5 rounded-full" />
      </div>

      {/* 4-Column Responsive Product Grid for Laptop and Desktop */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
