"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function HomeView() {
  const { setActiveTab } = usePearlvine();

  const features = [
    {
      icon: "fa-water",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      title: "Global Auto Pool (100,000 PVC)",
      badge: "50% Pool Share",
      description:
        "Every 200,000 PVC join allocates 100,000 PVC directly into the automated community pool reserve.",
    },
    {
      icon: "fa-handshake",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      title: "Direct Reward (50,000 PVC)",
      badge: "25% Instant",
      description:
        "Earn an instant 50,000 PVC direct sponsor reward immediately on every direct referral activation.",
    },
    {
      icon: "fa-layer-group",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      title: "10-Level Upline Reward",
      badge: "100 PVC × 10 Levels",
      description:
        "10,000 PVC level share distributes 100 PVC to each of up to 10 existing upline members automatically.",
    },
    {
      icon: "fa-gift",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      title: "Airdrop Bonus (500 PVC)",
      badge: "Joiner + Referrer",
      description:
        "500 PVC smart contract airdrop paid out of admin reserve for new members and their sponsors.",
    },
  ];

  const quickStats = [
    { label: "Join Amount", value: "200,000 PVC", note: "Standard Entry Fee" },
    { label: "Direct Reward", value: "50,000 PVC", note: "25% Instant Referral" },
    { label: "10-Level Reward", value: "10 Uplines", note: "100 PVC per level" },
    { label: "Auto Pool Share", value: "100,000 PVC", note: "50% Community Reserve" },
  ];

  return (
    <section className="view-section">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <a
            href="https://testnet.bscscan.com/address/0xc43bc4f325f2103e60DD0aC6DDB11651dAAe3572"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-cyan-500/30 backdrop-blur-sm transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>BSC Testnet Contract: 0xc43b...3572</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            PVC Global Auto Pool &amp; <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              10-Level Referral Reward
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fully automated, on-chain referral distribution system built with 18-decimal PVC tokens.
            200,000 PVC entry divided transparently into Direct Sponsor, 10-Tier Uplines, Admin Reserve, and Global Auto Pool.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/40 transition transform hover:-translate-y-0.5"
            >
              Join Auto Pool (200,000 PVC)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("structure")}
              className="bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl shadow transition"
            >
              View Contract Structure
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 text-center"
              >
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                  {stat.label}
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{stat.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Contract Specification
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How The 200,000 PVC Pool Split Works
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            100% auditable smart contract rules governing every single member joining transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${feat.color}`}
                  >
                    <i className={`fa-solid ${feat.icon}`}></i>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2 text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
