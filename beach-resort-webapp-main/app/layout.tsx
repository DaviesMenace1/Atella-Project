import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attela Beach Resort | Lake Victoria, Kisumu",
  description: "Experience the best of Lake Victoria at Attela Beach Resort in Kisumu, Kenya. Sunset boat rides, lakeside dining, events, and more.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
