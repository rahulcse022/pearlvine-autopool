"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";
import MetricCard from "@/components/common/MetricCard";

export default function LevelIncomeSection() {
  const { user, levelRewards, levelStats, tokenConfig } = usePearlvine();
  const maxLevels = tokenConfig.maxLevels || 10;
  const rewardPerJoin = tokenConfig.levelReward;
  const totalJoinings = levelStats.reduce((sum, s) => sum + s.joinings, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Level Reward</h2>
        <p className="text-xs text-slate-500 mt-1">
          {maxLevels} levels · {rewardPerJoin} PVC each · total share {tokenConfig.levelShare} PVC
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <MetricCard
          label="Level Earnings"
          value={`${user.earnings?.levelEarnings ?? 0} PVC`}
          icon="fa-layer-group"
          tone="amber"
        />
        <MetricCard
          label="Total Joinings"
          value={String(totalJoinings)}
          hint="Across all levels"
          icon="fa-sitemap"
          tone="cyan"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {levelStats.map((stat) => {
          const hasData = stat.joinings > 0;
          return (
            <div
              key={stat.level}
              className={`px-2.5 py-2 rounded-xl border ${
                hasData
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-slate-800">L{stat.level}</span>
                <span
                  className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                    hasData
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {hasData ? "Active" : "Empty"}
                </span>
              </div>
              <p className="text-sm font-black text-amber-600 mt-1 leading-tight">
                {stat.income} PVC
              </p>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
                {stat.joinings} join
              </p>
            </div>
          );
        })}
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">Level Income</h3>
          <span className="text-[11px] text-slate-500">
            {levelRewards.length} member{levelRewards.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="bg-white overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="bg-amber-50 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Wallet</th>
                <th className="p-3">Level</th>
                <th className="p-3">Joined</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {levelRewards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No level income yet. When members join under your downline, details will appear
                    here.
                  </td>
                </tr>
              ) : (
                levelRewards.map((row) => (
                  <tr
                    key={`${row.address}-${row.level}-${row.date}`}
                    className="hover:bg-amber-50/40 transition"
                  >
                    <td className="p-3 font-semibold text-slate-800">{row.name || "—"}</td>
                    <td className="p-3 text-slate-600 break-all">{row.email || "—"}</td>
                    <td className="p-3 text-slate-600">{row.mobile || "—"}</td>
                    <td className="p-3 font-mono text-slate-800" title={row.address}>
                      <a
                        href={`https://testnet.bscscan.com/address/${row.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {formatAddress(row.address, 6)}
                      </a>
                    </td>
                    <td className="p-3 font-bold text-amber-700">L{row.level}</td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">{row.date || "—"}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
