import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atella Beach Resort | Premium Lake Victoria Experience in Kisumu",
  description: "Discover the ultimate lakeside escape at Atella Beach Resort. Sunset boat cruises, DJ nights, family staycations, and authentic Kenyan lakeside dining on Lake Victoria's shores.",
  keywords: ["beach resort", "Lake Victoria", "Kisumu", "boat cruise", "events", "dining", "Kenya"],
  authors: [{ name: "Atella Beach Resort" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Atella Beach Resort | Lake Victoria, Kisumu",
    description: "Premium lakeside resort experiences on Lake Victoria",
    url: "https://atellabeach.com",
    siteName: "Atella Beach Resort",
    images: [
      {
        url: "/images/hero-lake.png",
        width: 1200,
        height: 630,
        alt: "Atella Beach Resort sunset",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#d97706" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
