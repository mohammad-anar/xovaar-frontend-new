import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FloatingChat from "@/components/chat/FloatingChat";
import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "My Wishlist - Xovaar",
  description: "View and manage your saved favorite clothing items.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <WishlistClient />
      <Footer />
      <FloatingChat />
    </main>
  );
}
