"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";

export default function DashboardOverview() {
  const { user, referrals, setUserPane } = usePearlvine();

  const activeReferrals = referrals.filter((r) => r.status === "Active").length;
  const totalEarned =
    user.earnings.directEarnings +
    user.earnings.levelEarnings +
    user.autoPoolEarnings;
  const shortWallet = user.walletAddress
    ? formatAddress(user.walletAddress)
    : user.accountNo;

  return (
    <div className="space-y-5">
      {/* Welcome / Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-md">
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/90">
                Dashboard
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight truncate">
                {user.name}
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {user.status || "Registered Member"}
              </p>
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
              {user.isPoolJoined ? "Pool Active" : "Not Joined"}
            </span>
          </div>

          <a
            href={`https://testnet.bscscan.com/address/${user.walletAddress}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:bg-white/10"
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Connected Wallet
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-cyan-300 truncate">
                {shortWallet}
              </p>
            </div>
            <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
              <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Earned</p>
              <p className="mt-1 text-sm font-black text-white leading-tight">
                {totalEarned.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">PVC</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Directs</p>
              <p className="mt-1 text-sm font-black text-emerald-300 leading-tight">
                {activeReferrals}
              </p>
              <p className="text-[10px] text-slate-500">Active</p>
            </div>
          </div>

          {!user.isPoolJoined && (
            <button
              type="button"
              onClick={() => setUserPane("autopool")}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-950/40 transition hover:from-blue-500 hover:to-cyan-500"
            >
              Join Auto Pool · 200,000 PVC
            </button>
          )}
        </div>
      </section>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
                PVC Balance
              </p>
              <i className="fa-solid fa-wallet text-cyan-400"></i>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {user.pvcBalance.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-300 mt-1">Available ERC-20</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
            <span>Entry</span>
            <span className="font-bold text-white">200,000 PVC</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                Direct Earnings
              </p>
              <i className="fa-solid fa-users text-emerald-200"></i>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {user.earnings.directEarnings.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-100 mt-1">50,000 PVC / direct</p>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-500/50 flex justify-between items-center text-[11px] text-emerald-100">
            <span>Partners</span>
            <span className="font-bold text-white">{activeReferrals} Active</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[11px] uppercase tracking-wider text-amber-200 font-bold">
                Level Reward
              </p>
              <i className="fa-solid fa-layer-group text-amber-200"></i>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {user.earnings.levelEarnings.toLocaleString()}
            </h3>
            <p className="text-xs text-amber-100 mt-1">100 PVC / upline</p>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-500/50 flex justify-between items-center text-[11px] text-amber-100">
            <span>Share</span>
            <span className="font-bold text-white">10,000 PVC</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
                Auto Pool
              </p>
              <i className="fa-solid fa-water text-blue-200"></i>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {user.autoPoolEarnings.toLocaleString()}
            </h3>
            <p className="text-xs text-blue-100 mt-1">Community allocation</p>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-500/50 flex justify-between items-center text-[11px] text-blue-100">
            <span>Status</span>
            <span className="font-bold text-white">
              {user.isPoolJoined ? "Active" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setUserPane("autopool")}
            className="p-3 sm:p-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition text-left flex items-center gap-2.5 border border-blue-100"
          >
            <i className="fa-solid fa-water text-base sm:text-lg shrink-0"></i>
            <div className="min-w-0">
              <p className="font-bold truncate">Auto Pool</p>
              <p className="text-[10px] text-blue-600 font-normal truncate">Join 200k PVC</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setUserPane("referrals")}
            className="p-3 sm:p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition text-left flex items-center gap-2.5 border border-emerald-100"
          >
            <i className="fa-solid fa-user-plus text-base sm:text-lg shrink-0"></i>
            <div className="min-w-0">
              <p className="font-bold truncate">Invite Partners</p>
              <p className="text-[10px] text-emerald-600 font-normal truncate">50k PVC direct</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setUserPane("level")}
            className="p-3 sm:p-3.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition text-left flex items-center gap-2.5 border border-amber-100"
          >
            <i className="fa-solid fa-layer-group text-base sm:text-lg shrink-0"></i>
            <div className="min-w-0">
              <p className="font-bold truncate">Level Rewards</p>
              <p className="text-[10px] text-amber-600 font-normal truncate">100 PVC / tier</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
