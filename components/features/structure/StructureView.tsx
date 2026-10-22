"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function StructureView() {
  const { setActiveTab } = usePearlvine();

  const levelStructure = [
    { level: "Level 1 (Direct Sponsor)", reward: "1,000 PVC", note: "Instant direct sponsor commission per referral" },
    { level: "Level 2", reward: "100 PVC", note: "Team matrix allocation" },
    { level: "Level 3", reward: "100 PVC", note: "Team matrix allocation" },
    { level: "Level 4", reward: "100 PVC", note: "Team matrix allocation" },
    { level: "Level 5", reward: "100 PVC", note: "Team matrix allocation" },
    { level: "Level 6", reward: "100 PVC", note: "Team matrix allocation" },
    { level: "Global Auto Pool Reserve", reward: "1,000 PVC", note: "Cumulative earnings pool up to 200,000 PVC" },
    { level: "Admin System Allocation", reward: "500 PVC", note: "Infrastructure, security & contract reserve" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-8 sm:p-10 rounded-3xl shadow-lg text-center space-y-3">
          <span className="bg-blue-600 text-xs uppercase px-3.5 py-1 rounded-full font-semibold tracking-wider">
            Network Statistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pearlvine Structure & Management
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Thanks to the business acumen of the DP Founder and Visionary Dr. Daniel Johnson, DP is the most secure virtual currency in the world.
          </p>
        </div>

        {/* Structure Table */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                3,000 PVC Allocation Matrix
              </h3>
              <p className="text-xs text-slate-500">
                100% automated & mathematically balanced distribution per membership
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
            >
              Start Earning
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold">
                  <th className="p-3.5 rounded-l-xl">Allocation Component</th>
                  <th className="p-3.5">Amount (PVC)</th>
                  <th className="p-3.5 rounded-r-xl">Distribution Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {levelStructure.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-medium text-slate-800">{row.level}</td>
                    <td className="p-3.5 font-bold text-blue-600">{row.reward}</td>
                    <td className="p-3.5 text-slate-500">{row.note}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50/60 font-bold text-slate-900">
                  <td className="p-3.5 rounded-l-xl">Total Per Joining</td>
                  <td className="p-3.5 text-blue-700">3,000 PVC</td>
                  <td className="p-3.5 rounded-r-xl text-slate-600">Full Transparent Settlement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
