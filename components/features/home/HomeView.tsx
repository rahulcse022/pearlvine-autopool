"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function HomeView() {
  const { setActiveTab } = usePearlvine();

  const features = [
    {
      icon: "fa-users-viewfinder",
      color: "bg-blue-100 text-blue-600",
      title: "Auto Pool 3,000 PVC",
      description:
        "Join global auto pool and earn cumulative returns up to 200,000 PVC.",
    },
    {
      icon: "fa-gift",
      color: "bg-emerald-100 text-emerald-600",
      title: "Scratch Card Rewards",
      description:
        "Earn instant 1-20 PVC rewards on joining and direct referrals.",
    },
    {
      icon: "fa-layer-group",
      color: "bg-amber-100 text-amber-600",
      title: "L1-L6 Level Income",
      description:
        "Distribute sponsor allocations across 6 dynamic levels securely.",
    },
    {
      icon: "fa-building-columns",
      color: "bg-purple-100 text-purple-600",
      title: "Secure Claims & Payouts",
      description:
        "Admin-approved withdrawal and payout monitoring system.",
    },
  ];

  return (
    <section className="view-section">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <span className="inline-block bg-blue-500/20 text-cyan-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-cyan-500/30 uppercase tracking-widest">
            Pearl Mynt Digital Revolution
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            I&apos;m possible <span className="text-cyan-400">#pearlvineimpossible</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Pearlvine held and showed me a different world of future with secure
            global Auto Pool & crypto wallet solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition"
            >
              Account Login
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            WHAT DP OFFERS YOU
          </h2>
          <p className="text-slate-600 mt-2">
            Get fully featured convenient wallet & automated pool rewards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition"
            >
              <div
                className={`w-12 h-12 ${feat.color} rounded-xl flex items-center justify-center text-xl mb-4`}
              >
                <i className={`fa-solid ${feat.icon}`}></i>
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
