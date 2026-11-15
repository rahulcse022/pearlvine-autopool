"use client";

import React, { ReactNode } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboardNav";
import { formatAddress } from "@/utils/formatAddress";
import { getBscAddressUrl } from "@/utils/explorer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userPane, setUserPane, disconnectWallet, contractAddress } = usePearlvine();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-pearlSurface">
      <aside className="light-drawer hidden w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 md:flex">
        <div className="space-y-1">
          <div className="pb-4 mb-2 border-b border-slate-200 px-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Connected User
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">{user.name || "Member"}</p>
            <p className="text-[10px] text-blue-600 font-mono truncate" title={user.walletAddress}>
              {formatAddress(user.walletAddress)}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  user.isPoolJoined ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="text-[10px] font-medium text-slate-600">
                {user.isPoolJoined ? "Pool Active" : "Not Joined"}
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
                  isActive ? "light-drawer-item-active shadow-sm" : "light-drawer-item"
                }`}
              >
                <i
                  className={`fa-solid ${item.icon} ${isActive ? "text-blue-600" : item.color} w-5`}
                ></i>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
          <a
            href={getBscAddressUrl(contractAddress)}
            target="_blank"
            rel="noreferrer"
            className="block px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-[10px] text-slate-500 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Contract</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px] text-blue-600"></i>
            </div>
            <span className="font-mono truncate block text-[9px] text-blue-600 mt-0.5">
              {formatAddress(contractAddress)}
            </span>
          </a>

          <button
            type="button"
            onClick={disconnectWallet}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-xs font-medium transition"
          >
            <i className="fa-solid fa-right-from-bracket w-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-grow p-4 sm:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}
