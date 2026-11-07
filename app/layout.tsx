import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PearlvineProvider } from "@/context/PearlvineContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Modal from "@/components/common/Modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pearlvine PVC Referral & Auto Pool",
  description:
    "On-chain PVC referral rewards, 10-level uplines, and FIFO AutoPool distribution.",
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
      </head>
      <body className="bg-slate-100 text-slate-800 antialiased min-h-screen flex flex-col font-sans">
        <PearlvineProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Modal />
        </PearlvineProvider>
      </body>
    </html>
  );
}
