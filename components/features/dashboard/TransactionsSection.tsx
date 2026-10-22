"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function TransactionsSection() {
  const { transactions } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
        <p className="text-xs text-slate-500 mt-1">
          Comprehensive ledger of pool joining, level incomes, scratch rewards, and payouts.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-3 rounded-l-lg">Reference ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-medium">{txn.id}</td>
                <td className="p-3 font-semibold text-slate-800">{txn.type}</td>
                <td
                  className={`p-3 font-bold ${
                    txn.isPositive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {txn.isPositive ? `+${txn.amount}` : `-${txn.amount}`} PVC
                </td>
                <td className="p-3 text-slate-500">{txn.date}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      txn.status === "Success"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {txn.status}
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
