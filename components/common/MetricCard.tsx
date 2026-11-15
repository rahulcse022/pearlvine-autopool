import Image from "next/image";

type MetricTone = "slate" | "emerald" | "amber" | "blue" | "cyan";

const PVC_LOGO_SRC = "/icons/pvc-logo.jpeg";

const TONE_STYLES: Record<
  MetricTone,
  { wrap: string; label: string; value: string; icon: string }
> = {
  slate: {
    wrap: "from-slate-50 to-blue-50 border-slate-200 text-slate-900",
    label: "text-slate-500",
    value: "text-slate-900",
    icon: "bg-blue-100 text-blue-600",
  },
  emerald: {
    wrap: "from-emerald-50 to-teal-50 border-emerald-200 text-slate-900",
    label: "text-emerald-700",
    value: "text-emerald-900",
    icon: "bg-emerald-100 text-emerald-600",
  },
  amber: {
    wrap: "from-amber-50 to-orange-50 border-amber-200 text-slate-900",
    label: "text-amber-700",
    value: "text-amber-900",
    icon: "bg-amber-100 text-amber-600",
  },
  blue: {
    wrap: "from-blue-50 to-indigo-50 border-blue-200 text-slate-900",
    label: "text-blue-700",
    value: "text-blue-900",
    icon: "bg-blue-100 text-blue-600",
  },
  cyan: {
    wrap: "from-cyan-50 to-sky-50 border-cyan-200 text-slate-900",
    label: "text-cyan-700",
    value: "text-cyan-900",
    icon: "bg-cyan-100 text-cyan-600",
  },
};

function mentionsPvc(...parts: Array<string | undefined>): boolean {
  return parts.some((part) => Boolean(part && /\bpvc\b/i.test(part)));
}

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
  const usePvcLogo = mentionsPvc(label, value, hint);

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-3.5 sm:p-4 shadow-sm ${styles.wrap}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[10px] uppercase tracking-wider font-bold ${styles.label}`}>
          {label}
        </p>
        {usePvcLogo || icon ? (
          <span
            className={`inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-xs ${
              usePvcLogo ? "bg-transparent p-0" : styles.icon
            }`}
          >
            {usePvcLogo ? (
              <Image
                src={PVC_LOGO_SRC}
                alt="PVC"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <i className={`fa-solid ${icon}`}></i>
            )}
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
