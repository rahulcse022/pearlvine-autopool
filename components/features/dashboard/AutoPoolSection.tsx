"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";
import MetricCard from "@/components/common/MetricCard";

export default function AutoPoolSection() {
  const { user, autoPool, tokenConfig } = usePearlvine();

  const progressPct =
    autoPool.target > 0
      ? Math.min(100, Math.round((autoPool.earned / autoPool.target) * 100))
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Auto Pool</h2>
          <p className="text-xs text-slate-500 mt-1">
            FIFO · {tokenConfig.autoPoolContribution} PVC / join · target{" "}
            {tokenConfig.autoPoolTarget} PVC
          </p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            autoPool.completed
              ? "bg-emerald-100 text-emerald-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {autoPool.completed ? "Completed" : "In Progress"}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        <MetricCard
          label="Your Earnings"
          value={`${user.earnings?.autoPoolEarnings ?? 0} PVC`}
          icon="fa-water"
          tone="blue"
        />
        <MetricCard
          label="Earned / Target"
          value={`${autoPool.earned} / ${autoPool.target}`}
          hint={`${autoPool.remaining} PVC left`}
          icon="fa-bullseye"
          tone="cyan"
        />
        <MetricCard
          label="Queue"
          value={String(autoPool.queueLength)}
          hint={
            autoPool.currentRecipient
              ? `Now: ${formatAddress(autoPool.currentRecipient)}`
              : "No recipient"
          }
          icon="fa-list-ol"
          tone="slate"
        />
      </div>

      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm space-y-2">
        <div className="flex justify-between text-xs text-slate-600">
          <span className="font-semibold">Progress</span>
          <span className="font-bold text-blue-700">{progressPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-blue-50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
