import { CartProvider } from "@/lib/cart-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taiwanese Breakfast - Order Online",
  description: "Order delicious Taiwanese breakfast online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
