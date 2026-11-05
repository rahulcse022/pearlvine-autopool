"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { CONTRACT_CONSTANTS } from "@/constants/contractConfig";

export default function LevelIncomeSection() {
  const { user, uplines } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              10-Level Upline Reward (L1 - L10)
            </h2>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              MAX_LEVELS = 10
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governed by <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-600">getUserUpline(address user)</code>.
            Each upline in the 10-tier chain receives 100 PVC per join event (total 10,000 PVC level share).
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center">
          <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">
            Total Level Earnings
          </span>
          <p className="text-xl font-black text-amber-800">
            {user.earnings.levelEarnings.toLocaleString()} PVC
          </p>
        </div>
      </div>

      {/* 10 Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {uplines.map((slot) => {
          const isRoot = slot.address === CONTRACT_CONSTANTS.ROOT_ADDRESS;
          return (
            <div
              key={slot.level}
              className={`p-4 rounded-xl border flex flex-col justify-between transition hover:shadow-sm ${
                isRoot
                  ? "bg-slate-50/70 border-slate-200 text-slate-600"
                  : "bg-white border-amber-200/80 shadow-xs"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800">
                    Level {slot.level} Upline
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isRoot
                        ? "bg-slate-200 text-slate-700"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isRoot ? "Root Reserve" : "Active"}
                  </span>
                </div>
                <p className="text-lg font-black text-amber-600 mt-1">
                  +{slot.amount} PVC
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-2 truncate" title={slot.address}>
                  {slot.address.substring(0, 6)}...{slot.address.substring(38)}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                {isRoot ? "Admin Reserve" : `Tier ${slot.level} Beneficiary`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contract Mechanism Explanatory Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs gap-3">
        <div className="flex items-center space-x-2 text-slate-600">
          <i className="fa-solid fa-code text-blue-600 text-base"></i>
          <span>
            Contract rule: <code className="font-mono text-slate-800 font-semibold">LEVEL_SHARE (10,000 PVC) - levelsPaid * LEVEL_REWARD</code> stays in contract as admin reserve.
          </span>
        </div>
        <div className="flex items-center space-x-4 font-semibold text-slate-800">
          <span>Per Join Share: <strong className="text-amber-600">10,000 PVC</strong></span>
          <span>Per Level: <strong className="text-blue-600">100 PVC</strong></span>
        </div>
      </div>
    </div>
  );
}
