import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | XOVAAR Concierge",
  description: "Get in touch with XOVAAR for order inquiries, wholesale, and customer support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] block mb-2">
            Customer Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Contact XOVAAR
          </h1>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
            Have a question regarding your order, styling suggestions, or sizing? Our support team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Direct Contact Info */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
              Corporate Headquarters
            </h2>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="flex items-start gap-3 bg-[#fbf9f6] border border-neutral-200 p-4">
                <MapPin size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-neutral-900 mb-1">Office Address</p>
                  <p>XOVAAR Atelier, Road 11, Block D, Banani</p>
                  <p>Dhaka-1213, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#fbf9f6] border border-neutral-200 p-4">
                <Phone size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-neutral-900 mb-1">Direct Helpline</p>
                  <p>+880 1620-396130</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Available 10:00 AM – 10:00 PM (Everyday)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#fbf9f6] border border-neutral-200 p-4">
                <Mail size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-neutral-900 mb-1">Email Support</p>
                  <p>contact@xovaar.com</p>
                  <p>support@xovaar.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#fbf9f6] border border-neutral-200 p-4">
                <Clock size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wider text-neutral-900 mb-1">Operating Hours</p>
                  <p>Sunday – Saturday: 10:00 AM – 10:00 PM BST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-200 pb-2">
              Send an Inquiry
            </h2>

            <form className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanzid Mahmud"
                  className="w-full bg-[#fbf9f6] border border-neutral-300 px-3.5 py-2.5 rounded-none text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Mobile Number or Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX or name@example.com"
                  className="w-full bg-[#fbf9f6] border border-neutral-300 px-3.5 py-2.5 rounded-none text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Subject / Order ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inquiry about XV-0001"
                  className="w-full bg-[#fbf9f6] border border-neutral-300 px-3.5 py-2.5 rounded-none text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our concierge team help you today?"
                  className="w-full bg-[#fbf9f6] border border-neutral-300 px-3.5 py-2.5 rounded-none text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Submit Inquiry</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
