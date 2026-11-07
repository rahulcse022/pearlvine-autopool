"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import { formatAddress } from "@/utils/formatAddress";
import { APP_PATHS } from "@/constants/routes";
import MetricCard from "@/components/common/MetricCard";

export default function ReferralsSection() {
  const { user, referrals, tokenConfig, showModal } = usePearlvine();

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Direct Referrals</h2>
          <p className="text-xs text-slate-500 mt-1">
            {tokenConfig.directReward} PVC per direct join
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <MetricCard
          label="Direct Earnings"
          value={`${user.earnings?.directEarnings ?? 0} PVC`}
          icon="fa-sack-dollar"
          tone="emerald"
        />
        <MetricCard
          label="Members"
          value={String(referrals.length)}
          hint="Direct joins"
          icon="fa-users"
          tone="cyan"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto min-w-0">
          <span className="text-xs text-blue-700 font-semibold">Referral Link</span>
          <p className="text-xs font-mono font-bold text-blue-600 mt-1 break-all">{refLink}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Sponsor: {formatAddress(user.referrerAddress)}
          </p>
        </div>
        <button
          type="button"
          onClick={copyRefLink}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center justify-center space-x-1.5 flex-shrink-0"
        >
          <i className="fa-solid fa-copy"></i>
          <span>Copy Link</span>
        </button>
      </div>

      <div className="bg-white overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse text-xs min-w-[640px]">
          <thead>
            <tr className="bg-emerald-50 text-emerald-900 font-bold uppercase tracking-wider text-[11px]">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Wallet</th>
              <th className="p-3">Joined</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {referrals.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No direct referrals yet. Share your referral link to invite members.
                </td>
              </tr>
            ) : (
              referrals.map((ref) => (
                <tr key={ref.address} className="hover:bg-emerald-50/40 transition">
                  <td className="p-3 font-semibold text-slate-800">{ref.name || "—"}</td>
                  <td className="p-3 text-slate-600 break-all">{ref.email || "—"}</td>
                  <td className="p-3 text-slate-600">{ref.mobile || "—"}</td>
                  <td className="p-3 font-mono text-slate-800" title={ref.address}>
                    <a
                      href={`https://testnet.bscscan.com/address/${ref.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formatAddress(ref.address, 6)}
                    </a>
                  </td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">{ref.date || "—"}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
