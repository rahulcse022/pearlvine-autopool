"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";

export default function LoginForm() {
  const {
    loginWithSignature,
    isSigning,
    isConnecting,
    setActiveTab,
    contractAddress,
    tokenContractAddress,
  } = usePearlvine();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#0f172a] text-white p-6 sm:p-7 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">
                Only joined wallets can log in
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-cyan-400 text-xl">
              <i className="fa-solid fa-signature"></i>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            If your wallet has not paid the join amount on-chain, login will be blocked. Register
            first.
          </div>

          <button
            type="button"
            onClick={() => void loginWithSignature()}
            disabled={isSigning || isConnecting}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
          >
            {isSigning || isConnecting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>{isConnecting ? "Connecting..." : "Checking membership..."}</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-wallet text-lg"></i>
                <span>Sign In with Wallet</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex justify-between items-center gap-3">
              <span>Referral Contract</span>
              <a
                href={`https://testnet.bscscan.com/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-blue-600 hover:underline font-semibold"
              >
                {formatAddress(contractAddress)}
              </a>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span>PVC Token</span>
              <a
                href={`https://testnet.bscscan.com/address/${tokenContractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-blue-600 hover:underline font-semibold"
              >
                {formatAddress(tokenContractAddress)}
              </a>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Not joined yet? Register
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
