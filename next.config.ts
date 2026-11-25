import type { NextConfig } from "next";

const isStandalone =
  process.env.DOCKER_BUILD === "true" || process.env.OUTPUT_STANDALONE === "true";

const nextConfig: NextConfig = {
  ...(isStandalone ? { output: "standalone" } : {}),
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
