"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function AboutView() {
  const { setActiveTab } = usePearlvine();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center">
      <div className="max-w-4xl mx-auto space-y-8 text-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Company Overview
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Pearlvine International
        </h2>
        <p className="text-slate-600 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
          Pearlvine is a digital social and e-commerce global peer-to-peer
          platform built on high security cryptographic standards. Founded to
          empower members worldwide with an automated pool reward ecosystem,
          transparent level income, and convenient decentralized wallet assets.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-3">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Cryptographic Security
            </h4>
            <p className="text-xs text-slate-500">
              Built on secure cryptographic standards with transparent, automated distributions.
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-3">
              <i className="fa-solid fa-globe"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Global Auto Pool
            </h4>
            <p className="text-xs text-slate-500">
              Worldwide participating network with up to 200,000 PVC maximum cumulative earnings.
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center mb-3">
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Fair Reward Structure
            </h4>
            <p className="text-xs text-slate-500">
              Instant scratch cards, L1-L6 level commissions, and prompt admin payout validations.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition"
          >
            Join Pearlvine Today
          </button>
        </div>
      </div>
    </section>
  );
}
