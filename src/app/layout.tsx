import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
import FloatingWhatsApp from "@/components/chat/FloatingWhatsApp";
import GlobalSiteLoader from "@/components/loader/GlobalSiteLoader";
import PageTransition from "@/components/transition/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xovaar.com"),
  title: {
    default: "Xovaar | Minimalist-Aura & Contemporary Fashion",
    template: "%s | Xovaar",
  },
  description:
    "Experience signature streetwear and contemporary fashion with Xovaar. Oversized Drop-Shoulder Tees, Thermal Sweatshirts, and Heavyweight Hoodies.",
  keywords: [
    "Xovaar",
    "streetwear",
    "drop-shoulder t-shirt",
    "sweatshirts",
    "hoodies",
    "bangladesh fashion",
    "oversized tee",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Xovaar | Minimalist-Aura & Contemporary Fashion",
    description:
      "Experience signature streetwear and contemporary fashion with Xovaar. Premium Drop-Shoulder Tees, Sweatshirts, and Hoodies.",
    url: "https://xovaar.com",
    siteName: "Xovaar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xovaar - Define Your Style",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xovaar | Minimalist-Aura & Contemporary Fashion",
    description:
      "Experience signature streetwear and contemporary fashion with Xovaar.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} w-full`} suppressHydrationWarning>
      <body
        className="min-h-screen w-full flex flex-col font-sans antialiased text-[#111111] bg-white selection:bg-neutral-900 selection:text-white"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <GlobalSiteLoader />
          <PageTransition>{children}</PageTransition>
          <Toaster richColors position="bottom-right" closeButton />
          <FloatingWhatsApp />
        </ReduxProvider>
      </body>
    </html>
  );
}
