"use client";

import React from "react";

export default function LevelIncomeSection() {
  const levels = [
    { label: "Level 1 (Direct)", amount: "12,000 PVC", color: "text-blue-600", desc: "12 Direct Referrals × 1,000 PVC" },
    { label: "Level 2", amount: "3,400 PVC", color: "text-slate-900", desc: "34 Team Members × 100 PVC" },
    { label: "Level 3", amount: "1,800 PVC", color: "text-slate-900", desc: "18 Team Members × 100 PVC" },
    { label: "Level 4", amount: "900 PVC", color: "text-slate-900", desc: "9 Team Members × 100 PVC" },
    { label: "Level 5", amount: "500 PVC", color: "text-slate-900", desc: "5 Team Members × 100 PVC" },
    { label: "Level 6", amount: "200 PVC", color: "text-slate-900", desc: "2 Team Members × 100 PVC" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Level Income (L1 - L6)</h2>
        <p className="text-xs text-slate-500 mt-1">
          L1 direct sponsor allocation is 1,000 PVC. L2 to L6 allocations are 100 PVC per level.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {levels.map((lvl) => (
          <div
            key={lvl.label}
            className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <span className="text-xs text-slate-500 font-medium">{lvl.label}</span>
              <p className={`text-xl font-black mt-1 ${lvl.color}`}>{lvl.amount}</p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">{lvl.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl flex justify-between items-center text-sm font-semibold">
        <span>Total Cumulative Level Income</span>
        <span className="text-xl font-black">18,800 PVC</span>
      </div>
    </div>
  );
}
