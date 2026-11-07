"use client";

import React, { ReactNode } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboardNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userPane, setUserPane, disconnectWallet, contractAddress } = usePearlvine();

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

          {DASHBOARD_NAV_ITEMS.map((item) => {
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
            onClick={disconnectWallet}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-950/50 text-red-400 text-xs font-medium transition"
          >
            <i className="fa-solid fa-right-from-bracket w-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
