"use client";

import React, { useRef } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";
import { getBscAddressUrl } from "@/utils/explorer";

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
      <div className="light-hero relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <a
            href={getBscAddressUrl(contractAddress)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-200 shadow-sm transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Contract: {formatAddress(contractAddress, 4)}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900">
            PVC Global Auto Pool &amp;{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              10-Level Referral Reward
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A fully automated, on-chain referral distribution system built with PVC tokens,
            providing direct referral rewards, 10-level uplines, admin reserve allocation and
            FIFO-based global AutoPool distribution.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={handleJoin}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5"
            >
              Join Auto Pool
            </button>
            <button
              type="button"
              onClick={scrollToDistribution}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-3.5 rounded-xl shadow-sm transition"
            >
              View Contract Structure
            </button>
          </div>
        </div>
      </div>

      <div
        ref={distributionRef}
        id="distribution"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
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
