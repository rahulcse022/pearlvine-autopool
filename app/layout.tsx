import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PearlvineProvider } from "@/context/PearlvineContext";
import Modal from "@/components/common/Modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pearlvine International - Auto Pool & Digital Revolution",
  description:
    "Pearlvine International - Automated Global Pool, Crypto Wallet, Scratch Card Rewards & Level Income platform.",
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
          {children}
          <Modal />
        </PearlvineProvider>
      </body>
    </html>
  );
}
