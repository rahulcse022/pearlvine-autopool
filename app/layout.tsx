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
  title: "Pearlvine PVC Referral & Auto Pool - Smart Contract Platform",
  description:
    "200,000 PVC Global Auto Pool, 50,000 PVC Direct Referral Rewards, 10-Level Reward System, and 500 PVC Airdrop protocol.",
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
