"use client";

import { formatAddress } from "@/utils/formatAddress";
import { getBscAddressUrl } from "@/utils/explorer";

interface CurrentAutoPoolRecipientProps {
  name: string;
  address: string;
  earned: number;
  target: number;
  queueLength: number;
  compact?: boolean;
}

export default function CurrentAutoPoolRecipient({
  name,
  address,
  earned,
  target,
  queueLength,
  compact = false,
}: CurrentAutoPoolRecipientProps) {
  const progressPct =
    target > 0 ? Math.min(100, Math.round((earned / target) * 100)) : 0;

  if (!address) {
    return (
      <div
        className={`rounded-2xl border border-slate-200 bg-slate-50 text-center text-sm text-slate-500 ${
          compact ? "p-3" : "p-4"
        }`}
      >
        No active AutoPool recipient right now
        {queueLength > 0 ? ` · Queue: ${queueLength}` : ""}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-700">
            Current AutoPool
          </p>
          <h3 className="mt-1 truncate text-lg font-black text-slate-900">
            {name || "Member"}
          </h3>
          <p className="mt-0.5 truncate font-mono text-xs text-slate-600" title={address}>
            {formatAddress(address, 6)}
          </p>
        </div>
        <a
          href={getBscAddressUrl(address)}
          target="_blank"
          rel="noreferrer"
          title="View on BscScan"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-cyan-100 hover:text-cyan-800"
        >
          <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
        </a>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-600">
          <span>
            Active turn: <strong>{earned}</strong> / {target} PVC
          </span>
          <span className="font-bold text-cyan-700">{progressPct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-cyan-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {!compact && (
          <p className="text-[11px] text-slate-500">Queue waiting: {queueLength}</p>
        )}
      </div>
    </div>
  );
}
