"use client";

import React, { useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ClaimsSection() {
  const { user, claims, submitClaim } = usePearlvine();
  const [claimAmount, setClaimAmount] = useState<string>("");

  const pendingAmount = claims
    .filter((c) => c.status === "Pending Admin Approval")
    .reduce((acc, c) => acc + c.amount, 0);

  const paidAmount = claims
    .filter((c) => c.status === "Approved & Paid")
    .reduce((acc, c) => acc + c.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(claimAmount, 10);
    if (!amount || isNaN(amount)) return;

    const success = submitClaim(amount);
    if (success) {
      setClaimAmount("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Claim Reward Payouts</h2>
        <p className="text-xs text-slate-500 mt-1">
          Submit claim requests for accumulated Scratch Card rewards. Requires admin approval before transfer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Available Reward Balance</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {user.scratchBalance} PVC
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Pending Claims</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {pendingAmount} PVC
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Paid Rewards</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {paidAmount} PVC
          </p>
        </div>
      </div>

      {/* Claim Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200"
      >
        <h3 className="font-bold text-sm text-slate-800">New Claim Request</h3>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
            Requested PVC Amount (Max: {user.scratchBalance} PVC)
          </label>
          <input
            type="number"
            required
            max={user.scratchBalance}
            min={1}
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            placeholder="Enter amount to claim"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          type="submit"
          disabled={user.scratchBalance <= 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition text-sm"
        >
          Submit Claim Request
        </button>
      </form>

      {/* Claims History Table */}
      <div className="overflow-x-auto">
        <h3 className="font-bold text-sm text-slate-800 mb-3">Claims History</h3>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-3 rounded-l-lg">Claim ID</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-medium">{claim.id}</td>
                <td className="p-3 font-bold text-slate-900">{claim.amount} PVC</td>
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
