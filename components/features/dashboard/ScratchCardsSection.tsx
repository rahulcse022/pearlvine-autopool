"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";

export default function ScratchCardsSection() {
  const { user, scratchCards, revealScratchCard } = usePearlvine();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Scratch Card Rewards</h2>
          <p className="text-xs text-slate-500 mt-1">
            Click or scratch cards earned from joining and referrals to reveal 1-20 PVC rewards.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
          <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">
            Reward Balance
          </span>
          <p className="text-lg font-extrabold text-emerald-800">
            {user.scratchBalance} PVC
          </p>
        </div>
      </div>

      {/* Interactive Scratch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        {scratchCards.map((card) => (
          <div
            key={card.id}
            onClick={() => revealScratchCard(card.id)}
            className={`scratch-card p-6 rounded-2xl text-white text-center shadow-lg space-y-3 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              card.isRevealed ? "revealed" : ""
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center">
              <i
                className={`fa-solid ${
                  card.isRevealed
                    ? "fa-circle-check text-2xl text-white"
                    : "fa-gift text-2xl animate-bounce"
                }`}
              ></i>
            </div>
            <h4 className="font-bold text-sm tracking-wide">
              Card #{card.cardCode}
            </h4>
            <p className="text-xs text-blue-100 font-semibold">
              {card.isRevealed
                ? `Reward Unlocked: +${card.amount} PVC!`
                : "Click to Scratch & Reveal"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
