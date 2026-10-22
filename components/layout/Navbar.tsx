"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePearlvine } from "@/context/PearlvineContext";
import { TabType } from "@/types";

export default function Navbar() {
  const { activeTab, setActiveTab } = usePearlvine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; tab: TabType }[] = [
    { label: "Home", tab: "home" },
    { label: "About Us", tab: "about" },
    { label: "Structure", tab: "structure" },
    { label: "Login", tab: "login" },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleNavClick("home")}
        >
          <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm flex items-center">
            <Image
              src="/full_logo.png"
              alt="Pearlvine International"
              width={140}
              height={36}
              style={{ width: "auto" }}
              className="h-8 sm:h-9 object-contain"
              priority
            />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => handleNavClick(item.tab)}
              className={`transition py-1 border-b-2 ${
                activeTab === item.tab
                  ? "text-cyan-400 border-cyan-400 font-semibold"
                  : "text-slate-300 hover:text-cyan-400 border-transparent hover:border-cyan-400"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavClick("register")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow hover:shadow-md"
          >
            Sign Up
          </button>
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
            onClick={() => handleNavClick("register")}
            className="block w-full text-left py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("dashboard")}
            className="block w-full text-left py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
          >
            User Dashboard
          </button>
        </div>
      )}
    </header>
  );
}
