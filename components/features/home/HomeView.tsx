"use client";

import React, { useRef } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";

export default function HomeView() {
  const { setActiveTab, isWeb3Connected, setUserPane, tokenConfig, contractAddress } =
    usePearlvine();
  const distributionRef = useRef<HTMLDivElement>(null);

  const handleJoin = () => {
    if (isWeb3Connected) {
      setUserPane("main");
      setActiveTab("dashboard");
      return;
    }
    setActiveTab("register");
  };

  const scrollToDistribution = () => {
    distributionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rows = [
    { label: "Join Amount", value: tokenConfig.joinAmount },
    { label: "Admin Reward", value: tokenConfig.adminReward },
    { label: "Direct Reward", value: tokenConfig.directReward },
    { label: "Level Reward", value: tokenConfig.levelShare },
    { label: "AutoPool Share", value: tokenConfig.autoPoolContribution },
  ];

  return (
    <section className="view-section">
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <a
            href={`https://testnet.bscscan.com/address/${contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-sm transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Contract: {formatAddress(contractAddress, 4)}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            PVC Global Auto Pool &amp;{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              10-Level Referral Reward
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A fully automated, on-chain referral distribution system built with PVC tokens,
            providing direct referral rewards, 10-level uplines, admin reserve allocation and
            FIFO-based global AutoPool distribution.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleJoin}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/40 transition transform hover:-translate-y-0.5"
            >
              Join Auto Pool
            </button>
            <button
              type="button"
              onClick={scrollToDistribution}
              className="bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl shadow transition"
            >
              View Contract Structure
            </button>
          </div>
        </div>
      </div>

      <div
        ref={distributionRef}
        id="distribution"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contract Distribution
          </h2>
          <p className="text-slate-600 text-sm">
            Live values from the smart contract configuration.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-semibold">Distribution</th>
                <th className="px-5 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{row.label}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                    {row.value} PVC
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50/60">
                <td className="px-5 py-3.5 font-black text-slate-900">Total</td>
                <td className="px-5 py-3.5 text-right font-black text-blue-700">
                  {tokenConfig.joinAmount} PVC
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
