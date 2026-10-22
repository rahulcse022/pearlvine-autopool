"use client";

import React, { useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function RegisterForm() {
  const { setActiveTab, registerUser } = usePearlvine();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("9900000099");
  const [password, setPassword] = useState("");
  const [sponsor, setSponsor] = useState("100274127066");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [createdAccountNo, setCreatedAccountNo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    const acc = registerUser(name, email, mobile, sponsor);
    setCreatedAccountNo(acc);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Register / Create Account</h2>
          <span className="text-xs bg-blue-500 px-2.5 py-1 rounded font-medium">
            Secure Form
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {createdAccountNo && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium animate-in fade-in">
              <i className="fa-solid fa-circle-check mr-2 text-emerald-600"></i>
              Successful! Your Registration was successful. Account No:{" "}
              <span className="font-bold underline">{createdAccountNo}</span>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                >
                  Proceed to Login
                </button>
              </div>
            </div>
          )}

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
                Your Email
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
                Select Country & Mobile
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
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Choose Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Sponsor / Referral ID (Mandatory)
              </label>
              <input
                type="text"
                required
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                placeholder="Sponsor Account No"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="regTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="regTerms" className="text-xs text-slate-600 cursor-pointer">
                I agree to terms & conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition text-sm hover:shadow-md"
            >
              Create Account
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-xs text-blue-600 hover:underline"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
