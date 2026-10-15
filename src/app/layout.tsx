import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { CartProvider } from "@/context/CartContext";

import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Halo Bites | Premium Treats",
  description: "Delicious treats and premium bites delivered to you.",
  icons: {
    icon: [
      { url: "/logo.png?v=2", type: "image/png" },
      { url: "/favicon.ico?v=2" },
    ],
    shortcut: "/logo.png?v=2",
    apple: "/logo.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png?v=2" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-zinc-50 text-zinc-950`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
