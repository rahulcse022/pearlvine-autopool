"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function TransactionsSection() {
  const { transactions } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">Transaction &amp; Contract Ledger</h2>
          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
            On-Chain Events
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Historical record of 200,000 PVC pool allocations, 50,000 PVC direct commissions, 100 PVC level uplines, and airdrops.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-3 rounded-l-lg">Transaction ID</th>
              <th className="p-3">Type / Description</th>
              <th className="p-3">Tx Hash</th>
              <th className="p-3">Amount (PVC)</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-medium">{txn.id}</td>
                <td className="p-3 font-semibold text-slate-800">{txn.type}</td>
                <td className="p-3 font-mono text-slate-500 text-[11px]">
                  {txn.txHash ? (
                    <a
                      href={`https://testnet.bscscan.com/tx/${txn.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>{txn.txHash.length > 18 ? `${txn.txHash.substring(0, 8)}...${txn.txHash.substring(txn.txHash.length - 6)}` : txn.txHash}</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                    </a>
                  ) : (
                    "0x9f1a...e402"
                  )}
                </td>
                <td
                  className={`p-3 font-black ${
                    txn.isPositive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {txn.isPositive ? `+${txn.amount.toLocaleString()}` : `-${txn.amount.toLocaleString()}`} PVC
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
