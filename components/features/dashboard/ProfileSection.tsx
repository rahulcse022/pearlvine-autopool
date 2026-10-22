"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ProfileSection() {
  const { user } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Account Profile & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review your registered identity details and membership configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Full Name</span>
          <p className="font-bold text-slate-900 text-sm mt-1">{user.name}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Pearlvine Account No</span>
          <p className="font-mono font-bold text-slate-900 text-sm mt-1">
            {user.accountNo}
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Email Address</span>
          <p className="font-bold text-slate-900 text-sm mt-1">{user.email}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Mobile Number</span>
          <p className="font-bold text-slate-900 text-sm mt-1">{user.mobile}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Account Rank</span>
          <p className="font-bold text-blue-600 text-sm mt-1">{user.status}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 font-medium">Auto Pool Status</span>
          <p
            className={`font-bold text-sm mt-1 ${
              user.isPoolJoined ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {user.isPoolJoined ? "Active (3,000 PVC Joined)" : "Not Joined"}
          </p>
        </div>
      </div>
    </div>
  );
}
