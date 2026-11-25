import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | XOVAAR",
  description: "Read the official terms and conditions for ordering and shopping at XOVAAR.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] block mb-2">
            Legal Terms &amp; Policies
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Terms &amp; Conditions
          </h1>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
            Last Updated: November 2026. Please read these terms carefully before placing an order.
          </p>
        </div>

        <div className="space-y-8 text-neutral-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or completing a transaction on XOVAAR (www.xovaar.com), you acknowledge and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please refrain from using our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              2. Product Descriptions &amp; Pricing
            </h2>
            <p>
              All prices listed on the site are in Bangladeshi Taka (BDT) and are inclusive of applicable local value-added taxes unless stated otherwise. We make every reasonable effort to display accurate color palettes, fabric specifications, and dimensions. However, actual colors may vary slightly depending on your monitor and screen display calibrator.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              3. Order Confirmation &amp; Payment
            </h2>
            <p>
              Upon placing an order via Cash on Delivery (COD), bKash, or Nagad, you will receive an immediate electronic order confirmation number (e.g., XV-0001) along with a tax invoice. XOVAAR reserves the right to cancel or hold orders in instances of suspected fraudulent transactions or inaccurate contact numbers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              4. Shipping &amp; Delivery Terms
            </h2>
            <p>
              Deliveries inside Dhaka are completed within 24 to 48 hours (standard fee: ৳70). Deliveries outside Dhaka are handled via dedicated courier networks within 48 to 96 hours (standard fee: ৳130). Free delivery is automatically granted on qualifying promotional items or carts exceeding ৳3,000.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              5. Intellectual Property
            </h2>
            <p>
              All trademarks, photographic visuals, graphic assets, typography, and logos displayed on this site are the exclusive property of XOVAAR and are protected under Bangladeshi and international copyright laws.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
