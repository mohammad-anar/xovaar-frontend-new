"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Lottie } from "lottie-react";
import reversedTransitionAnimation from "./lottie/menu-transition-reversed.json";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [prevPath, setPrevPath] = useState(pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  const isFirstRender = useRef(true);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  // Trigger pure black reversed Lottie wave transition on route change (storefront only)
  useEffect(() => {
    // Skip on the very first initial page load (handled by GlobalSiteLoader)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (pathname === prevPath) return;
    setPrevPath(pathname);

    // Completely disable page transition for admin dashboard routes
    if (pathname?.startsWith("/admin")) {
      setIsTransitioning(false);
      return;
    }

    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
    }

    // Mount fresh animation instance and run in reverse
    setIsTransitioning(true);
    setTransitionKey((prev) => prev + 1);

    // Animation runs smoothly for ~850ms then clears completely
    finishTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 850);
  }, [pathname, prevPath]);

  // For Admin Dashboard: Bypass transition overlay & wrapper completely for maximum productivity
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Pure Black Reversed Fullscreen Wave Lottie Page Transition (No Text) */}
      {isTransitioning && (
        <div
          key={transitionKey}
          aria-hidden="true"
          className="fixed inset-0 z-[99999] w-full max-w-full h-[100dvh] pointer-events-none overflow-hidden select-none"
        >
          <Lottie
            src={reversedTransitionAnimation}
            autoplay
            loop={false}
            rendererSettings={{ preserveAspectRatio: "none" }}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Page Content Container */}
      <div key={pathname} className="xovaar-page-enter flex-1 flex flex-col w-full">
        {children}
      </div>
    </>
  );
}
