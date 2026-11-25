"use client";

import React from "react";
import Image from "next/image";
import { PhoneCall, MapPin, Truck, CheckCircle2, ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { OrderStatus } from "@/services/adminStore";

export interface InvoiceItem {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl?: string;
}

export interface InvoiceOrderData {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryType?: "inside" | "outside" | string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  discount?: number;
  status: OrderStatus | string;
  manual?: boolean;
  date: string;
  paymentMethod?: string;
  items: InvoiceItem[];
}

interface OrderPrintInvoiceProps {
  order: InvoiceOrderData;
}

export default function OrderPrintInvoice({ order }: OrderPrintInvoiceProps) {
  // Calculate discount if not explicitly provided
  const computedSubtotal =
    order.subtotal > 0
      ? order.subtotal
      : order.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);

  const deliveryFee = order.deliveryFee ?? (order.deliveryType === "outside" ? 130 : 70);
  const total = order.total > 0 ? order.total : computedSubtotal + deliveryFee;

  // If subtotal + deliveryFee > total, difference is discount
  const discount =
    order.discount !== undefined
      ? order.discount
      : Math.max(0, computedSubtotal + deliveryFee - total);

  const paymentMethod = order.paymentMethod || "Cash On Delivery";
  const cleanId = order.id.replace(/^#/, "");
  const invoiceNumber = cleanId.startsWith("XV-") ? cleanId : `XV-${cleanId.replace(/[^0-9A-Z]/gi, "")}`;

  return (
    <div
      id="printable-invoice"
      className="w-full bg-white text-neutral-900 font-sans p-6 sm:p-8 text-[11px] leading-tight select-text max-w-4xl mx-auto"
      style={{ boxSizing: "border-box" }}
    >
      {/* 1. Header: Logo, Store Details & Invoice Meta */}
      <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-3 mb-3 gap-4">
        {/* Left: Brand Identity */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="relative h-8 w-32 flex items-center">
              <Image
                src="/logo.png"
                alt="XOVAAR"
                width={140}
                height={40}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase text-neutral-900">
              XOVAAR
            </span>
          </div>
          <p className="text-[10px] font-semibold text-neutral-600 tracking-wide uppercase">
            Wear Your Identity &bull; Define Your Style
          </p>
          <div className="text-[9.5px] text-neutral-500 mt-1 space-y-0.5">
            <p>House 42, Road 11, Banani, Dhaka-1213, Bangladesh</p>
            <p>Hotline: <strong className="text-neutral-800">0162039613</strong> &bull; support@xovaar.com &bull; www.xovaar.com</p>
          </div>
        </div>

        {/* Right: Invoice Type & Meta */}
        <div className="text-right flex flex-col items-end">
          <div className="inline-block bg-neutral-900 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded mb-1">
            Tax Invoice / Cash Memo
          </div>
          <div className="font-mono font-black text-sm text-neutral-900 mt-0.5">
            {invoiceNumber}
          </div>
          <div className="text-[10px] text-neutral-600 mt-0.5">
            Date: <span className="font-medium text-neutral-900">{order.date}</span>
          </div>
          <div className="text-[10px] text-neutral-600 mt-0.5">
            Payment: <span className="font-bold text-neutral-900">{paymentMethod}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 justify-end">
            <span className="text-[9.5px] font-bold text-neutral-500 uppercase">Status:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-900 border border-neutral-300">
              {order.status}
            </span>
            {order.manual && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                MANUAL
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Customer & Courier Information Grid */}
      <div className="grid grid-cols-2 gap-4 bg-neutral-50/90 border border-neutral-200 p-3 mb-3 text-[11px] rounded">
        {/* Client Details */}
        <div>
          <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
            <MapPin size={11} className="text-[#16A34A]" /> Billed &amp; Delivered To:
          </div>
          <div className="text-xs font-black text-neutral-900 leading-snug">
            {order.customerName || "Valued Customer"}
          </div>
          <div className="text-[11px] font-bold text-neutral-900 mt-0.5 flex items-center gap-1">
            <PhoneCall size={10} className="text-[#16A34A]" />
            <span>{order.phoneNumber || "0162039613"}</span>
          </div>
          <div className="text-[10px] text-neutral-700 mt-1 whitespace-pre-wrap leading-tight">
            {order.deliveryAddress || "Address details on file"}
          </div>
        </div>

        {/* Courier / Shipping Details */}
        <div className="border-l border-neutral-200 pl-4 flex flex-col justify-between">
          <div>
            <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
              <Truck size={11} className="text-[#16A34A]" /> Delivery &amp; Shipping Method:
            </div>
            <div className="text-xs font-bold text-neutral-900">
              {order.deliveryType === "outside"
                ? "Outside Dhaka Courier (৳130)"
                : "Inside Dhaka Standard Express (৳70)"}
            </div>
            <div className="text-[10px] text-neutral-600 mt-1">
              Payment Terms: <span className="font-black text-neutral-900">{paymentMethod}</span>
            </div>
          </div>
          <div className="mt-2 text-[9.5px] text-neutral-500 flex items-center gap-1">
            <CheckCircle2 size={11} className="text-[#16A34A]" />
            <span>Delivery Verification &bull; All Items Inspected</span>
          </div>
        </div>
      </div>

      {/* 3. Ordered Products Table */}
      <div className="mb-3 border border-neutral-300 rounded overflow-hidden">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-neutral-100 text-neutral-800 text-[9.5px] font-black uppercase tracking-wider border-b border-neutral-300">
              <th className="py-2 px-2.5 w-8 text-center">#</th>
              <th className="py-2 px-2.5">Full Product Title &amp; Details</th>
              <th className="py-2 px-2.5 w-16 text-center">Size</th>
              <th className="py-2 px-2.5 w-12 text-center">Qty</th>
              <th className="py-2 px-2.5 w-24 text-right">Unit Price</th>
              <th className="py-2 px-2.5 w-24 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-neutral-400 italic">
                  No items listed.
                </td>
              </tr>
            ) : (
              order.items.map((item, idx) => {
                const itemQty = item.quantity || 1;
                const itemTotal = (item.price || 0) * itemQty;
                return (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="py-2 px-2.5 text-center text-neutral-500 font-mono text-[10px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2.5 font-bold text-neutral-900 whitespace-normal break-words leading-tight">
                      {item.title}
                    </td>
                    <td className="py-2 px-2.5 text-center font-bold text-neutral-800">
                      <span className="inline-block bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded text-[9.5px]">
                        {item.size || "M"}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-center font-black text-neutral-900 text-xs">
                      {itemQty}
                    </td>
                    <td className="py-2 px-2.5 text-right font-medium text-neutral-700">
                      ৳ {(item.price || 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-2.5 text-right font-black text-neutral-900">
                      ৳ {itemTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Financial Calculations & Summary (Two columns) */}
      <div className="grid grid-cols-2 gap-4 pb-3 mb-3 border-b border-neutral-200">
        {/* Left: Terms and Instructions */}
        <div className="flex flex-col justify-between text-[9.5px] text-neutral-500 space-y-1.5 pr-4">
          <div>
            <p className="font-extrabold text-neutral-800 uppercase tracking-wider text-[10px] mb-1">
              Exchange &amp; Service Policy:
            </p>
            <p className="leading-snug">
              &bull; <strong>Exchange within 7 days</strong> with this original invoice.
            </p>
            <p className="leading-snug">
              &bull; Product must be unused, unwashed with all tags intact.
            </p>
            <p className="leading-snug">
              &bull; Cash on delivery payments must be settled in full with courier delivery agent.
            </p>
          </div>
          <div className="pt-2 text-[9px] text-neutral-400">
            For support or complaints: Hotline <strong>0162039613</strong> (WhatsApp available).
          </div>
        </div>

        {/* Right: Subtotal, Discount, Delivery Fee, Total */}
        <div className="bg-neutral-50/80 border border-neutral-200 p-2.5 rounded text-[11px] space-y-1.5">
          <div className="flex justify-between items-center text-neutral-600">
            <span>Subtotal</span>
            <span className="font-bold text-neutral-900">
              ৳ {computedSubtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span>Discount</span>
            <span className={`font-bold ${discount > 0 ? "text-emerald-700" : "text-neutral-500"}`}>
              {discount > 0 ? `- ৳ ${discount.toLocaleString()}` : "৳ 0"}
            </span>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span>Delivery Charge</span>
            <span className="font-bold text-neutral-900">
              ৳ {deliveryFee.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-neutral-600 pt-1 border-t border-dashed border-neutral-200 text-[10px]">
            <span>Payment Method</span>
            <span className="font-extrabold text-neutral-900 uppercase">
              {paymentMethod}
            </span>
          </div>

          <div className="flex justify-between items-center text-neutral-600 text-[10px]">
            <span>Order Status</span>
            <span className="font-black text-neutral-900 uppercase">
              {order.status}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t-2 border-neutral-900 text-sm font-black text-neutral-900">
            <span className="uppercase tracking-wider">Total Payable</span>
            <span className="text-base text-neutral-950 font-black">
              ৳ {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Footer & Legal Authorization Stamp */}
      <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-1">
        <div className="flex items-center gap-1.5 text-neutral-600 font-semibold">
          <ShieldCheck size={13} className="text-[#16A34A]" />
          <span>Authorized Computer Generated Invoice &bull; No Signature Required</span>
        </div>
        <div className="font-mono text-neutral-500">
          Generated: {new Date().toLocaleDateString("en-BD")} &bull; XOVAAR E-COMMERCE
        </div>
      </div>
    </div>
  );
}
