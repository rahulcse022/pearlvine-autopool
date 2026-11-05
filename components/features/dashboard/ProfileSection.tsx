"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ProfileSection() {
  const { user, contractAddress, tokenContractAddress, rootAddress, signature } =
    usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Account Profile &amp; Smart Contract Data
            </h2>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
              BSC Testnet (Chain ID: 97)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated via Web3 Digital Signature. Live data synced from BNB Smart Chain Testnet.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
          <i className="fa-solid fa-signature text-emerald-600"></i>
          <span>Signature Verified</span>
        </div>
      </div>

      {/* Digital Signature Proof Card */}
      {signature && (
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <i className="fa-solid fa-shield-halved"></i>
              Cryptographic Digital Signature Verification
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              EIP-191 Verified
            </span>
          </div>
          <p className="font-mono text-[11px] text-slate-300 break-all bg-black/30 p-2.5 rounded-xl border border-white/5">
            {signature.signature}
          </p>
          <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-400 pt-1">
            <span>Signer: <code className="text-cyan-300 font-mono">{signature.signerAddress}</code></span>
            <span>Verified at: {new Date(signature.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Full Name</span>
          <p className="font-bold text-slate-900 text-sm mt-1">{user.name}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Pearlvine Account No</span>
          <p className="font-mono font-bold text-slate-900 text-sm mt-1">
            {user.accountNo}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Wallet Address (msg.sender)</span>
            <a
              href={`https://testnet.bscscan.com/address/${user.walletAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
            >
              <span>BscScan</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
            </a>
          </div>
          <p className="font-mono font-bold text-blue-600 text-xs mt-1 break-all">
            {user.walletAddress}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Sponsor / Referrer Address</span>
            {user.referrerAddress === rootAddress && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                Root Contract
              </span>
            )}
          </div>
          <p className="font-mono font-bold text-slate-800 text-xs mt-1 break-all">
            {user.referrerAddress}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Auto Pool Status (200,000 PVC)</span>
          <p
            className={`font-bold text-sm mt-1 flex items-center gap-1.5 ${
              user.isPoolJoined ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            <i
              className={`fa-solid ${
                user.isPoolJoined ? "fa-circle-check" : "fa-clock"
              }`}
            ></i>
            {user.isPoolJoined ? "Active (200,000 PVC Joined)" : "Not Joined"}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Referral Contract on BSC Testnet</span>
            <a
              href={`https://testnet.bscscan.com/address/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
            >
              <span>View Contract</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
            </a>
          </div>
          <p className="font-mono font-bold text-slate-700 text-xs mt-1 break-all">
            {contractAddress}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">PVC Token Contract on BSC Testnet</span>
            <a
              href={`https://testnet.bscscan.com/address/${tokenContractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 font-bold"
            >
              <span>View Token on BscScan</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
            </a>
          </div>
          <p className="font-mono font-bold text-emerald-700 text-xs mt-1 break-all">
            {tokenContractAddress}
          </p>
        </div>
      </div>

      {/* Contract Earnings Struct Display */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Contract Storage: <code className="text-blue-600 font-mono">earning(address)</code> on BSC Testnet
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium">directEarnings</span>
            <p className="text-sm font-black text-emerald-600 mt-1">
              {user.earnings.directEarnings.toLocaleString()} PVC
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium">levelEarnings</span>
            <p className="text-sm font-black text-amber-600 mt-1">
              {user.earnings.levelEarnings.toLocaleString()} PVC
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium">airdropEarnings</span>
            <p className="text-sm font-black text-purple-600 mt-1">
              {user.earnings.airdropEarnings.toLocaleString()} PVC
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium">pendingAirdropEarning</span>
            <p className="text-sm font-black text-blue-600 mt-1">
              {user.earnings.pendingAirdropEarning.toLocaleString()} PVC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
