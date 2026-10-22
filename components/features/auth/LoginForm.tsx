"use client";

import React, { useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function LoginForm() {
  const { loginUser, showModal } = usePearlvine();
  const [accountNo, setAccountNo] = useState("100274127066");
  const [password, setPassword] = useState("secret123");
  const [showOtpContainer, setShowOtpContainer] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("400583");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtpContainer(true);
    showModal(
      "Credentials Verified",
      "Credentials verified. Please click 'Verify Now' for Mobile OTP verification.",
      "info"
    );
  };

  const handleTriggerOtp = () => {
    setShowOtpInput(true);
    showModal(
      "OTP Sent",
      "OTP (400583) has been sent to your registered mobile number 9900000099.",
      "info"
    );
  };

  const handleVerifyOtp = () => {
    if (otpCode === "400583" || otpCode.length === 6) {
      loginUser(accountNo);
    } else {
      showModal("Invalid OTP", "Please enter the valid 6-digit OTP (400583).", "warning");
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Sign In to Account</h2>
          <i className="fa-solid fa-lock text-cyan-400"></i>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                <i className="fa-solid fa-user mr-1 text-slate-400"></i> Pearlvine A/c Number
              </label>
              <input
                type="text"
                required
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Enter Account Number"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                <i className="fa-solid fa-key mr-1 text-slate-400"></i> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition text-sm hover:shadow-md"
            >
              Login
            </button>
          </form>

          {showOtpContainer && (
            <div className="border-t border-slate-200 pt-6 space-y-4 animate-in fade-in">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-xs text-slate-600">Your Mobile Number is</p>
                <p className="text-lg font-bold text-[#0f172a]">9900000099</p>
              </div>

              {showOtpInput ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 text-center">
                    Enter 6-digit OTP:
                  </p>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-bold px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow transition text-sm"
                  >
                    Verify & Proceed to Dashboard
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleTriggerOtp}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-xl shadow transition text-sm"
                >
                  Verify Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
