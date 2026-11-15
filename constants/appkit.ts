/** Production origin — must match Reown Dashboard allowed domains. */
export const PRODUCTION_APP_URL = "https://pearlvine-autopool.vercel.app";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : PRODUCTION_APP_URL);

export const APPKIT_METADATA = {
  name: "Pearlvine",
  description: "PVC referral rewards and AutoPool on BNB Smart Chain",
  url: APP_URL,
  icons: [`${APP_URL}/icons/app-logo.png`],
};
