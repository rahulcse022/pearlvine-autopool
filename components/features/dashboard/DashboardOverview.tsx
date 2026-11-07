"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";
import { APP_PATHS } from "@/constants/routes";
import MetricCard from "@/components/common/MetricCard";

export default function DashboardOverview() {
  const {
    user,
    referrals,
    autoPool,
    totalJoined,
    showModal,
  } = usePearlvine();

  const earnings = user.earnings ?? {
    directEarnings: 0,
    levelEarnings: 0,
    autoPoolEarnings: 0,
  };
  const totalEarned =
    earnings.directEarnings + earnings.levelEarnings + earnings.autoPoolEarnings;

  const progressPct =
    autoPool.target > 0
      ? Math.min(100, Math.round((autoPool.earned / autoPool.target) * 100))
      : 0;

  const refLink =
    typeof window !== "undefined"
      ? `${window.location.origin}${APP_PATHS.register}?ref=${user.walletAddress}`
      : `${APP_PATHS.register}?ref=${user.walletAddress}`;

  const copyRefLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(refLink);
    }
    showModal("Copied", "Referral link copied.", "success");
  };

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-md">
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/90">
                Dashboard
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight truncate">
                {user.name || "Member"}
              </h2>
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                user.isPoolJoined
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.isPoolJoined ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {user.isPoolJoined ? "Joined" : "Not Joined"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Wallet
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-cyan-300 truncate">
                {formatAddress(user.walletAddress)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Sponsor
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-slate-200 truncate">
                {formatAddress(user.referrerAddress)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Earned</p>
              <p className="mt-1 text-sm font-black text-white leading-tight">
                {totalEarned} PVC
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Joined</p>
              <p className="mt-1 text-sm font-black text-emerald-300 leading-tight">
                {totalJoined}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <MetricCard
          label="PVC Balance"
          value={`${user.pvcBalance ?? 0} PVC`}
          icon="fa-wallet"
          tone="slate"
        />
        <MetricCard
          label="Direct Earnings"
          value={`${earnings.directEarnings} PVC`}
          icon="fa-users"
          tone="emerald"
        />
        <MetricCard
          label="Level Earnings"
          value={`${earnings.levelEarnings} PVC`}
          icon="fa-layer-group"
          tone="amber"
        />
        <MetricCard
          label="AutoPool Earnings"
          value={`${earnings.autoPoolEarnings} PVC`}
          icon="fa-water"
          tone="blue"
        />
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-slate-800 text-sm">AutoPool Progress</h3>
          <span className="text-xs font-semibold text-slate-500">
            {autoPool.completed ? "Completed" : "In Progress"}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>
            Earned: <strong>{autoPool.earned} PVC</strong>
          </span>
          <span>
            Target: <strong>{autoPool.target} PVC</strong>
          </span>
          <span>
            Left: <strong>{autoPool.remaining} PVC</strong>
          </span>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-500">Referral Link</p>
          <p className="mt-1 text-xs font-mono text-blue-600 break-all">{refLink}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Direct referrals: {referrals.length}
          </p>
        </div>
        <button
          type="button"
          onClick={copyRefLink}
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          Copy Link
        </button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold text-center">
        Active member · joined on-chain
      </div>
    </div>
  );
}

