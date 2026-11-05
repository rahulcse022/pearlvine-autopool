"use client";

import React, { ReactNode } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { UserPaneType } from "@/types";

interface NavItem {
  pane: UserPaneType;
  label: string;
  icon: string;
  color: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userPane, setUserPane, setActiveTab, contractAddress } = usePearlvine();

  const navItems: NavItem[] = [
    { pane: "main", label: "Dashboard Overview", icon: "fa-house", color: "text-cyan-400" },
    { pane: "autopool", label: "Auto Pool (200,000 PVC)", icon: "fa-water", color: "text-cyan-400" },
    { pane: "referrals", label: "Direct Referrals (50k PVC)", icon: "fa-users", color: "text-emerald-400" },
    { pane: "level", label: "10-Level Reward (100 PVC)", icon: "fa-layer-group", color: "text-amber-400" },
    { pane: "scratch", label: "Airdrop Rewards (500 PVC)", icon: "fa-gift", color: "text-rose-400" },
    { pane: "claims", label: "Claim Rewards", icon: "fa-hand-holding-dollar", color: "text-purple-400" },
    { pane: "transactions", label: "Ledger & Transactions", icon: "fa-clock-rotate-left", color: "text-blue-400" },
    { pane: "notifications", label: "Notifications", icon: "fa-bell", color: "text-yellow-400" },
    { pane: "profile", label: "Profile & Contract", icon: "fa-user-gear", color: "text-teal-400" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 hidden md:flex flex-col flex-shrink-0 p-4 justify-between border-r border-slate-800">
        <div className="space-y-1">
          <div className="pb-4 mb-2 border-b border-slate-800 px-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              CONNECTED USER
            </p>
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-cyan-400 font-mono truncate" title={user.walletAddress}>
              {user.walletAddress ? `${user.walletAddress.substring(0, 8)}...${user.walletAddress.substring(36)}` : `A/c: ${user.accountNo}`}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  user.isPoolJoined ? "bg-emerald-400" : "bg-amber-400"
                }`}
              ></span>
              <span className="text-[10px] font-medium text-slate-300">
                {user.isPoolJoined ? "Pool Active (200k PVC)" : "Not Joined"}
              </span>
            </div>
          </div>

          {navItems.map((item) => {
            const isActive = userPane === item.pane;
            return (
              <button
                key={item.pane}
                type="button"
                onClick={() => setUserPane(item.pane)}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <i className={`fa-solid ${item.icon} ${item.color} w-5`}></i>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
          <a
            href={`https://testnet.bscscan.com/address/${contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="block px-3 py-2 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 text-[10px] text-slate-400 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">PVCReferralSystem</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px] text-cyan-400"></i>
            </div>
            <span className="font-mono truncate block text-[9px] text-cyan-300 mt-0.5">
              {contractAddress.substring(0, 10)}...{contractAddress.substring(34)}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-950/50 text-red-400 text-xs font-medium transition"
          >
            <i className="fa-solid fa-right-from-bracket w-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
        {/* Mobile Horizontal Nav for Tablets & Phones */}
        <div className="md:hidden flex overflow-x-auto space-x-2 pb-2 mb-2 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.pane}
              type="button"
              onClick={() => setUserPane(item.pane)}
              className={`flex-shrink-0 text-xs px-3 py-2 rounded-xl font-medium transition ${
                userPane === item.pane
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <i className={`fa-solid ${item.icon} mr-1.5`}></i>
              {item.label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
