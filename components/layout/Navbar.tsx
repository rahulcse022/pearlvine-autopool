"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePearlvine } from "@/context/PearlvineContext";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboardNav";
import { UserPaneType } from "@/types";
import { formatAddress } from "@/utils/formatAddress";

export default function Navbar() {
  const { isWeb3Connected, disconnectWallet, user, userPane, setUserPane, setActiveTab } =
    usePearlvine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (tab: "home" | "login" | "register" | "dashboard") => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    disconnectWallet();
  };

  const openDashboardPane = (pane: UserPaneType) => {
    setActiveTab("dashboard");
    setUserPane(pane);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center cursor-pointer space-x-3"
          onClick={() => goTo("home")}
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
        </button>

        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium">
          {isWeb3Connected ? (
            <SignedInActions userAddress={user.walletAddress} onLogout={handleLogout} />
          ) : (
            <SignedOutActions onLogin={() => goTo("login")} onRegister={() => goTo("register")} />
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle Navigation Menu"
          className="text-white text-xl p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {isWeb3Connected ? (
            <>
              {DASHBOARD_NAV_ITEMS.map((item) => {
                const isActive = userPane === item.pane;
                return (
                  <button
                    key={item.pane}
                    type="button"
                    onClick={() => openDashboardPane(item.pane)}
                    className={`w-full text-left flex items-center space-x-3 py-2.5 px-3 rounded-xl text-sm font-semibold ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} ${isActive ? "text-white" : item.color} w-5`}></i>
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-950/40"
              >
                <i className="fa-solid fa-right-from-bracket w-5"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => goTo("login")}
                className="block w-full text-left py-2 px-3 rounded bg-slate-800 text-cyan-300 text-sm font-semibold"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => goTo("register")}
                className="block w-full text-left py-2 px-3 rounded bg-blue-600 text-white text-sm font-semibold"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function SignedOutActions({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={onLogin}
        className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
      >
        <i className="fa-solid fa-right-to-bracket"></i>
        <span>Login</span>
      </button>
      <button
        type="button"
        onClick={onRegister}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-3.5 py-2 rounded-xl font-bold transition shadow text-xs"
      >
        Register
      </button>
    </div>
  );
}

function SignedInActions({
  userAddress,
  onLogout,
}: {
  userAddress: string;
  onLogout: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <a
        href={`https://testnet.bscscan.com/address/${userAddress}`}
        target="_blank"
        rel="noreferrer"
        className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
        title="View Wallet on BscScan Testnet"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>{formatAddress(userAddress)}</span>
        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
      </a>
      <button
        type="button"
        onClick={onLogout}
        className="text-slate-400 hover:text-red-400 text-xs p-1.5 transition"
        title="Logout"
      >
        <i className="fa-solid fa-power-off"></i>
      </button>
    </div>
  );
}
