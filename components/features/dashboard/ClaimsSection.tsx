"use client";

import React, { useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ClaimsSection() {
  const { user, claims, submitClaim, claimAirdrop } = usePearlvine();
  const [claimAmount, setClaimAmount] = useState<string>("");

  const pendingClaimsTotal = claims
    .filter((c) => c.status === "Pending Admin Approval")
    .reduce((acc, c) => acc + c.amount, 0);

  const approvedClaimsTotal = claims
    .filter((c) => c.status === "Approved & Paid")
    .reduce((acc, c) => acc + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(claimAmount, 10);
    if (!amount || isNaN(amount)) return;

    const success = submitClaim(amount, "Airdrop Claim");
    if (success) {
      setClaimAmount("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Airdrop &amp; Reward Claims</h2>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              AIRDROP_REWARD = 500 PVC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Claim pending airdrops (500 PVC welcome bonus) and reward disbursements paid out of the smart contract admin reserve.
          </p>
        </div>

        {user.earnings.pendingAirdropEarning > 0 && (
          <button
            type="button"
            onClick={claimAirdrop}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-gift"></i>
            <span>Instant Claim {user.earnings.pendingAirdropEarning} PVC Airdrop</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Pending Airdrop / Rewards</span>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {user.earnings.pendingAirdropEarning} PVC
          </p>
          <span className="text-[10px] text-slate-400">Available to claim immediately</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Submitted Pending Claims</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {pendingClaimsTotal.toLocaleString()} PVC
          </p>
          <span className="text-[10px] text-slate-400">Awaiting admin transaction</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Settled &amp; Paid Rewards</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {(approvedClaimsTotal + user.earnings.airdropEarnings).toLocaleString()} PVC
          </p>
          <span className="text-[10px] text-slate-400">Transferred to your balance</span>
        </div>
      </div>

      {/* Claim Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200"
      >
        <h3 className="font-bold text-sm text-slate-800">Submit Manual Reward Claim</h3>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
            Claim Amount in PVC
          </label>
          <input
            type="number"
            required
            min={1}
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            placeholder="e.g. 500"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition text-sm"
        >
          Submit Claim Request
        </button>
      </form>

      {/* Claims History Table */}
      <div className="overflow-x-auto">
        <h3 className="font-bold text-sm text-slate-800 mb-3">Claim Request History</h3>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-3 rounded-l-lg">Claim ID</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-medium">{claim.id}</td>
                <td className="p-3 text-slate-600">{claim.category || "Airdrop Claim"}</td>
                <td className="p-3 font-bold text-slate-900">{claim.amount.toLocaleString()} PVC</td>
                <td className="p-3 text-slate-500">{claim.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      claim.status === "Approved & Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : claim.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {claim.status}
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
