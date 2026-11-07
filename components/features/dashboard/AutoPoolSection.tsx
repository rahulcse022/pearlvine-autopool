"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { CONTRACT_CONSTANTS } from "@/constants/contractConfig";

export default function AutoPoolSection() {
  const {
    user,
    joinAutoPool,
    approvePvcTokens,
    isTransacting,
    contractAddress,
    tokenContractAddress,
  } = usePearlvine();

  const isApproved = user.allowance >= CONTRACT_CONSTANTS.JOIN_AMOUNT;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Auto Pool Membership (200,000 PVC)</h2>
            
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exact 200,000 PVC entry fee strictly divided into Direct (50k), 10-Level Reward (10k), Admin Reserve (40k), and Global Auto Pool (100k).
          </p>
        </div>
        <div>
          {user.isPoolJoined ? (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-circle-check mr-1.5"></i> Pool Active on-chain
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center">
              <i className="fa-solid fa-clock mr-1.5"></i> Not Joined (200,000 PVC Entry)
            </span>
          )}
        </div>
      </div>

      {/* Contract Links on BSC Testnet */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 font-medium">Referral System Contract:</span>
          <a
            href={`https://testnet.bscscan.com/address/${contractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-blue-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
          >
            <span>{contractAddress}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 font-medium">PVC Token Contract:</span>
          <a
            href={`https://testnet.bscscan.com/address/${tokenContractAddress}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-emerald-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
          >
            <span>{tokenContractAddress}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Join Amount</span>
          <p className="text-2xl font-black text-slate-900 mt-1">200,000 PVC</p>
          <span className="text-[10px] text-slate-400">18 Decimals ERC-20</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Direct Reward</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">50,000 PVC</p>
          <span className="text-[10px] text-emerald-600 font-bold">25% to Sponsor</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">10-Level Reward</span>
          <p className="text-2xl font-black text-amber-600 mt-1">10,000 PVC</p>
          <span className="text-[10px] text-amber-600 font-bold">100 PVC × 10 Uplines</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Auto Pool Reserve</span>
          <p className="text-2xl font-black text-blue-600 mt-1">100,000 PVC</p>
          <span className="text-[10px] text-blue-600 font-bold">50% Community Pool</span>
        </div>
      </div>

      {/* Contract Breakdown Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800">
          Smart Contract 200,000 PVC Distribution Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold">
                <th className="p-3 rounded-l-lg">Recipient / Component</th>
                <th className="p-3">Amount (PVC)</th>
                <th className="p-3">Share (%)</th>
                <th className="p-3 rounded-r-lg">Solidity Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Direct Sponsor Reward</td>
                <td className="p-3 font-bold text-emerald-600">50,000 PVC</td>
                <td className="p-3 font-semibold">25%</td>
                <td className="p-3 text-slate-500 font-mono text-[11px]">
                  pvcToken.safeTransfer(referrer, DIRECT_REWARD)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">
                  10-Level Upline Share (100 PVC per level)
                </td>
                <td className="p-3 font-bold text-amber-600">10,000 PVC</td>
                <td className="p-3 font-semibold">5%</td>
                <td className="p-3 text-slate-500 font-mono text-[11px]">
                  pvcToken.safeTransfer(upline, LEVEL_REWARD) [100 PVC]
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Admin &amp; Maintenance Reserve</td>
                <td className="p-3 font-bold text-slate-700">40,000 PVC</td>
                <td className="p-3 font-semibold">20%</td>
                <td className="p-3 text-slate-500 font-mono text-[11px]">
                  ADMIN_REWARD + unpaid level share (adminReserve)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Global Auto Pool Allocation</td>
                <td className="p-3 font-bold text-blue-600">100,000 PVC</td>
                <td className="p-3 font-semibold">50%</td>
                <td className="p-3 text-slate-500 font-mono text-[11px]">
                  POOL_REWARD (100,000 PVC community pool)
                </td>
              </tr>
              <tr className="bg-blue-50/70 font-black text-slate-900">
                <td className="p-3 rounded-l-lg">Total Join Amount</td>
                <td className="p-3 text-blue-700 font-black">200,000 PVC</td>
                <td className="p-3 font-bold">100%</td>
                <td className="p-3 rounded-r-lg font-mono text-[11px]">
                  JOIN_AMOUNT = 200_000 * UNIT (Fully Accounted)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Step BSC Testnet Execution Flow */}
      <div className="pt-2">
        {user.isPoolJoined ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold text-center">
            <i className="fa-solid fa-circle-check mr-2 text-base"></i>
            Active Auto Pool Member on BSC Testnet! 200,000 PVC allocated across system pool and direct uplines.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Step 1: Approve Button */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Step 1: ERC-20 Approve</span>
                  {isApproved ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Approved
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Authorizes referral contract to transfer 200,000 PVC tokens for join.
                </p>
                <button
                  type="button"
                  onClick={approvePvcTokens}
                  disabled={isApproved || isTransacting}
                  className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-xs transition"
                >
                  {isApproved ? "Approved ✓" : isTransacting ? "Approving..." : "Approve 200,000 PVC"}
                </button>
              </div>

              {/* Step 2: Join Button */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Step 2: Execute join()</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    On-chain
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Executes the referral matrix split and adds your wallet to the global auto pool.
                </p>
                <button
                  type="button"
                  onClick={joinAutoPool}
                  disabled={isTransacting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-xs shadow transition"
                >
                  {isTransacting ? "Confirming on BSC Testnet..." : "Join Auto Pool (200,000 PVC)"}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Current Available Balance: <span className="font-bold text-slate-800">{user.pvcBalance.toLocaleString()} PVC</span>
              {user.pvcBalance >= CONTRACT_CONSTANTS.JOIN_AMOUNT ? " (Sufficient Balance)" : " (Need 200,000 PVC on BSC Testnet)"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
