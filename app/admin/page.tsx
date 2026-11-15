"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import AdminPanel from "@/components/features/admin/AdminPanel";

export default function AdminPage() {
  const { isWeb3Connected, isAdmin } = usePearlvine();

  if (!isWeb3Connected || !isAdmin) {
    return null;
  }

  return <AdminPanel />;
}
