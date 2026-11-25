import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import BestSalesSlider from "@/components/products/BestSalesSlider";
import NewArrivalSection from "@/components/products/NewArrivalSection";
import XovaarFamilySection from "@/components/home/XovaarFamilySection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Top Main Navbar */}
      <Navbar />

      {/* Full-screen Hero Section with background banner & bottom ticker */}
      <HeroSection />

      {/* New and Best Sales Product Card Slider (Left to Right smooth sliding) */}
      <BestSalesSlider />

      {/* New Arrival Product Grid Section */}
      <NewArrivalSection />

      {/* Xovaar's Family Moments Slider Section */}
      <XovaarFamilySection />

      {/* Website Footer */}
      <Footer />
    </main>
  );
}
