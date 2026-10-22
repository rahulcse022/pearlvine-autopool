"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function NotificationsSection() {
  const { notifications } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl flex items-start space-x-3 border ${
              n.type === "success"
                ? "bg-emerald-50 border-emerald-100"
                : "bg-blue-50 border-blue-100"
            }`}
          >
            <i
              className={`fa-solid ${
                n.type === "success"
                  ? "fa-circle-check text-emerald-600"
                  : "fa-circle-info text-blue-600"
              } text-lg mt-0.5`}
            ></i>
            <div className="flex-grow">
              <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {n.message}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                {n.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
