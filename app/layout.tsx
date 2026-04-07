import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const displayFont = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superior Fits Dashboard",
  description: "Streetwear ecommerce dashboard with filters, size guidance, checkout, and order tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="relative min-h-full">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.28),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(234,88,12,0.28),transparent_45%)]" />
          <div className="relative z-10">
            <Navbar />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
