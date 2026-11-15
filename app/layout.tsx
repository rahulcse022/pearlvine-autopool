import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PearlvineProvider } from "@/context/PearlvineContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Modal from "@/components/common/Modal";
import PwaRegister from "@/components/pwa/PwaRegister";
import InstallBanner from "@/components/pwa/InstallBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pearlvine PVC Referral & Auto Pool",
  description:
    "On-chain PVC referral rewards, 10-level uplines, and FIFO AutoPool distribution.",
  applicationName: "Pearlvine",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pearlvine",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="bg-slate-100 text-slate-800 antialiased min-h-screen flex flex-col font-sans">
        <PearlvineProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <InstallBanner />
          <Modal />
          <PwaRegister />
        </PearlvineProvider>
      </body>
    </html>
  );
}
