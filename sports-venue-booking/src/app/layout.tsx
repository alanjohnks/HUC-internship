import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sports Booking",
  description: "Venue Booking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      
      <body className="min-h-screen bg-surface text-on-surface flex flex-col">
        

        {children}
      </body>
    </html>
  );
}
