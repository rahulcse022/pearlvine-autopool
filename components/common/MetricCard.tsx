type MetricTone = "slate" | "emerald" | "amber" | "blue" | "cyan";

const TONE_STYLES: Record<
  MetricTone,
  { wrap: string; label: string; value: string; icon: string }
> = {
  slate: {
    wrap: "from-slate-900 to-blue-950 border-slate-800 text-white",
    label: "text-cyan-300",
    value: "text-white",
    icon: "bg-cyan-500/20 text-cyan-300",
  },
  emerald: {
    wrap: "from-emerald-600 to-teal-800 border-emerald-500/30 text-white",
    label: "text-emerald-100",
    value: "text-white",
    icon: "bg-white/15 text-emerald-100",
  },
  amber: {
    wrap: "from-amber-500 to-orange-700 border-amber-400/30 text-white",
    label: "text-amber-100",
    value: "text-white",
    icon: "bg-white/15 text-amber-100",
  },
  blue: {
    wrap: "from-blue-600 to-indigo-800 border-blue-400/30 text-white",
    label: "text-blue-100",
    value: "text-white",
    icon: "bg-white/15 text-blue-100",
  },
  cyan: {
    wrap: "from-cyan-600 to-sky-800 border-cyan-400/30 text-white",
    label: "text-cyan-100",
    value: "text-white",
    icon: "bg-white/15 text-cyan-100",
  },
};

export default function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: string;
  tone?: MetricTone;
}) {
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-3.5 sm:p-4 shadow-sm ${styles.wrap}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[10px] uppercase tracking-wider font-bold ${styles.label}`}>
          {label}
        </p>
        {icon ? (
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs ${styles.icon}`}
          >
            <i className={`fa-solid ${icon}`}></i>
          </span>
        ) : null}
      </div>
      <p className={`mt-2 text-xl sm:text-2xl font-black tracking-tight ${styles.value}`}>
        {value}
      </p>
      {hint ? <p className={`mt-1 text-[10px] opacity-80 ${styles.label}`}>{hint}</p> : null}
    </div>
  );
}
