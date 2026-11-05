"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function DashboardOverview() {
  const { user, referrals, setUserPane, claimAirdrop } = usePearlvine();

  const totalEarned =
    user.earnings.directEarnings +
    user.earnings.levelEarnings +
    user.earnings.airdropEarnings +
    user.autoPoolEarnings;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Dashboard Overview</h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              BSC Testnet (97)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome, <span className="font-semibold text-slate-800">{user.name}</span>. Authenticated Wallet:{" "}
            <a
              href={`https://testnet.bscscan.com/address/${user.walletAddress}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>{user.walletAddress ? `${user.walletAddress.substring(0, 8)}...${user.walletAddress.substring(36)}` : user.accountNo}</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border ${
              user.isPoolJoined
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <i
              className={`fa-solid ${
                user.isPoolJoined ? "fa-circle-check" : "fa-triangle-exclamation"
              } mr-1.5`}
            ></i>
            {user.isPoolJoined ? "Auto Pool Active (200k PVC)" : "Not Joined (200k PVC Entry)"}
          </span>
          {!user.isPoolJoined && (
            <button
              type="button"
              onClick={() => setUserPane("autopool")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition"
            >
              Join 200,000 PVC Pool
            </button>
          )}
        </div>
      </div>

      {/* Contract Earnings Struct Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Primary Balance */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-cyan-300 font-bold">
                PVC Token Balance
              </p>
              <i className="fa-solid fa-wallet text-cyan-400"></i>
            </div>
            <h3 className="text-3xl font-black mt-2 tracking-tight">
              {user.pvcBalance.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-slate-300 mt-1">Available ERC-20 Balance</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
            <span>Entry Requirement</span>
            <span className="font-bold text-white">200,000 PVC</span>
          </div>
        </div>

        {/* Direct Earnings (50,000 PVC per direct) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                Direct Earnings
              </p>
              <i className="fa-solid fa-users text-emerald-200"></i>
            </div>
            <h3 className="text-3xl font-black mt-2 tracking-tight">
              {user.earnings.directEarnings.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-emerald-100 mt-1">
              50,000 PVC per Direct Join (25%)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/50 flex justify-between items-center text-[11px] text-emerald-100">
            <span>Direct Partners</span>
            <span className="font-bold text-white">{referrals.filter(r => r.status === "Active").length} Active</span>
          </div>
        </div>

        {/* Level Earnings (10 Uplines, 100 PVC each) */}
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-amber-200 font-bold">
                10-Level Reward
              </p>
              <i className="fa-solid fa-layer-group text-amber-200"></i>
            </div>
            <h3 className="text-3xl font-black mt-2 tracking-tight">
              {user.earnings.levelEarnings.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-amber-100 mt-1">
              100 PVC per Upline Level (10 Tiers)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/50 flex justify-between items-center text-[11px] text-amber-100">
            <span>Reward Share</span>
            <span className="font-bold text-white">10,000 PVC Pool Share</span>
          </div>
        </div>

        {/* Airdrop & Pool Rewards */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase tracking-wider text-purple-200 font-bold">
                Airdrop Earnings
              </p>
              <i className="fa-solid fa-gift text-purple-200"></i>
            </div>
            <h3 className="text-3xl font-black mt-2 tracking-tight">
              {user.earnings.airdropEarnings.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-purple-100 mt-1">
              {user.earnings.pendingAirdropEarning > 0
                ? `${user.earnings.pendingAirdropEarning} PVC Pending Claim`
                : "Contract Airdrop (500 PVC)"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-500/50 flex justify-between items-center text-[11px] text-purple-100">
            <span>Pending Claimable</span>
            {user.earnings.pendingAirdropEarning > 0 ? (
              <button
                type="button"
                onClick={claimAirdrop}
                className="bg-white text-purple-700 font-bold px-2 py-0.5 rounded text-[10px] hover:bg-purple-100"
              >
                Claim {user.earnings.pendingAirdropEarning} PVC
              </button>
            ) : (
              <span className="font-bold text-white">All Claimed</span>
            )}
          </div>
        </div>
      </div>

      {/* Contract Split Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Protocol Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Smart Contract Earnings Summary
            </h3>
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
              Total: {totalEarned.toLocaleString()} PVC
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Direct Referrals (50k PVC / referral)
              </span>
              <span className="font-bold text-slate-900">
                {user.earnings.directEarnings.toLocaleString()} PVC
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                10-Level Reward Earnings (100 PVC / upline)
              </span>
              <span className="font-bold text-slate-900">
                {user.earnings.levelEarnings.toLocaleString()} PVC
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Airdrop Bonuses (500 PVC reward)
              </span>
              <span className="font-bold text-slate-900">
                {user.earnings.airdropEarnings.toLocaleString()} PVC
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Global Auto Pool Share (100k PVC allocation)
              </span>
              <span className="font-bold text-slate-900">
                {user.autoPoolEarnings.toLocaleString()} PVC
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserPane("autopool")}
              className="p-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2.5 border border-blue-100"
            >
              <i className="fa-solid fa-water text-lg"></i>
              <div>
                <p className="font-bold">Auto Pool</p>
                <p className="text-[10px] text-blue-600 font-normal">Join with 200,000 PVC</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUserPane("referrals")}
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2.5 border border-emerald-100"
            >
              <i className="fa-solid fa-user-plus text-lg"></i>
              <div>
                <p className="font-bold">Invite Partners</p>
                <p className="text-[10px] text-emerald-600 font-normal">Earn 50,000 PVC Direct</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUserPane("level")}
              className="p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2.5 border border-amber-100"
            >
              <i className="fa-solid fa-layer-group text-lg"></i>
              <div>
                <p className="font-bold">10-Level Reward</p>
                <p className="text-[10px] text-amber-600 font-normal">100 PVC per level</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUserPane("scratch")}
              className="p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2.5 border border-purple-100"
            >
              <i className="fa-solid fa-gift text-lg"></i>
              <div>
                <p className="font-bold">Airdrop Box</p>
                <p className="text-[10px] text-purple-600 font-normal">500 PVC rewards</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
