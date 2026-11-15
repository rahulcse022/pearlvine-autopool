import { CONTRACT_CONSTANTS } from "@/constants/contractConfig";

/** BSC mainnet BscScan address URL */
export function getBscAddressUrl(address: string): string {
  if (!address) return "";
  return `${CONTRACT_CONSTANTS.BSC_MAINNET.blockExplorerUrls[0]}/address/${address}`;
}
