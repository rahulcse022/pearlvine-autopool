"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePearlvine } from "@/context/PearlvineContext";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboardNav";
import { UserPaneType } from "@/types";
import { formatAddress } from "@/utils/formatAddress";

export default function Navbar() {
  const { isWeb3Connected, disconnectWallet, user, userPane, setUserPane, setActiveTab } =
    usePearlvine();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const goTo = (tab: "home" | "login" | "register" | "dashboard") => {
    setActiveTab(tab);
    closeDrawer();
  };

  const handleLogout = () => {
    closeDrawer();
    disconnectWallet();
  };

  const openDashboardPane = (pane: UserPaneType) => {
    setActiveTab("dashboard");
    setUserPane(pane);
    closeDrawer();
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <>
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
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="text-white text-xl p-2 focus:outline-none"
            onClick={() => setDrawerOpen(true)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden={!drawerOpen}
      />

      {/* Side drawer */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-[min(20rem,85vw)] bg-[#0f172a] text-slate-200 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Menu
            </p>
            {isWeb3Connected ? (
              <p className="text-xs font-mono text-cyan-400 truncate">
                {formatAddress(user.walletAddress)}
              </p>
            ) : (
              <p className="text-sm font-bold text-white">Pearlvine</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="text-slate-300 hover:text-white text-xl p-2"
            onClick={closeDrawer}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {isWeb3Connected ? (
            <>
              {DASHBOARD_NAV_ITEMS.map((item) => {
                const isActive = userPane === item.pane;
                return (
                  <button
                    key={item.pane}
                    type="button"
                    onClick={() => openDashboardPane(item.pane)}
                    className={`w-full text-left flex items-center space-x-3 py-3 px-3 rounded-xl text-sm font-semibold transition ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <i
                      className={`fa-solid ${item.icon} ${isActive ? "text-white" : item.color} w-5`}
                    ></i>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <DrawerLink icon="fa-house" label="Home" onClick={() => goTo("home")} />
              <DrawerLink icon="fa-right-to-bracket" label="Login" onClick={() => goTo("login")} />
              <DrawerLink
                icon="fa-user-plus"
                label="Register"
                onClick={() => goTo("register")}
                primary
              />
            </>
          )}
        </nav>

        {isWeb3Connected && (
          <div className="p-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left flex items-center space-x-3 py-3 px-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-950/40 transition"
            >
              <i className="fa-solid fa-right-from-bracket w-5"></i>
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function DrawerLink({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center space-x-3 py-3 px-3 rounded-xl text-sm font-semibold transition ${
        primary
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "text-slate-200 hover:bg-slate-800"
      }`}
    >
      <i className={`fa-solid ${icon} w-5`}></i>
      <span>{label}</span>
    </button>
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
