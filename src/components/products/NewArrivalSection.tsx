"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      {/* Section Header - Clean Container Header with smooth scroll entrance */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 font-sans">
          ALL PRODUCTS
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1 max-w-xl mx-auto">
          Explore Our Complete Collection.
        </p>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 bg-[#16A34A] mx-auto mt-2.5 rounded-full"
        />
      </motion.div>

      {/* 4-Column Responsive Product Grid for Laptop and Desktop */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product?.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: 0.45,
                  delay: (idx % 4) * 0.07,
                  ease: "easeOut",
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
