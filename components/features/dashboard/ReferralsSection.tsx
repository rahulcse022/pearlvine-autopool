"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ReferralsSection() {
  const { user, referrals, showModal } = usePearlvine();
  const refLink = `https://pearlvine.com/ref?id=${user.accountNo}`;

  const copyRefLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(refLink);
    }
    showModal("Link Copied", "Referral link copied to clipboard successfully!", "success");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Direct Referrals & Team</h2>
        <p className="text-xs text-slate-500 mt-1">
          Share your referral link to earn 1,000 PVC L1 sponsor reward and bonus Scratch Cards.
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 font-semibold">Your Referral Link</span>
          <p className="text-sm font-mono font-bold text-blue-600 mt-1 break-all">
            {refLink}
          </p>
        </div>
        <button
          type="button"
          onClick={copyRefLink}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center justify-center space-x-1.5"
        >
          <i className="fa-solid fa-copy"></i>
          <span>Copy Link</span>
        </button>
      </div>

      {/* Referrals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-3 rounded-l-lg">Account No</th>
              <th className="p-3">User Name</th>
              <th className="p-3">Joining Date</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {referrals.map((ref) => (
              <tr key={ref.accountNo} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-medium">{ref.accountNo}</td>
                <td className="p-3 font-semibold text-slate-800">{ref.name}</td>
                <td className="p-3 text-slate-500">{ref.date}</td>
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
