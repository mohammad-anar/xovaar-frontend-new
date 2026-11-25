import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Cancellation & Return Policy | XOVAAR",
  description: "Read XOVAAR's 7-day hassle-free exchange and cancellation guidelines.",
};

export default function CancellationReturnPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-neutral-200 pb-8 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] block mb-2">
            Hassle-Free Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Cancellation &amp; Return Policy
          </h1>
          <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
            We hold ourselves to the highest manufacturing standards. If an item does not meet your expectations, our exchange process is swift and transparent.
          </p>
        </div>

        <div className="space-y-8 text-neutral-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              1. 7-Day Exchange Window
            </h2>
            <p>
              You may initiate an exchange within 7 days of parcel receipt for any sizing misfit or factory manufacturing defect. Garments must be unworn, unwashed, unaltered, and accompanied by original hangtags and packaging.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              2. Order Cancellations
            </h2>
            <p>
              Orders can be cancelled free of charge at any time prior to courier dispatch by calling our helpline at +880 1620-396130 or messaging us on WhatsApp. Once a parcel has been handed over to the courier partner, standard return procedures apply.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              3. Courier Inspection at Delivery (COD)
            </h2>
            <p>
              For Cash on Delivery parcels, you are encouraged to verify the package contents in front of the courier delivery executive. If the package has been tampered with or an incorrect size was delivered, you may hand the parcel directly back to the delivery rider with zero payment obligation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              4. Return Shipping Process
            </h2>
            <p>
              To initiate a doorstep return or exchange, notify our concierge via WhatsApp with your Order ID (e.g., XV-0001). Our rider will pick up the exchange item directly from your address inside Dhaka or provide reverse courier instructions outside Dhaka.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              5. Refund Policy
            </h2>
            <p>
              In situations where an exchange replacement size is out of stock, refunds for prepaid orders (bKash/Nagad) are remitted directly to the customer&apos;s account within 3 to 5 business days following quality verification.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
