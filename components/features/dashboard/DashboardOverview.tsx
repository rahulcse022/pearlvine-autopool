"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";
import { APP_PATHS } from "@/constants/routes";
import MetricCard from "@/components/common/MetricCard";
import CurrentAutoPoolRecipient from "@/components/common/CurrentAutoPoolRecipient";

export default function DashboardOverview() {
  const {
    user,
    referrals,
    levelStats,
    autoPool,
    totalJoined,
    showModal,
  } = usePearlvine();

  const earnings = user.earnings ?? {
    directEarnings: 0,
    levelEarnings: 0,
    autoPoolEarnings: 0,
  };
  const totalWithdraw =
    earnings.directEarnings + earnings.levelEarnings + earnings.autoPoolEarnings;
  const totalDirect = referrals.length;
  const totalLevel = levelStats.reduce((sum, stat) => sum + (stat.joinings || 0), 0);

  const progressPct =
    autoPool.target > 0
      ? Math.min(100, Math.round((autoPool.earned / autoPool.target) * 100))
      : 0;

  const refLink =
    typeof window !== "undefined"
      ? `${window.location.origin}${APP_PATHS.register}?ref=${user.walletAddress}`
      : `${APP_PATHS.register}?ref=${user.walletAddress}`;

  const copyText = (text: string, successMessage: string) => {
    if (!text) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    showModal("Copied", successMessage, "success");
  };

  const copyRefLink = () => {
    copyText(refLink, "Referral link copied.");
  };

  const copyAddress = (address: string, label: string) => {
    copyText(address, `${label} address copied.`);
  };

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50 shadow-sm">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="min-w-0 flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-black text-white">
                {(user.name || "M").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  Member Profile
                </p>
                <h2 className="mt-0.5 text-xl font-black tracking-tight truncate text-slate-900">
                  {user.name || "Member"}
                </h2>
              </div>
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                user.isPoolJoined
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.isPoolJoined ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {user.isPoolJoined ? "Joined" : "Not Joined"}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <DetailRow label="Email" value={user.email || "—"} />
            <DetailRow label="Mobile" value={user.mobile || "—"} />
            <DetailRow
              label="Wallet"
              value={formatAddress(user.walletAddress, 6) || "—"}
              mono
              fullValue={user.walletAddress}
              onCopy={() => copyAddress(user.walletAddress, "Wallet")}
              explorerUrl={
                user.walletAddress
                  ? `https://testnet.bscscan.com/address/${user.walletAddress}`
                  : undefined
              }
            />
            <DetailRow
              label="Sponsor"
              value={
                user.referrerName ||
                formatAddress(user.referrerAddress, 6) ||
                "—"
              }
              subValue={
                user.referrerName && user.referrerAddress
                  ? formatAddress(user.referrerAddress, 6)
                  : undefined
              }
              mono={!user.referrerName}
              fullValue={user.referrerAddress}
              onCopy={() => copyAddress(user.referrerAddress, "Sponsor")}
              explorerUrl={
                user.referrerAddress
                  ? `https://testnet.bscscan.com/address/${user.referrerAddress}`
                  : undefined
              }
            />
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
      
        <MetricCard
          label="Total Withdraw"
          value={`${totalWithdraw} PVC`}
          icon="fa-money-bill-transfer"
          tone="cyan"
        />
        <MetricCard
          label="Total Crowd"
          value={String(totalJoined)}
          icon="fa-user-group"
          tone="emerald"
        />
        <MetricCard
          label="Total Direct"
          value={String(totalDirect)}
          icon="fa-users"
          tone="blue"
        />
        <MetricCard
          label="Total Level"
          value={String(totalLevel)}
          icon="fa-layer-group"
          tone="amber"
        />
      </div>

      <CurrentAutoPoolRecipient
        name={autoPool.currentRecipientName}
        address={autoPool.currentRecipient}
        earned={autoPool.currentRecipientEarned}
        target={autoPool.currentRecipientTarget}
        queueLength={autoPool.queueLength}
        compact
      />

      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-slate-800 text-sm">Your AutoPool Progress</h3>
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

function DetailRow({
  label,
  value,
  subValue,
  mono = false,
  fullValue,
  onCopy,
  explorerUrl,
}: {
  label: string;
  value: string;
  subValue?: string;
  mono?: boolean;
  fullValue?: string;
  onCopy?: () => void;
  explorerUrl?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p
          className={`mt-0.5 text-sm font-semibold text-slate-900 truncate ${
            mono ? "font-mono text-blue-600" : ""
          }`}
          title={fullValue || value}
        >
          {value}
        </p>
        {subValue && (
          <p
            className="mt-0.5 text-xs font-mono text-blue-600/90 truncate"
            title={fullValue || subValue}
          >
            {subValue}
          </p>
        )}
      </div>
      {(onCopy || explorerUrl) && (
        <div className="flex shrink-0 items-center gap-1.5">
          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              disabled={!fullValue}
              title={`Copy ${label.toLowerCase()}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
            >
              <i className="fa-solid fa-copy text-[11px]"></i>
            </button>
          )}
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              title="View on BscScan Testnet"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
