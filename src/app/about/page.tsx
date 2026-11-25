import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "About Xovaar | Contemporary Artisanal Fashion",
  description:
    "Discover Xovaar - redefining Bangladeshi streetwear with minimalist aura, precision tailoring, and heavyweight fabric engineering.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] block mb-2">
            Our Heritage &amp; Vision
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            About XOVAAR
          </h1>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
            Minimalist Aura. Heavyweight Engineering. Uncompromising Contemporary Streetwear.
          </p>
        </div>

        <div className="space-y-10 text-neutral-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-950">
              1. The Genesis of XOVAAR
            </h2>
            <p>
              Born out of Dhaka&apos;s dynamic metropolitan scene, XOVAAR was established to bridge the gap between high-fashion architectural silhouettes and everyday streetwear durability. We believe modern garments should speak through structure, silhouette, and tactile fabric weights rather than loud, disposable logos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-950">
              2. Architectural Craftsmanship
            </h2>
            <p>
              Every drop-shoulder tee, heavyweight fleece hoodie, and structured trouser is patterned from scratch. We source ethically farmed combed cotton, custom-knit dense French terry fabrics ranging from 260 to 450 GSM, and subject every seam to reinforced twin-needle stitching built to endure hundreds of washes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-950">
              3. Ethical Production &amp; Bangladeshi Heritage
            </h2>
            <p>
              Bangladesh is globally celebrated for textile excellence, yet homegrown consumers rarely experience the finest tier of export-grade craftsmanship. XOVAAR honors this local heritage by partnering exclusively with certified, fair-wage manufacturing workshops in Dhaka and Gazipur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-950">
              4. Sustainable Consumption Philosophy
            </h2>
            <p>
              We operate on controlled seasonal capsule drops rather than high-volume fast fashion. By producing measured quantities and focusing on timeless neutrals—obsidian black, cement charcoal, rust brick, and bone white—we encourage our community to build purposeful, enduring wardrobes.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
