import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | XOVAAR",
  description: "Learn how XOVAAR collects, protects, and respects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] block mb-2">
            Data Protection &amp; Security
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
            Your privacy is foundational to our brand relationship. Here is how your information is handled with absolute confidentiality.
          </p>
        </div>

        <div className="space-y-8 text-neutral-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or create an account with XOVAAR, we collect your name, mobile phone number, delivery address, and optionally your email address. For guests checking out, this information is automatically safeguarded within your customer profile for seamless tracking and warranty verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              2. How We Use Your Data
            </h2>
            <p>
              We process your details exclusively to dispatch parcels via authorized courier networks, generate official tax invoices, provide SMS/email delivery tracking updates, and provide direct concierge customer service. We do not sell, lease, or monetize your contact information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              3. Rate Limiting &amp; Infrastructure Security
            </h2>
            <p>
              To protect our users from distributed cyber attacks and credential stuffing, XOVAAR utilizes sliding window rate-limiting engines powered by Redis, multi-layer HTTPS encryption, and cryptographically salted password hashing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              4. Cookies &amp; Local Sessions
            </h2>
            <p>
              We use secure, HTTP-only cookies and local session caching solely to preserve your active shopping bag items and keep you signed in securely between browser sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              5. Your Rights &amp; Data Erasure
            </h2>
            <p>
              You maintain the absolute right to view your stored order history, update your registered email or phone, or request full account deactivation by emailing our support desk at contact@xovaar.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
