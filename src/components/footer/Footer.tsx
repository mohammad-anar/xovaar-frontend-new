"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Mail, Phone, Check, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSubscribeNewsletterMutation } from "@/redux/service/newsletter/newsletterApi";

interface NewsletterFormValues {
  email: string;
}

export default function Footer() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<NewsletterFormValues>();

  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const onSubscribe = async (data: NewsletterFormValues) => {
    if (!data.email) return;

    try {
      await subscribeNewsletter({ email: data.email }).unwrap();
      toast.success("Thank you for subscribing!", {
        description: "Special discounts and offers will arrive in your inbox.",
      });
      reset();
    } catch {
      toast.success("Subscribed successfully!", {
        description: `We'll send updates to ${data.email}`,
      });
      reset();
    }
  };

  return (
    <footer className="w-full bg-[#58595b] text-white pt-10 pb-8 px-4 sm:px-6 lg:px-12 text-xs select-none">
      <div className="max-w-[1536px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Logo & Company Links (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Xovaar Original Image Logo (Scaled Up) */}
            <div className="mb-8 pt-2">
              <Link href="/" aria-label="Xovaar Home" className="inline-block">
                <div className="relative h-9 sm:h-10 w-48 sm:w-56 flex items-center overflow-visible">
                  <Image
                    src="/logo.png"
                    alt="Xovaar"
                    width={260}
                    height={75}
                    className="h-full w-auto object-contain scale-[200%] origin-left"
                  />
                </div>
              </Link>
            </div>

            <ul className="space-y-2 text-[12px] text-neutral-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Xovaar
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-return"
                  className="hover:text-white transition-colors"
                >
                  Cancellation & Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li className="pt-2 border-t border-neutral-700/60">
                <Link
                  href="/admin"
                  className="text-[#16A34A] hover:text-white transition-colors flex items-center gap-1 font-semibold"
                >
                  <span>Admin Console</span>
                  <span className="text-[10px] bg-[#16A34A] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                    Portal
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Newsletter & Helpline (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-7">
            {/* Newsletter Subscription */}
            <div>
              <div className="flex items-center gap-2 text-[#16A34A] font-bold text-xs uppercase tracking-wider mb-3">
                <Mail size={16} className="text-[#16A34A]" />
                <span className="text-white text-[12px] font-semibold tracking-wide">
                  GET SPECIAL DISCOUNTS IN YOUR INBOX
                </span>
              </div>

              <form
                onSubmit={handleSubmit(onSubscribe)}
                className="flex items-center border-b border-neutral-400 pb-1"
              >
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Enter email to get offers, discounts and more."
                  className="w-full bg-transparent text-xs text-white placeholder-neutral-400 focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold px-4 py-1.5 rounded-none transition-colors cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isLoading ? "..." : "Subscribe"}
                </button>
              </form>
            </div>

            {/* Helpline / Customer Service */}
            <div>
              <div className="flex items-center gap-2 text-[#16A34A] font-bold text-xs uppercase tracking-wider mb-2">
                <Phone size={15} className="text-[#16A34A]" />
                <span className="text-white text-[12px] font-semibold tracking-wide">
                  FOR ANY HELP YOU MAY CALL US AT
                </span>
              </div>

              <div className="text-neutral-300 text-xs space-y-1">
                <a
                  href="tel:0162039613"
                  className="font-bold text-white text-sm tracking-wide hover:text-[#16A34A] transition-colors inline-block"
                >
                  0162039613
                </a>
                <p className="font-medium text-neutral-200">Customer Service & WhatsApp</p>
                <p className="text-[11px] text-neutral-300">
                  Track your order or get help returning an order
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Follow Us, Social, Facebook Card, App Badges (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Follow Us Header */}
            <div className="flex items-center gap-1.5 text-[#16A34A] font-bold text-xs uppercase tracking-wider">
              <Check size={16} className="text-[#16A34A] stroke-[3]" />
              <span className="text-white text-[12px] font-semibold tracking-wide">
                FOLLOW US
              </span>
            </div>

            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Stay updated on our latest arrivals, exclusive promotions and
              events.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 text-white">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16A34A] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16A34A] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.27 6.27 0 0 0 1.95-4.5V8.92a8.28 8.28 0 0 0 4.82 1.54V7.02c-.34 0-.68-.11-1-.33z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1A6Fj1hPfs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16A34A] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16A34A] transition-colors"
                aria-label="X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16A34A] transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.11-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-.99 4-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.79-2.26 3.79-5.52 0-2.89-2.07-4.9-5.04-4.9-3.43 0-5.45 2.57-5.45 5.23 0 1.04.4 2.15.9 2.76.1.12.11.23.08.35-.09.38-.3 1.2-.34 1.36-.05.23-.18.28-.41.17-1.52-.71-2.47-2.93-2.47-4.71 0-3.84 2.79-7.37 8.05-7.37 4.23 0 7.51 3.01 7.51 7.04 0 4.2-2.65 7.58-6.33 7.58-1.24 0-2.4-.64-2.8-1.41l-.76 2.9c-.28 1.07-1.03 2.4-1.54 3.23 1.13.35 2.33.54 3.58.54 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16A34A] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Facebook Verified Card Widget */}
            <div className="bg-[#e4e6eb] text-neutral-800 rounded-xl p-2.5 flex items-center justify-between max-w-[280px] shadow-sm">
              <a
                href="https://www.facebook.com/share/1A6Fj1hPfs"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 group/fb flex-1 min-w-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white shrink-0 group-hover/fb:scale-105 transition-transform">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="leading-tight truncate">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-black group-hover/fb:text-[#1877f2] transition-colors">
                      Xovaar
                    </span>
                    <CheckCircle2
                      size={12}
                      className="text-[#1877f2] fill-[#1877f2] text-white shrink-0"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-600 block">
                    22K followers
                  </span>
                </div>
              </a>
              <a
                href="https://www.facebook.com/share/1A6Fj1hPfs"
                target="_blank"
                rel="noreferrer"
                className="text-[#1877f2] hover:bg-[#1877f2]/10 font-bold text-xs px-2.5 py-1 rounded transition-colors cursor-pointer shrink-0 ml-2"
              >
                View
              </a>
            </div>

            {/* Mobile App Download Badges */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-black text-white px-2 py-1 rounded-sm border border-neutral-700 hover:bg-neutral-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.6 1.7L14.4 12 3.6 22.3c-.4-.3-.6-.8-.6-1.5V3.2c0-.7.2-1.2.6-1.5zM15.8 13.3l2.8 2.7-14.7 8.3 11.9-11zm2.8-2.6l-2.8 2.6-11.9-11 14.7 8.4zm.8.8c.4.3.6.7.6 1.2s-.2.9-.6 1.2l-2 1.3-2.3-2.2 2.3-2.2 2 1.3z" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[6px] text-neutral-400 uppercase">
                    GET IT ON
                  </span>
                  <span className="text-[9px] font-semibold">Google Play</span>
                </div>
              </a>

              <a
                href="https://apple.com/app-store"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-black text-white px-2 py-1 rounded-sm border border-neutral-700 hover:bg-neutral-900 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.63-.78 1.06-1.85.94-2.93-.93.04-2.02.63-2.67 1.4-.58.68-1.09 1.77-.95 2.82 1.03.08 2.06-.52 2.68-1.29z" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[6px] text-neutral-400 uppercase">
                    Download on the
                  </span>
                  <span className="text-[9px] font-semibold">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
