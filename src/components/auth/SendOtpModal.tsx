"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Mail, Phone, ArrowRight, ArrowLeft, KeyRound, AlertCircle } from "lucide-react";
import { useSendOtpMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";

interface SendOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpSent: (identifier: string, previewOtp?: string) => void;
  onBackToLogin: () => void;
}

export default function SendOtpModal({
  isOpen,
  onClose,
  onOtpSent,
  onBackToLogin,
}: SendOtpModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();

    if (!cleanId) {
      toast.error("Please enter your registered Email or Phone number");
      return;
    }

    try {
      const res = await sendOtp({ identifier: cleanId }).unwrap();
      const previewOtp = res?.data?.otp;
      toast.success("Verification code sent!", {
        description: `6-digit OTP code sent for ${res?.data?.emailOrPhone || cleanId}.`,
      });
      onOtpSent(cleanId, previewOtp);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to send OTP code. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white text-neutral-900 border border-neutral-300 rounded-none w-full max-w-md shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative h-7 w-32 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="XOVAAR"
                width={130}
                height={38}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
          <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-3">
            <KeyRound size={20} className="text-neutral-800" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
            Account Recovery
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Enter your registered email or phone to receive a 6-digit verification code.
          </p>
        </div>

        {/* OTP Request Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
              Email or Mobile Phone Number *
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. name@example.com or 017XXXXXXXX"
                autoFocus
                required
                className="w-full bg-[#fbf9f6] border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neutral-950 hover:bg-black text-white text-xs font-black uppercase tracking-wider py-3 rounded-none flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Verification Code...
              </span>
            ) : (
              <>
                <span>Send 6-Digit Code</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft size={13} />
            <span>Back to Account Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
