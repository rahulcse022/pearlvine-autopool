"use client";

import React, { useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function RegisterForm() {
  const {
    setActiveTab,
    registerWithSignature,
    rootAddress,
    isSigning,
  } = usePearlvine();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("9900000099");
  const [sponsor, setSponsor] = useState(rootAddress);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    await registerWithSignature(name, email, mobile, sponsor);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-6 sm:p-7 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Register with Digital Signature</h2>
            <p className="text-xs text-slate-400 mt-0.5">Passwordless Web3 Identity</p>
          </div>
          <span className="text-xs bg-blue-600 px-3 py-1 rounded-full font-bold">
            200,000 PVC
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Info Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start space-x-3 text-xs text-emerald-900">
            <i className="fa-solid fa-signature text-emerald-600 text-lg mt-0.5"></i>
            <div>
              <span className="font-bold block">No Password Required</span>
              <span className="text-emerald-700 leading-relaxed text-[11px] block mt-0.5">
                Your account is cryptographically verified via your Web3 private key. Zero password risk, zero database leaks.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9900000099"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-r-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Sponsor Address (Mandatory on BSC Testnet)
                </label>
                <button
                  type="button"
                  onClick={() => setSponsor(rootAddress)}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Use Root Contract
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
              <p className="text-[10px] text-slate-400 mt-1">
                Default Sponsor is Root Contract: <code className="font-mono text-blue-600">{rootAddress.substring(0, 10)}...{rootAddress.substring(34)}</code>
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="regTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="regTerms" className="text-xs text-slate-600 cursor-pointer">
                I agree to the 200,000 PVC auto pool rules and smart contract referral terms
              </label>
            </div>

            <button
              type="submit"
              disabled={isSigning}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 text-sm flex items-center justify-center space-x-2"
            >
              {isSigning ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Signing Digital Verification Challenge...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-signature"></i>
                  <span>Sign &amp; Register on BSC Testnet</span>
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
              Already have an on-chain account? Sign in with digital signature
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
