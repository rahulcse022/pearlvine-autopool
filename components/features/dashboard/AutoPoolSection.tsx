"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function AutoPoolSection() {
  const { user, joinAutoPool } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Auto Pool Membership</h2>
          <p className="text-xs text-slate-500 mt-1">
            Joining fee is exactly 3,000 PVC. Distributed transparently across
            Admin, L1-L6 & Auto Pool reserves.
          </p>
        </div>
        <div>
          {user.isPoolJoined ? (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-circle-check mr-1.5"></i> Joined (Active)
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-clock mr-1.5"></i> Not Joined Yet
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Joining Amount</span>
          <p className="text-2xl font-black text-slate-900 mt-1">3,000 PVC</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">
            Auto Pool Earnings Cap
          </span>
          <p className="text-2xl font-black text-blue-600 mt-1">200,000 PVC</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">
            Current Pool Share
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            1,000 PVC Pool Share
          </p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800">
          3,000 PVC Distribution Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3 rounded-l-lg">Recipient / Allocation</th>
                <th className="p-3 rounded-r-lg">Amount (PVC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3">Admin Wallet / Contract</td>
                <td className="p-3 font-bold">500 PVC</td>
              </tr>
              <tr>
                <td className="p-3">Direct Sponsor / L1</td>
                <td className="p-3 font-bold">1,000 PVC</td>
              </tr>
              <tr>
                <td className="p-3">L2 to L6 (100 PVC each level)</td>
                <td className="p-3 font-bold">500 PVC (100 × 5)</td>
              </tr>
              <tr>
                <td className="p-3">Auto Pool Global Distribution Reserve</td>
                <td className="p-3 font-bold text-emerald-600">1,000 PVC</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="p-3">Total Joining Allocation</td>
                <td className="p-3">3,000 PVC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-4">
        {user.isPoolJoined ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold text-center">
            <i className="fa-solid fa-circle-check mr-2"></i>
            Successfully Joined Auto Pool! 3,000 PVC allocated across system pool.
          </div>
        ) : (
          <button
            type="button"
            onClick={joinAutoPool}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition hover:shadow-xl"
          >
            Confirm & Join Auto Pool (3,000 PVC)
          </button>
        )}
      </div>
    </div>
  );
}
