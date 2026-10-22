"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function Modal() {
  const { modal, closeModal } = usePearlvine();

  if (!modal.isOpen) return null;

  const iconClass =
    modal.type === "success"
      ? "fa-circle-check text-emerald-600 bg-emerald-100"
      : modal.type === "warning"
      ? "fa-triangle-exclamation text-amber-600 bg-amber-100"
      : "fa-circle-info text-blue-600 bg-blue-100";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 transform transition-all animate-in fade-in zoom-in duration-150 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto ${iconClass}`}
        >
          <i
            className={`fa-solid ${
              modal.type === "success"
                ? "fa-circle-check"
                : modal.type === "warning"
                ? "fa-triangle-exclamation"
                : "fa-circle-info"
            }`}
          ></i>
        </div>
        <h3 className="font-bold text-lg text-slate-900 tracking-tight">
          {modal.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">{modal.message}</p>
        <button
          type="button"
          onClick={closeModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow hover:shadow-md text-sm"
        >
          OK
        </button>
      </div>
    </div>
  );
}
