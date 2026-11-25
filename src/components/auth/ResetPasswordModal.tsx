"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";

interface ResetPasswordModalProps {
  isOpen: boolean;
  identifier: string;
  initialOtp?: string;
  onClose: () => void;
  onSuccess: () => void;
  onBackToSendOtp: () => void;
}

export default function ResetPasswordModal({
  isOpen,
  identifier,
  initialOtp = "",
  onClose,
  onSuccess,
  onBackToSendOtp,
}: ResetPasswordModalProps) {
  const [otp, setOtp] = useState(initialOtp);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    const cleanNewPass = newPassword.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    if (cleanNewPass.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (cleanNewPass !== confirmPassword.trim()) {
      toast.error("Passwords do not match. Please re-type password.");
      return;
    }

    try {
      await resetPassword({
        identifier,
        otp: cleanOtp,
        newPassword: cleanNewPass,
      }).unwrap();

      toast.success("Password reset successfully!", {
        description: "You can now sign in with your new password.",
      });
      onSuccess();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to reset password. Please check your OTP.";
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
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={20} className="text-[#166534]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
            Set New Password
          </h2>
          <p className="text-xs text-neutral-500 mt-1 font-medium">
            Reset password for <span className="font-bold text-neutral-800">{identifier}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
              6-Digit Verification Code *
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 543210"
              autoFocus
              required
              className="w-full bg-[#fbf9f6] border border-neutral-300 rounded-none px-3.5 py-2.5 text-center text-lg font-mono tracking-widest text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
              New Password (Min 6 Characters) *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full bg-[#fbf9f6] border border-neutral-300 rounded-none px-3.5 py-2.5 pr-10 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              required
              className="w-full bg-[#fbf9f6] border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-neutral-950 hover:bg-black text-white text-xs font-black uppercase tracking-wider py-3 rounded-none flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting Password...
              </span>
            ) : (
              <>
                <span>Save New Password &amp; Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToSendOtp}
            className="inline-flex items-center gap-1 font-bold text-neutral-600 hover:text-black cursor-pointer uppercase tracking-wider text-[11px]"
          >
            <ArrowLeft size={12} />
            <span>Resend Code</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-neutral-600 hover:text-black cursor-pointer uppercase tracking-wider text-[11px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
