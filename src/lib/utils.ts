import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBackendBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.xovaar.com/api/v1";
  return apiUrl.replace(/\/api\/v1\/?$/, "");
};

/**
 * Ensures any uploaded image path from the API (e.g. /uploads/image.jpg)
 * is prepended with the backend base URL (https://api.xovaar.com/uploads/image.jpg).
 * Absolute URLs and local public assets (/products/...) are kept intact.
 */
export const getImageUrl = (url?: string | null): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  // If it's a backend uploaded image path (e.g. /uploads/... or uploads/...)
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const base = getBackendBaseUrl();
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${base}${cleanPath}`;
  }
  return trimmed;
};
