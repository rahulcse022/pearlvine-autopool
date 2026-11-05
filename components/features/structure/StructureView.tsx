"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { CONTRACT_CONSTANTS, JOIN_DISTRIBUTION_BREAKDOWN } from "@/constants/contractConfig";

export default function StructureView() {
  const { setActiveTab } = usePearlvine();

  const uplineTiers = Array.from({ length: 10 }, (_, i) => ({
    tier: `Upline Level ${i + 1}`,
    reward: `${CONTRACT_CONSTANTS.LEVEL_REWARD} PVC`,
    target: i === 0 ? "Direct Referrer's Sponsor" : `Level ${i + 1} Ancestor in referral chain`,
    contractRule: "pvcToken.safeTransfer(upline, LEVEL_REWARD)",
  }));

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-4 border border-slate-800">
          <a
            href="https://testnet.bscscan.com/address/0xc43bc4f325f2103e60DD0aC6DDB11651dAAe3572"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 border border-cyan-500/30 text-xs uppercase px-4 py-1.5 rounded-full font-bold tracking-wider inline-flex items-center gap-1.5 transition"
          >
            <span>BSC Testnet Verified • 0xc43b...3572</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            200,000 PVC Allocation &amp; Matrix Structure
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every join transaction strictly executes the mathematical distribution defined in the Solidity contract:
            50,000 Direct + 10,000 Level Share + 40,000 Admin + 100,000 Pool = 200,000 PVC.
          </p>
        </div>

        {/* 200,000 PVC Allocation Matrix */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">
                200,000 PVC Per-Join Allocation Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                On-chain distribution split executed upon calling <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">join(address referrer)</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow"
            >
              Join System (200,000 PVC)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 rounded-l-xl">Allocation Component</th>
                  <th className="p-3.5">Amount (PVC)</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Contract Variable</th>
                  <th className="p-3.5 rounded-r-xl">Distribution Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {JOIN_DISTRIBUTION_BREAKDOWN.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">{row.recipient}</td>
                    <td className="p-3.5 font-black text-blue-600 text-sm">
                      {row.amount.toLocaleString()} PVC
                    </td>
                    <td className="p-3.5">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {row.percentage}%
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      {row.smartContractVar}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] leading-relaxed">
                      {row.description}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50/70 font-black text-slate-900 text-sm">
                  <td className="p-4 rounded-l-xl">Total Per Join Transaction</td>
                  <td className="p-4 text-blue-700 text-base">200,000 PVC</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
                      100%
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">JOIN_AMOUNT</td>
                  <td className="p-4 rounded-r-xl text-slate-700 text-xs">
                    100% Fully Accounted &amp; Non-Reentrant
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 10-Level Upline Reward Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-extrabold text-xl text-slate-900">
                10-Level Upline Reward System (MAX_LEVELS = 10)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              When a user joins, the 10,000 PVC level share pays <span className="font-bold text-slate-800">100 PVC</span> to each existing upline (up to 10 ancestor levels).
              Any remaining unpaid balance of the 10,000 PVC stays in the contract as <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">adminReserve</code>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {uplineTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-1 hover:border-blue-400 transition"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Level {idx + 1}
                </span>
                <p className="text-base font-black text-amber-600">{tier.reward}</p>
                <p className="text-[10px] text-slate-500 truncate" title={tier.target}>
                  {idx === 0 ? "Referrer of Sponsor" : `Upline +${idx + 1}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Airdrop & Admin Reserve Note */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-6 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Smart Contract Airdrop
            </span>
            <h4 className="text-lg font-bold text-slate-900">
              500 PVC Airdrop to Joiner &amp; Referrer
            </h4>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              As implemented in <code className="font-mono">contract/pvc_pool.sol</code>: Airdrops of 500 PVC to joiner and 500 PVC to referrer are paid out of the accumulated admin reserve whenever airdrop status is active (<code className="font-mono">!airdropPaused</code>).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
          >
            Claim 500 PVC Airdrop
          </button>
        </div>
      </div>
    </section>
  );
}
