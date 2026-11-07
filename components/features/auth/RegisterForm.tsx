"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { usePearlvine } from "@/context/PearlvineContext";

export default function RegisterForm() {
  const {
    setActiveTab,
    registerWithSignature,
    connectWallet,
    rootAddress,
    isSigning,
    isConnecting,
    isTransacting,
    tokenConfig,
    user,
  } = usePearlvine();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [sponsor, setSponsor] = useState(rootAddress);

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim() ?? "";
    if (ref && ethers.isAddress(ref)) {
      setSponsor(ethers.getAddress(ref));
    }
  }, [searchParams]);

  const busy = isSigning || isConnecting || isTransacting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethers.isAddress(sponsor.trim())) return;
    if (!user.walletAddress) {
      const connected = await connectWallet();
      if (!connected) return;
    }
    await registerWithSignature(name, email, mobile, sponsor);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#0f172a] text-white p-6 sm:p-7 border-b border-slate-800 flex justify-between items-center gap-3">
          <div>
            <h2 className="text-2xl font-black">Register &amp; Join</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pay {tokenConfig.joinAmount} PVC on-chain to join
            </p>
          </div>
          <span className="text-xs bg-blue-600 px-3 py-1 rounded-full font-bold shrink-0">
            {tokenConfig.joinAmount} PVC
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                maxLength={128}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                maxLength={128}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Mobile
              </label>
              <input
                type="tel"
                required
                maxLength={32}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile number"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Sponsor Address
                </label>
                <button
                  type="button"
                  onClick={() => setSponsor(rootAddress)}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Use Root
                </button>
              </div>
              <input
                type="text"
                required
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                placeholder="0x... Sponsor Address"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs font-mono"
              />
            </div>

            {user.walletAddress && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs space-y-1">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">
                  Connected Wallet
                </span>
                <p className="font-mono font-bold text-slate-800 break-all">
                  {user.walletAddress}
                </p>
                <p className="text-slate-500">
                  Balance: <strong>{user.pvcBalance} PVC</strong>
                </p>
              </div>
            )}

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900 space-y-1">
              <p>
                You will pay <strong>{tokenConfig.joinAmount} PVC</strong> to join via{" "}
                <code className="font-mono">join()</code>.
              </p>
              <p>
                Direct {tokenConfig.directReward} · Level {tokenConfig.levelShare} · AutoPool{" "}
                {tokenConfig.autoPoolContribution} · Admin {tokenConfig.adminReward}
              </p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 text-sm flex items-center justify-center space-x-2"
            >
              {busy ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>
                    {isConnecting
                      ? "Connecting..."
                      : isTransacting
                        ? "Joining on-chain..."
                        : "Signing..."}
                  </span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-handshake"></i>
                  <span>
                    {user.walletAddress
                      ? `Join · Pay ${tokenConfig.joinAmount} PVC`
                      : `Connect & Join · ${tokenConfig.joinAmount} PVC`}
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Already joined? Sign in
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
