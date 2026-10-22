"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function DashboardOverview() {
  const { user, referrals, setUserPane } = usePearlvine();

  const capPercentage = Math.min(
    100,
    Number(((user.autoPoolEarnings / 200000) * 100).toFixed(1))
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Account Status:{" "}
            <span className="text-blue-600 font-semibold">{user.status}</span>.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl border ${
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
            {user.isPoolJoined ? "Auto Pool Active" : "Startup Account"}
          </span>
          {!user.isPoolJoined && (
            <button
              type="button"
              onClick={() => setUserPane("autopool")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition"
            >
              Join Auto Pool
            </button>
          )}
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-200 font-semibold">
              Primary PVC Balance
            </p>
            <h3 className="text-3xl font-extrabold mt-2">
              {user.pvcBalance.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-blue-100 mt-1">Available for withdrawal / Pool</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-200 font-semibold">
              Scratch Rewards
            </p>
            <h3 className="text-3xl font-extrabold mt-2">
              {user.scratchBalance.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-emerald-100 mt-1">Claimable Reward Balance</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-200 font-semibold">
              Auto Pool Earnings
            </p>
            <h3 className="text-3xl font-extrabold mt-2">
              {user.autoPoolEarnings.toLocaleString()} PVC
            </h3>
            <p className="text-xs text-amber-100 mt-1">
              Cap Progress: {capPercentage}% of 200k PVC
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-600 to-rose-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-rose-200 font-semibold">
              Direct Referrals
            </p>
            <h3 className="text-3xl font-extrabold mt-2">{referrals.length} Users</h3>
            <p className="text-xs text-rose-100 mt-1">Total L1-L6 Team: 148</p>
          </div>
        </div>
      </div>

      {/* Auto Pool Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Auto Pool Cap Progress (200,000 PVC Max)
          </h3>
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Earned: {user.autoPoolEarnings.toLocaleString()} PVC</span>
              <span>
                Remaining: {(200000 - user.autoPoolEarnings).toLocaleString()} PVC
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${capPercentage}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cumulative Auto Pool earnings are capped at 200,000 PVC per account
            according to system rules.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserPane("autopool")}
              className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2"
            >
              <i className="fa-solid fa-water text-base"></i>
              <span>Join Auto Pool</span>
            </button>
            <button
              type="button"
              onClick={() => setUserPane("scratch")}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2"
            >
              <i className="fa-solid fa-ticket text-base"></i>
              <span>Open Scratch Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setUserPane("claims")}
              className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2"
            >
              <i className="fa-solid fa-hand-holding-dollar text-base"></i>
              <span>Claim Rewards</span>
            </button>
            <button
              type="button"
              onClick={() => setUserPane("referrals")}
              className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition text-left flex items-center space-x-2"
            >
              <i className="fa-solid fa-user-plus text-base"></i>
              <span>Invite Referrals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
