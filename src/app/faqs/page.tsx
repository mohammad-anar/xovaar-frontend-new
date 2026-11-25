import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | XOVAAR",
  description: "Find answers regarding delivery timelines, sizing, returns, and ordering with XOVAAR.",
};

const FAQS_DATA = [
  {
    q: "How fast is delivery inside Dhaka and across Bangladesh?",
    a: "Orders inside Dhaka are delivered within 24 to 48 hours for a flat fee of ৳70. Delivery across all 64 districts outside Dhaka takes between 48 and 96 hours via express courier partners for ৳130. Carts exceeding ৳3,000 enjoy free nationwide delivery.",
  },
  {
    q: "How do I choose the correct size for drop-shoulder tees and hoodies?",
    a: "Our garments are engineered with relaxed, contemporary drop-shoulder proportions. If you prefer a tailored fit, choose your standard regular size; for an exaggerated relaxed streetwear drape, we suggest ordering your true size or consulting our visual size chart.",
  },
  {
    q: "Can I inspect the product before paying with Cash on Delivery?",
    a: "Yes. Customers are encouraged to inspect parcel seals in front of the courier delivery executive before completing cash payment.",
  },
  {
    q: "How can I track my order status?",
    a: "You can track your order at any moment by navigating to your Account Profile or using the Order Tracking portal with your Order ID (e.g., XV-0001) and mobile number.",
  },
  {
    q: "What payment methods are supported?",
    a: "We accept Cash on Delivery (COD) nationwide, alongside instant direct mobile payments via bKash and Nagad.",
  },
  {
    q: "What happens if I ordered without creating an account?",
    a: "When you place an order as a guest, our platform automatically sets up your secure account linked to your phone number and generates your tax invoice so you never lose track of past purchases.",
  },
];

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] block mb-2">
            Help Center &amp; Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
            Everything you need to know about our fabric craftsmanship, logistics, and customer service.
          </p>
        </div>

        <div className="space-y-6">
          {FAQS_DATA.map((item, index) => (
            <div
              key={index}
              className="border border-neutral-200 bg-[#fbf9f6] p-5 sm:p-6 transition-colors hover:border-neutral-400"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-2 mb-2">
                <span className="text-[#16A34A] font-mono">Q{index + 1}.</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
