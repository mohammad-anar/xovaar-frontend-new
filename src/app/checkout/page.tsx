import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FloatingChat from "@/components/chat/FloatingChat";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout & Confirmation - Xovaar",
  description: "Secure checkout and instant order confirmation.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#faf6f2]">
      {/* Top Main Navbar */}
      <Navbar />

      {/* Checkout & Confirmation Client Content */}
      <CheckoutClient />

      {/* Website Footer */}
      <Footer />

      {/* Floating Chat */}
      <FloatingChat />
    </main>
  );
}