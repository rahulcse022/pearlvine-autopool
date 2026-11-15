"use client";

import React, { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { bsc, type AppKitNetwork } from "@reown/appkit/networks";
import { ethersAdapter, featuredWalletIds, projectId } from "@/config";
import { APPKIT_METADATA } from "@/constants/appkit";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined");
}

/** BSC Mainnet only — other chains are unsupported. */
const appKitNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [bsc];

export const appKitModal = createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: appKitNetworks,
  defaultNetwork: bsc,
  metadata: APPKIT_METADATA,
  featuredWalletIds,
  themeMode: "light",
  allowUnsupportedChain: false,
  features: {
    analytics: false,
    email: false,
    socials: [],
    onramp: false,
    swaps: false,
  },
});

export default function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
