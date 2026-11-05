"use client";

import React, { useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function LoginForm() {
  const {
    loginWithSignature,
    isSigning,
    isConnecting,
    setActiveTab,
    contractAddress,
    tokenContractAddress,
    user,
  } = usePearlvine();

  const [customAddress, setCustomAddress] = useState<string>(user.walletAddress || "");
  const [useCustomAddress, setUseCustomAddress] = useState<boolean>(false);

  const handleWalletLogin = async () => {
    await loginWithSignature();
  };

  const handleCustomAddressLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    await loginWithSignature(customAddress.trim());
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-6 sm:p-7 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/30 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                BSC Testnet (Chain ID: 97)
              </div>
              <h2 className="text-2xl font-black tracking-tight">Web3 Authentication</h2>
              <p className="text-xs text-slate-400 mt-1">
                Passwordless login via Cryptographic Digital Signature Verification
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-cyan-400 text-xl">
              <i className="fa-solid fa-signature"></i>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Digital Signature Info Banner */}
          <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
            <i className="fa-solid fa-shield-halved text-blue-600 text-base mt-0.5"></i>
            <div>
              <span className="font-bold block">No Passwords Required</span>
              <span className="text-blue-700 leading-relaxed text-[11px] block mt-0.5">
                Authentication relies on EIP-191 off-chain digital signatures verified by your private key. Safe, decentralized, and zero gas fees.
              </span>
            </div>
          </div>

          {!useCustomAddress ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleWalletLogin}
                disabled={isSigning || isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
              >
                {isSigning ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Verifying Digital Signature...</span>
                  </>
                ) : isConnecting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Connecting Web3 Wallet...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wallet text-lg"></i>
                    <span>Sign In with Web3 Digital Signature</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setUseCustomAddress(true)}
                  className="text-xs text-slate-500 hover:text-blue-600 transition font-medium"
                >
                  Or authenticate with specific BSC Testnet address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomAddressLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  EVM Wallet Address (0x...)
                </label>
                <input
                  type="text"
                  required
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSigning}
                  className="flex-grow bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow transition text-xs"
                >
                  {isSigning ? "Verifying..." : "Verify Signature & Enter"}
                </button>
                <button
                  type="button"
                  onClick={() => setUseCustomAddress(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {/* Smart Contract Quick Reference on BSC Testnet */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex justify-between items-center">
              <span>Referral Contract:</span>
              <a
                href={`https://testnet.bscscan.com/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{contractAddress.substring(0, 6)}...{contractAddress.substring(38)}</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span>PVC Token Contract:</span>
              <a
                href={`https://testnet.bscscan.com/address/${tokenContractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{tokenContractAddress.substring(0, 6)}...{tokenContractAddress.substring(38)}</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              New wallet? Register on-chain account here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
