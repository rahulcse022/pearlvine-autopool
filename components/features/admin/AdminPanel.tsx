"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import { fetchAdminPanelState } from "@/services/web3Service";
import { formatAddress } from "@/utils/formatAddress";
import { getBscAddressUrl } from "@/utils/explorer";

export default function AdminPanel() {
  const { isAdmin, isTransacting, withdrawPvcToPartners } = usePearlvine();
  const [loading, setLoading] = useState(true);
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [adminReserve, setAdminReserve] = useState(0);
  const [amount, setAmount] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const state = await fetchAdminPanelState();
      if (!state) {
        setPartner1("");
        setPartner2("");
        setAdminReserve(0);
        return;
      }
      setPartner1(state.partner1);
      setPartner2(state.partner2);
      setAdminReserve(state.adminReserve);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadState();
  }, [loadState, refreshKey]);

  if (!isAdmin) {
    return (
      <section className="py-16 px-4 flex justify-center">
        <div className="max-w-md w-full rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-sm text-amber-900">
          Admin access only. Connect with the contract owner wallet.
        </div>
      </section>
    );
  }

  const parsedAmount = Number(amount);
  const amountValid =
    Number.isFinite(parsedAmount) && parsedAmount > 0 && parsedAmount <= adminReserve;
  const half = amountValid ? parsedAmount / 2 : 0;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountValid) return;
    const ok = await withdrawPvcToPartners(parsedAmount);
    if (ok) {
      setAmount("");
      setRefreshKey((k) => k + 1);
    }
  };

  const fillMax = () => {
    setAmount(adminReserve > 0 ? String(adminReserve) : "");
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-14rem)]">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Contract Owner
              </p>
              <h1 className="text-xl font-black">Admin Panel</h1>
            </div>
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={loading || isTransacting}
              className="text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-3 py-2 disabled:opacity-50"
            >
              <i className={`fa-solid fa-rotate ${loading ? "fa-spin" : ""}`}></i>
              <span className="ml-2">Refresh</span>
            </button>
          </div>

          <div className="p-6 space-y-5">
            {loading ? (
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Loading admin data...
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    Admin Reserve
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {adminReserve.toLocaleString()}{" "}
                    <span className="text-sm font-bold text-slate-500">PVC</span>
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <PartnerCard label="Partner 1" address={partner1} />
                  <PartnerCard label="Partner 2" address={partner2} />
                </div>

                <form onSubmit={(e) => void handleWithdraw(e)} className="space-y-4 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold uppercase text-slate-600">
                        Withdraw Amount (PVC)
                      </label>
                      <button
                        type="button"
                        onClick={fillMax}
                        disabled={adminReserve <= 0 || isTransacting}
                        className="text-[10px] font-bold text-blue-600 hover:underline disabled:opacity-40"
                      >
                        Use Max
                      </button>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={adminReserve}
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Max ${adminReserve}`}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                      required
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Max = adminReserve ({adminReserve.toLocaleString()} PVC). Split 50/50 to
                      partners.
                    </p>
                  </div>

                  {amountValid && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 space-y-1">
                      <p>
                        Partner 1 receives: <strong>{half.toLocaleString()} PVC</strong>
                      </p>
                      <p>
                        Partner 2 receives: <strong>{half.toLocaleString()} PVC</strong>
                      </p>
                    </div>
                  )}

                  {amount !== "" && !amountValid && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                      Enter an amount greater than 0 and at most {adminReserve.toLocaleString()} PVC.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!amountValid || isTransacting || adminReserve <= 0}
                    className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 hover:from-slate-800 hover:to-blue-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-lg transition text-sm flex items-center justify-center gap-2"
                  >
                    {isTransacting ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Withdrawing...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-money-bill-transfer"></i>
                        <span>Withdraw to Partners</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ label, address }: { label: string; address: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      {address ? (
        <a
          href={getBscAddressUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block font-mono text-sm font-bold text-blue-700 hover:underline break-all"
          title={address}
        >
          {formatAddress(address, 6)}
          <i className="fa-solid fa-arrow-up-right-from-square text-[9px] ml-1.5"></i>
        </a>
      ) : (
        <p className="mt-1 text-sm text-slate-400">Not set</p>
      )}
    </div>
  );
}
