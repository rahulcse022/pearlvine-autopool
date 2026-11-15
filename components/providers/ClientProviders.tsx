"use client";

import { type ReactNode } from "react";
import AppKitProvider from "@/context/AppKitProvider";
import { PearlvineProvider } from "@/context/PearlvineContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AppKitProvider>
      <PearlvineProvider>{children}</PearlvineProvider>
    </AppKitProvider>
  );
}
