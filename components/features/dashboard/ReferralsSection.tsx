"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { CONTRACT_CONSTANTS } from "@/constants/contractConfig";

export default function ReferralsSection() {
  const { user, referrals, showModal } = usePearlvine();
  const refLink = `https://pearlvine.com/ref?sponsor=${user.walletAddress || user.accountNo}`;

  const copyRefLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(refLink);
    }
    showModal("Link Copied", "Referral link copied to clipboard successfully!", "success");
  };

  const activeCount = referrals.filter((r) => r.status === "Active").length;
  const totalDirectEarned = activeCount * CONTRACT_CONSTANTS.DIRECT_REWARD;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Direct Referrals (50,000 PVC)</h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              DIRECT_REWARD (25%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Earn 50,000 PVC instant direct sponsor commission every time a member joins under your address.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
          <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">
            Total Direct Earned
          </span>
          <p className="text-xl font-black text-emerald-800">
            {totalDirectEarned.toLocaleString()} PVC
          </p>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Your Referral Link / Sponsor ID</span>
          <p className="text-xs font-mono font-bold text-blue-600 mt-1 break-all">
            {refLink}
          </p>
        </div>
        <button
          type="button"
          onClick={copyRefLink}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center justify-center space-x-1.5 flex-shrink-0"
        >
          <i className="fa-solid fa-copy"></i>
          <span>Copy Link</span>
        </button>
      </div>

      {/* Referrals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-3 rounded-l-lg">Partner / Account</th>
              <th className="p-3">Partner Wallet</th>
              <th className="p-3">Joining Date</th>
              <th className="p-3">Direct Commission</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {referrals.map((ref) => (
              <tr key={ref.accountNo} className="hover:bg-slate-50 transition">
                <td className="p-3 font-semibold text-slate-800">
                  {ref.name}
                  <span className="block text-[10px] font-mono text-slate-400">
                    A/c: {ref.accountNo}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600 text-[11px]">
                  {ref.address
                    ? `${ref.address.substring(0, 8)}...${ref.address.substring(34)}`
                    : "0x78a1...44b2"}
                </td>
                <td className="p-3 text-slate-500">{ref.date}</td>
                <td className="p-3 font-bold text-emerald-600">
                  {ref.status === "Active" ? "+50,000 PVC" : "0 PVC (Pending)"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      ref.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ref.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
