import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function XovaarLogo({
  className = "",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none ${className}`}
      aria-label="Xovaar Home"
    >
      <div className="relative h-8 sm:h-9 md:h-10 w-44 sm:w-52 md:w-56 flex items-center overflow-visible py-1">
        <Image
          src="/logo.png"
          alt="Xovaar"
          width={280}
          height={80}
          priority
          className="h-full w-auto object-contain scale-[200%] origin-left"
        />
      </div>
    </Link>
  );
}
