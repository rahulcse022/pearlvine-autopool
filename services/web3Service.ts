// Web3 Service for BSC Testnet Integration & Digital Signature Verification
import { ethers } from "ethers";
import {
  CONTRACT_CONSTANTS,
  ERC20_ABI,
  PVC_REFERRAL_SYSTEM_ABI,
} from "@/constants/contractConfig";
import { DigitalSignature, UplineSlot, ContractEarnings } from "@/types";

export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
  send?: (method: string, params?: unknown[]) => Promise<unknown>;
  on?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Read-only JSON-RPC provider on BSC Testnet (always available even if wallet is disconnected)
export function getReadProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(CONTRACT_CONSTANTS.BSC_TESTNET.rpcUrls[0], {
    name: CONTRACT_CONSTANTS.BSC_TESTNET.chainName,
    chainId: CONTRACT_CONSTANTS.BSC_TESTNET.chainId,
  });
}

// Browser provider (MetaMask / TrustWallet / Rabby)
export function getBrowserProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
  }
  return null;
}

// Helper to switch or add BSC Testnet to user's wallet
export async function switchToBscTestnet(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Web3 wallet extension found. Please install MetaMask or Trust Wallet.");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CONTRACT_CONSTANTS.BSC_TESTNET.chainIdHex }],
    });
    return true;
  } catch (switchError: unknown) {
    const err = switchError as { code?: number; data?: { originalError?: { code?: number } } };
    // Error code 4902 indicates that the chain has not been added to MetaMask
    if (err?.code === 4902 || err?.data?.originalError?.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: CONTRACT_CONSTANTS.BSC_TESTNET.chainIdHex,
              chainName: CONTRACT_CONSTANTS.BSC_TESTNET.chainName,
              nativeCurrency: CONTRACT_CONSTANTS.BSC_TESTNET.nativeCurrency,
              rpcUrls: CONTRACT_CONSTANTS.BSC_TESTNET.rpcUrls,
              blockExplorerUrls: CONTRACT_CONSTANTS.BSC_TESTNET.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add BSC Testnet:", addError);
        throw addError;
      }
    }
    console.error("Failed to switch to BSC Testnet:", switchError);
    throw switchError;
  }
}

// Generate authentication challenge for Digital Signature Verification
export function createAuthChallenge(address: string): { message: string; timestamp: number } {
  const timestamp = Date.now();
  const message = [
    "=== Pearlvine PVC Referral System Authentication ===",
    "",
    "Please digitally sign this message to verify your wallet ownership and authenticate securely without a password.",
    "",
    `Signer Address: ${ethers.getAddress(address)}`,
    `Network: BNB Smart Chain Testnet (Chain ID: ${CONTRACT_CONSTANTS.BSC_TESTNET.chainId})`,
    `Contract: ${CONTRACT_CONSTANTS.CONTRACT_ADDRESS}`,
    `Token: ${CONTRACT_CONSTANTS.TOKEN_CONTRACT_ADDRESS}`,
    `Timestamp: ${new Date(timestamp).toISOString()}`,
    `Security Nonce: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    "",
    "Note: Signing this message does NOT cost any gas fee and does not trigger any blockchain transaction.",
  ].join("\n");

  return { message, timestamp };
}

// Sign message with connected Web3 wallet
export async function signAuthChallenge(
  signer: ethers.Signer,
  message: string,
  timestamp: number
): Promise<DigitalSignature> {
  const signerAddress = await signer.getAddress();
  const signature = await signer.signMessage(message);

  // Verify the signature immediately
  const recoveredAddress = ethers.verifyMessage(message, signature);
  const isValid = recoveredAddress.toLowerCase() === signerAddress.toLowerCase();

  if (!isValid) {
    throw new Error("Digital signature verification failed: Signer mismatch.");
  }

  return {
    message,
    signature,
    timestamp,
    signerAddress,
    isValid,
  };
}

// Verify an existing signature
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

// Fetch complete live on-chain state for a given wallet address from BSC Testnet
export async function fetchLiveBlockchainState(userAddress: string) {
  const provider = getReadProvider();
  const cleanAddress = ethers.getAddress(userAddress);

  const tokenContract = new ethers.Contract(
    CONTRACT_CONSTANTS.TOKEN_CONTRACT_ADDRESS,
    ERC20_ABI,
    provider
  );

  const referralContract = new ethers.Contract(
    CONTRACT_CONSTANTS.CONTRACT_ADDRESS,
    PVC_REFERRAL_SYSTEM_ABI,
    provider
  );

  // Parallel requests to BSC Testnet
  const [
    balanceRaw,
    allowanceRaw,
    hasJoined,
    userInfo,
    uplinesRaw,
    earningRaw,
    airdropPaused,
  ] = await Promise.all([
    tokenContract.balanceOf(cleanAddress).catch(() => BigInt(0)),
    tokenContract.allowance(cleanAddress, CONTRACT_CONSTANTS.CONTRACT_ADDRESS).catch(() => BigInt(0)),
    referralContract.hasJoined(cleanAddress).catch(() => false),
    referralContract.getUserInfo(cleanAddress).catch(() => ({ referrer: ethers.ZeroAddress, joined: false, root: false })),
    referralContract.getUserUpline(cleanAddress).catch(() => Array(10).fill(ethers.ZeroAddress)),
    referralContract.earning(cleanAddress).catch(() => [BigInt(0), BigInt(0), BigInt(0), BigInt(0)]),
    referralContract.airdropPaused().catch(() => false),
  ]);

  const pvcBalance = Number(ethers.formatUnits(balanceRaw, 18));
  const allowance = Number(ethers.formatUnits(allowanceRaw, 18));

  const earnings: ContractEarnings = {
    directEarnings: Number(ethers.formatUnits(earningRaw[0] || BigInt(0), 18)),
    levelEarnings: Number(ethers.formatUnits(earningRaw[1] || BigInt(0), 18)),
    airdropEarnings: Number(ethers.formatUnits(earningRaw[2] || BigInt(0), 18)),
    pendingAirdropEarning: Number(ethers.formatUnits(earningRaw[3] || BigInt(0), 18)),
  };

  const uplines: UplineSlot[] = (uplinesRaw as string[]).map((addr, index) => {
    const isRoot = !addr || addr === ethers.ZeroAddress || addr.toLowerCase() === CONTRACT_CONSTANTS.ROOT_ADDRESS.toLowerCase();
    return {
      level: index + 1,
      address: isRoot ? CONTRACT_CONSTANTS.ROOT_ADDRESS : addr,
      amount: CONTRACT_CONSTANTS.LEVEL_REWARD,
      isPaid: !isRoot,
      status: isRoot ? "Empty / Root Reserve" : "Active",
    };
  });

  return {
    pvcBalance,
    allowance,
    hasJoined: Boolean(hasJoined || userInfo.joined),
    referrerAddress: userInfo.referrer === ethers.ZeroAddress ? CONTRACT_CONSTANTS.ROOT_ADDRESS : userInfo.referrer,
    isRoot: Boolean(userInfo.root),
    earnings,
    uplines,
    airdropPaused: Boolean(airdropPaused),
  };
}

// Execute ERC-20 Approve on BSC Testnet
export async function executeApprovePvcToken(
  signer: ethers.Signer,
  amountPVC: number = CONTRACT_CONSTANTS.JOIN_AMOUNT
): Promise<string> {
  const tokenContract = new ethers.Contract(
    CONTRACT_CONSTANTS.TOKEN_CONTRACT_ADDRESS,
    ERC20_ABI,
    signer
  );

  const amountWei = ethers.parseUnits(amountPVC.toString(), 18);
  const tx = await tokenContract.approve(CONTRACT_CONSTANTS.CONTRACT_ADDRESS, amountWei);
  const receipt = await tx.wait(1);
  return receipt.hash;
}

// Execute join(referrer) on BSC Testnet
export async function executeJoinAutoPool(
  signer: ethers.Signer,
  referrerAddress: string
): Promise<string> {
  const referralContract = new ethers.Contract(
    CONTRACT_CONSTANTS.CONTRACT_ADDRESS,
    PVC_REFERRAL_SYSTEM_ABI,
    signer
  );

  const cleanReferrer = ethers.isAddress(referrerAddress)
    ? ethers.getAddress(referrerAddress)
    : CONTRACT_CONSTANTS.ROOT_ADDRESS;

  const tx = await referralContract.join(cleanReferrer);
  const receipt = await tx.wait(1);
  return receipt.hash;
}

// Admin function: toggleAirdrop on BSC Testnet
export async function executeToggleAirdrop(
  signer: ethers.Signer,
  status: boolean
): Promise<string> {
  const referralContract = new ethers.Contract(
    CONTRACT_CONSTANTS.CONTRACT_ADDRESS,
    PVC_REFERRAL_SYSTEM_ABI,
    signer
  );

  const tx = await referralContract.toggleAirdrop(status);
  const receipt = await tx.wait(1);
  return receipt.hash;
}
