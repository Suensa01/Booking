import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileCartBar } from "@/components/MobileCartBar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f59e0b",
};

export const metadata: Metadata = {
  title: {
    default: "Bites | We Serve The Taste You Love",
    template: "%s | Bites Artisanal Kitchen",
  },
  description:
    "We Serve The Taste You Love. Order handcrafted wood-fired pizzas, gourmet pastas, smash burgers, and fresh desserts online with fast delivery from Bites.",
  keywords: [
    "Bites restaurant",
    "online food ordering",
    "fresh pasta",
    "shawarma",
    "artisan pizza",
    "food delivery",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans h-full antialiased scroll-smooth`}>
      <body className={`${outfit.className} min-h-full flex flex-col bg-[#FDFBF7] text-stone-900 overflow-x-hidden selection:bg-amber-400 selection:text-stone-950`}>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full overflow-x-hidden">{children}</main>
          <CartDrawer />
          <MobileCartBar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
