"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePearlvine } from "@/context/PearlvineContext";
import { TabType } from "@/types";

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    isWeb3Connected,
    disconnectWallet,
    user,
  } = usePearlvine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; tab: TabType }[] = [
    { label: "Home", tab: "home" },
    { label: "About Us", tab: "about" },
    { label: "Contract Structure", tab: "structure" },
    { label: "Dashboard", tab: "dashboard" },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          className="flex items-center cursor-pointer space-x-3"
          onClick={() => handleNavClick("home")}
        >
          <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm flex items-center">
            <Image
              src="/full_logo.png"
              alt="Pearlvine International"
              width={130}
              height={34}
              style={{ width: "auto" }}
              className="h-7 sm:h-8 object-contain"
              priority
            />
          </div>
          <div className="hidden lg:flex items-center gap-1.5 bg-blue-500/10 text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            BSC Testnet (97)
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => handleNavClick(item.tab)}
              className={`transition py-1 text-xs font-semibold border-b-2 ${
                activeTab === item.tab
                  ? "text-cyan-400 border-cyan-400"
                  : "text-slate-300 hover:text-cyan-400 border-transparent hover:border-cyan-400"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Web3 Connect / Auth Button */}
          {isWeb3Connected ? (
            <div className="flex items-center space-x-2">
              <a
                href={`https://testnet.bscscan.com/address/${user.walletAddress}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                title="View Wallet on BscScan Testnet"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>
                  {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(38)}
                </span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
              <button
                type="button"
                onClick={disconnectWallet}
                className="text-slate-400 hover:text-red-400 text-xs p-1.5 transition"
                title="Disconnect Wallet"
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleNavClick("login")}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-signature"></i>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("register")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-3.5 py-2 rounded-xl font-bold transition shadow text-xs"
              >
                Register
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Toggle Navigation Menu"
          className="md:hidden text-white text-xl p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <i
            className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}
          ></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <div className="py-1 px-3 text-[11px] text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            BSC Testnet (Chain ID: 97)
          </div>
          {navItems.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => handleNavClick(item.tab)}
              className={`block w-full text-left py-2 px-3 rounded text-sm ${
                activeTab === item.tab
                  ? "bg-slate-800 text-cyan-400 font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavClick("login")}
            className="block w-full text-left py-2 px-3 rounded bg-slate-800 text-cyan-300 text-sm font-semibold"
          >
            Sign In with Digital Signature
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("register")}
            className="block w-full text-left py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            Register on BSC Testnet
          </button>
        </div>
      )}
    </header>
  );
}
