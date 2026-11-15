import { ethers } from "ethers";
import { DigitalSignature } from "@/types";

const AUTH_SESSION_KEY = "pearlvine_auth_session_v1";

export interface AuthSession {
  walletAddress: string;
  signature?: DigitalSignature;
  savedAt: number;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadAuthSession(): AuthSession | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.walletAddress || !ethers.isAddress(parsed.walletAddress)) {
      clearAuthSession();
      return null;
    }

    return {
      walletAddress: ethers.getAddress(parsed.walletAddress),
      signature: parsed.signature,
      savedAt: Number(parsed.savedAt) || Date.now(),
    };
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(
  walletAddress: string,
  signature?: DigitalSignature
): void {
  if (!canUseStorage() || !ethers.isAddress(walletAddress)) return;

  const session: AuthSession = {
    walletAddress: ethers.getAddress(walletAddress),
    signature,
    savedAt: Date.now(),
  };

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
