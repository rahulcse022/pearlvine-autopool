"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);
  const [isIosHint, setIsIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

    if (isStandalone) return;

    const dismissed = window.sessionStorage.getItem("pearlvine_install_dismissed");
    if (dismissed === "1") return;

    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);

    if (isIos && isSafari) {
      setIsIosHint(true);
      setHidden(false);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setHidden(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (hidden) return null;

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setHidden(true);
  };

  const dismiss = () => {
    window.sessionStorage.setItem("pearlvine_install_dismissed", "1");
    setHidden(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <i className="fa-solid fa-mobile-screen-button"></i>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">Install Pearlvine App</p>
          <p className="text-[11px] text-slate-500">
            {isIosHint
              ? "Share → Add to Home Screen"
              : "Install for a full-screen mobile app experience"}
          </p>
        </div>
        {deferred && (
          <button
            type="button"
            onClick={() => void install()}
            className="shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white"
          >
            Install
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 p-2 text-slate-400 hover:text-slate-600"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}
