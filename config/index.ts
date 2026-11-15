import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { bsc, type AppKitNetwork } from "@reown/appkit/networks";

/** Get your own ID at https://dashboard.reown.com — localhost fallback is public demo only. */
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined");
}

/** BSC Mainnet only. */
export const networks = [bsc] as [AppKitNetwork, ...AppKitNetwork[]];

export const ethersAdapter = new EthersAdapter();

/** Feature Bitget, MetaMask, Trust, SafePal in the connect modal. */
export const featuredWalletIds = [
  "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
  "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", // SafePal
];
