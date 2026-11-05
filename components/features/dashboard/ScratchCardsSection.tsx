"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ScratchCardsSection() {
  const { user, scratchCards, revealScratchCard, airdropPaused, toggleAirdrop } =
    usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Airdrop Mystery Boxes &amp; Bonus Rewards
            </h2>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              AIRDROP_REWARD = 500 PVC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click mystery boxes to unlock your smart contract airdrop allowances (500 PVC paid from admin reserve).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-purple-700 uppercase font-bold tracking-wider">
              Airdrop Earnings
            </span>
            <p className="text-lg font-black text-purple-800">
              {user.earnings.airdropEarnings.toLocaleString()} PVC
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleAirdrop(!airdropPaused)}
            className={`text-xs px-3 py-2 rounded-xl font-bold border transition ${
              airdropPaused
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            Airdrop: {airdropPaused ? "Paused (Click to Active)" : "Active (Click to Pause)"}
          </button>
        </div>
      </div>

      {/* Interactive Mystery Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        {scratchCards.map((card) => (
          <div
            key={card.id}
            onClick={() => revealScratchCard(card.id)}
            className={`scratch-card p-6 rounded-2xl text-white text-center shadow-lg space-y-3 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              card.isRevealed ? "revealed" : ""
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center">
              <i
                className={`fa-solid ${
                  card.isRevealed
                    ? "fa-circle-check text-3xl text-white"
                    : "fa-gift text-3xl animate-bounce"
                }`}
              ></i>
            </div>
            <h4 className="font-bold text-sm tracking-wide">
              {card.cardCode}
            </h4>
            <p className="text-xs text-blue-100 font-semibold">
              {card.isRevealed
                ? `Airdrop Credited: +${card.amount} PVC!`
                : "Click to Open 500 PVC Airdrop Box"}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <i className="fa-solid fa-circle-info text-blue-600"></i>
        <span>
          Contract clause: Joiner receives 500 PVC and Referrer receives 500 PVC out of the admin reserve when joining.
        </span>
      </div>
    </div>
  );
}
