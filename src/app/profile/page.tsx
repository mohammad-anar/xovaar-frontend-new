import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FloatingChat from "@/components/chat/FloatingChat";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Account - Xovaar",
  description: "Manage your profile, view orders, and update shipping details.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileClient />
      <Footer />
      <FloatingChat />
    </main>
  );
}
