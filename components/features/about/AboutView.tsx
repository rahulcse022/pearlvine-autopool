"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function AboutView() {
  const { setActiveTab } = usePearlvine();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center">
      <div className="max-w-4xl mx-auto space-y-8 text-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Smart Contract Protocol
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About PVC Referral &amp; Auto Pool System
        </h2>
        <p className="text-slate-600 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
          The PVC Referral System is a decentralized, non-reentrant smart contract protocol (<code className="text-blue-600 font-mono text-sm">PVCReferralSystem</code>)
          running on 18-decimal PVC ERC-20 tokens. Designed with mathematical precision to distribute 200,000 PVC entry fees
          with 100% transparency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Non-Reentrant Security
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Protected by OpenZeppelin SafeERC20 and ReentrancyGuard for immutable, tamper-proof transactions.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-water"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              100,000 PVC Global Pool
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              50% of every 200,000 PVC join is dedicated to the community auto pool for transparent rewards.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-sitemap"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              10-Level Reward &amp; Direct
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              50,000 PVC direct rewards (25%) + 10-tier upline distribution (100 PVC per level) up to 10 upline ranks.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition"
          >
            Create Account &amp; Join
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("structure")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl transition"
          >
            Review Split Matrix
          </button>
        </div>
      </div>
    </section>
  );
}
