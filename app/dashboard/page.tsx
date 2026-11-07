"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import DashboardScreen from "@/components/features/dashboard/DashboardScreen";

export default function DashboardPage() {
  const { isWeb3Connected } = usePearlvine();

  if (!isWeb3Connected) {
    return null;
  }

  return <DashboardScreen />;
}
