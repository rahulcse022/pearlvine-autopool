import { ethers } from "ethers";
import {
  CONTRACT_CONSTANTS,
  ERC20_ABI,
  PVC_REFERRAL_SYSTEM_ABI,
} from "@/constants/contractConfig";
import { DEFAULT_TOKEN_CONFIG } from "@/constants/mockData";
import {
  DigitalSignature,
  UplineSlot,
  ContractEarnings,
  UserProfile,
  TokenConfig,
  AutoPoolStatus,
  ReferralItem,
  LevelRewardItem,
  LevelStat,
} from "@/types";

const JOIN_FIELD_MAX_LENGTH = 128;
const DECIMALS = CONTRACT_CONSTANTS.TOKEN_DECIMALS;
const PAGE_LIMIT = 100;

export function resolveSponsorAddress(sponsor?: string): string {
  const trimmed = sponsor?.trim() ?? "";
  if (trimmed && ethers.isAddress(trimmed)) {
    return ethers.getAddress(trimmed);
  }
  return CONTRACT_CONSTANTS.ROOT_ADDRESS;
}

function sanitizeJoinField(value: string, fallback = ""): string {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, JOIN_FIELD_MAX_LENGTH);
}

function toPvc(value: bigint | number | string | undefined): number {
  try {
    return Number(ethers.formatUnits(value ?? 0, DECIMALS));
  } catch {
    return Number(value ?? 0);
  }
}

function formatJoinedAt(joinedAt: bigint | number | string | undefined): string {
  const seconds = Number(joinedAt ?? 0);
  if (!seconds) return "";
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

export interface EthereumProvider {
  request: (args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<unknown>;
  send?: (method: string, params?: unknown[]) => Promise<unknown>;
  on?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const BSC_NETWORK = ethers.Network.from(CONTRACT_CONSTANTS.BSC_MAINNET.chainId);

function createRpcProvider(rpcUrl: string): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(rpcUrl, BSC_NETWORK, {
    staticNetwork: BSC_NETWORK,
  });
}

/** Public RPC reader with fallbacks (used when wallet is not available). */
export function getReadProvider(): ethers.AbstractProvider {
  const urls = CONTRACT_CONSTANTS.BSC_MAINNET.rpcUrls;
  if (urls.length === 1) {
    return createRpcProvider(urls[0]);
  }

  return new ethers.FallbackProvider(
    urls.map((url, index) => ({
      provider: createRpcProvider(url),
      priority: index + 1,
      stallTimeout: 2_500,
      weight: 1,
    })),
    BSC_NETWORK
  );
}

export function getBrowserProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
  }
  return null;
}

/**
 * Prefer MetaMask/browser provider so balances match the wallet UI.
 * Falls back to public RPCs when wallet is not connected.
 */
export function getPreferredProvider(): ethers.ContractRunner {
  return getBrowserProvider() ?? getReadProvider();
}

export async function switchToBscMainnet(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Web3 wallet found. Please install MetaMask.");
  }

  const network = CONTRACT_CONSTANTS.BSC_MAINNET;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainIdHex }],
    });
    return true;
  } catch (switchError: unknown) {
    const err = switchError as { code?: number; data?: { originalError?: { code?: number } } };
    if (err?.code === 4902 || err?.data?.originalError?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: network.chainIdHex,
            chainName: network.chainName,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: [...network.rpcUrls],
            blockExplorerUrls: [...network.blockExplorerUrls],
          },
        ],
      });
      return true;
    }
    throw switchError;
  }
}

export function createAuthChallenge(address: string): { message: string; timestamp: number } {
  const timestamp = Date.now();
  const message = [
    "Pearlvine PVC Authentication",
    "",
    `Wallet: ${ethers.getAddress(address)}`,
    `Contract: ${CONTRACT_CONSTANTS.CONTRACT_ADDRESS}`,
    `Time: ${new Date(timestamp).toISOString()}`,
    "",
    "Signing this message does not cost gas.",
  ].join("\n");
  return { message, timestamp };
}

export async function signAuthChallenge(
  signer: ethers.Signer,
  message: string,
  timestamp: number
): Promise<DigitalSignature> {
  const signerAddress = await signer.getAddress();
  const signature = await signer.signMessage(message);
  const recoveredAddress = ethers.verifyMessage(message, signature);
  const isValid = recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
  if (!isValid) {
    throw new Error("Signature verification failed.");
  }
  return { message, signature, timestamp, signerAddress, isValid };
}

function getReferralContract(runner: ethers.ContractRunner) {
  return new ethers.Contract(
    CONTRACT_CONSTANTS.CONTRACT_ADDRESS,
    PVC_REFERRAL_SYSTEM_ABI,
    runner
  );
}

function getTokenContract(
  runner: ethers.ContractRunner,
  tokenAddress: string = CONTRACT_CONSTANTS.TOKEN_CONTRACT_ADDRESS
) {
  return new ethers.Contract(tokenAddress, ERC20_ABI, runner);
}

async function resolvePvcTokenAddress(
  runner: ethers.ContractRunner
): Promise<string> {
  try {
    const onChain = (await getReferralContract(runner).pvcToken()) as string;
    if (ethers.isAddress(onChain) && onChain !== ethers.ZeroAddress) {
      return ethers.getAddress(onChain);
    }
  } catch {
    // fall through to configured token address
  }
  return ethers.getAddress(CONTRACT_CONSTANTS.TOKEN_CONTRACT_ADDRESS);
}

export async function fetchTokenConfiguration(): Promise<TokenConfig> {
  try {
    const contract = getReferralContract(getPreferredProvider());
    const config = await contract.getTokenConfiguration();
    return {
      joinAmount: toPvc(config.joinAmount),
      adminReward: toPvc(config.adminReward),
      directReward: toPvc(config.directReward),
      levelShare: toPvc(config.levelShare),
      levelReward: toPvc(config.levelReward),
      maxLevels: Number(config.maxLevels),
      autoPoolContribution: toPvc(config.autoPoolContribution),
      autoPoolTarget: toPvc(config.autoPoolTarget),
    };
  } catch {
    return DEFAULT_TOKEN_CONFIG;
  }
}

type MemberDetailsRaw = {
  wallet: string;
  fullName: string;
  email: string;
  mobile: string;
  joinedAt: bigint;
  joined: boolean;
};

function mapMember(raw: MemberDetailsRaw) {
  return {
    address: ethers.getAddress(raw.wallet),
    name: raw.fullName || "",
    email: raw.email || "",
    mobile: raw.mobile || "",
    date: formatJoinedAt(raw.joinedAt),
    status: (raw.joined ? "Joined" : "Active") as "Joined" | "Active",
  };
}

export async function fetchDirectReferrals(sponsorAddress: string): Promise<ReferralItem[]> {
  try {
    const contract = getReferralContract(getPreferredProvider());
    const sponsor = ethers.getAddress(sponsorAddress);
    const rows = (await contract.getDirectReferrals(sponsor, 0, PAGE_LIMIT)) as MemberDetailsRaw[];
    return rows.map(mapMember).reverse();
  } catch {
    return [];
  }
}

async function fetchMemberProfile(
  contract: ethers.Contract,
  address: string
): Promise<{ name: string; email: string; mobile: string }> {
  if (address.toLowerCase() === CONTRACT_CONSTANTS.CONTRACT_ADDRESS.toLowerCase()) {
    return { name: "Root Contract", email: "", mobile: "" };
  }
  try {
    const info = await contract.userInfo(address);
    return {
      name: info.fullName || "",
      email: info.email || "",
      mobile: info.mobile || "",
    };
  } catch {
    return { name: "", email: "", mobile: "" };
  }
}

export async function fetchUserPublicProfile(address: string): Promise<{
  address: string;
  name: string;
  email: string;
  mobile: string;
  hasJoined: boolean;
} | null> {
  if (!ethers.isAddress(address)) return null;

  const clean = ethers.getAddress(address);
  const contract = getReferralContract(getPreferredProvider());
  const [profile, hasJoined] = await Promise.all([
    fetchMemberProfile(contract, clean),
    contract.hasJoined(clean).catch(() => false),
  ]);

  return {
    address: clean,
    name: profile.name,
    email: profile.email,
    mobile: profile.mobile,
    hasJoined: Boolean(hasJoined),
  };
}

export async function enrichUplineSlots(
  addresses: string[],
  levelReward: number
): Promise<UplineSlot[]> {
  const contract = getReferralContract(getPreferredProvider());
  return Promise.all(
    Array.from({ length: CONTRACT_CONSTANTS.MAX_LEVELS }, async (_, index) => {
      const raw = addresses[index];
      const empty = !raw || raw === ethers.ZeroAddress;
      if (empty) {
        return {
          level: index + 1,
          address: "",
          name: "",
          email: "",
          mobile: "",
          amount: levelReward,
          isPaid: false,
        };
      }
      const address = ethers.getAddress(raw);
      const profile = await fetchMemberProfile(contract, address);
      return {
        level: index + 1,
        address,
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        amount: levelReward,
        isPaid: true,
      };
    })
  );
}

export async function fetchLevelBoard(userAddress: string): Promise<{
  levelStats: LevelStat[];
  levelRewards: LevelRewardItem[];
}> {
  const contract = getReferralContract(getPreferredProvider());
  const user = ethers.getAddress(userAddress);
  const emptyStats: LevelStat[] = Array.from(
    { length: CONTRACT_CONSTANTS.MAX_LEVELS },
    (_, i) => ({ level: i + 1, income: 0, joinings: 0 })
  );

  try {
    const summary = await contract.getLevelSummary(user);
    const earnings = summary.earnings ?? summary[0];
    const counts = summary.memberCounts ?? summary[1];

    const levelStats: LevelStat[] = Array.from(
      { length: CONTRACT_CONSTANTS.MAX_LEVELS },
      (_, i) => ({
        level: i + 1,
        income: toPvc(earnings[i]),
        joinings: Number(counts[i] ?? 0),
      })
    );

    const levelReward = CONTRACT_CONSTANTS.LEVEL_REWARD;
    const memberBatches = await Promise.all(
      levelStats
        .filter((stat) => stat.joinings > 0)
        .map(async (stat) => {
          const rows = (await contract.getLevelMembers(
            user,
            stat.level,
            0,
            PAGE_LIMIT
          )) as MemberDetailsRaw[];
          return rows.map((row) => {
            const member = mapMember(row);
            return {
              level: stat.level,
              address: member.address,
              name: member.name,
              email: member.email,
              mobile: member.mobile,
              amount: levelReward,
              date: member.date,
              status: "Joined" as const,
            };
          });
        })
    );

    return {
      levelStats,
      levelRewards: memberBatches.flat().reverse(),
    };
  } catch {
    return { levelStats: emptyStats, levelRewards: [] };
  }
}

export async function fetchLiveBlockchainState(userAddress: string) {
  const provider = getPreferredProvider();
  const cleanAddress = ethers.getAddress(userAddress);
  const referralContract = getReferralContract(provider);
  const pvcTokenAddress = await resolvePvcTokenAddress(provider);
  const tokenContract = getTokenContract(provider, pvcTokenAddress);

  const [
    balanceRaw,
    allowanceRaw,
    hasJoined,
    referrerOfRaw,
    isRoot,
    userInfo,
    earningsRaw,
    uplinesRaw,
    autoPoolStatusRaw,
    currentRecipient,
    queueLength,
    totalJoined,
    tokenConfig,
  ] = await Promise.all([
    tokenContract.balanceOf(cleanAddress).catch((err: unknown) => {
      console.warn("PVC balanceOf failed:", err);
      return BigInt(0);
    }),
    tokenContract
      .allowance(cleanAddress, CONTRACT_CONSTANTS.CONTRACT_ADDRESS)
      .catch(() => BigInt(0)),
    referralContract.hasJoined(cleanAddress).catch(() => false),
    referralContract.referrerOf(cleanAddress).catch(() => ethers.ZeroAddress),
    referralContract.isRoot(cleanAddress).catch(() => false),
    referralContract.userInfo(cleanAddress).catch(() => ({
      fullName: "",
      email: "",
      mobile: "",
      sponsor: ethers.ZeroAddress,
      joined: false,
      joinedAt: BigInt(0),
    })),
    referralContract
      .getUserEarnings(cleanAddress)
      .catch(() => [BigInt(0), BigInt(0), BigInt(0)]),
    referralContract.getUserUpline(cleanAddress).catch(() => Array(10).fill(ethers.ZeroAddress)),
    referralContract
      .getAutoPoolStatus(cleanAddress)
      .catch(() => [
        BigInt(0),
        ethers.parseUnits(String(CONTRACT_CONSTANTS.AUTOPOOL_TARGET), DECIMALS),
        false,
      ]),
    referralContract.getCurrentAutoPoolRecipient().catch(() => ethers.ZeroAddress),
    referralContract.getAutoPoolQueueLength().catch(() => BigInt(0)),
    referralContract.totalJoined().catch(() => BigInt(0)),
    fetchTokenConfiguration(),
  ]);

  const earnings: ContractEarnings = {
    directEarnings: toPvc(earningsRaw[0]),
    levelEarnings: toPvc(earningsRaw[1]),
    autoPoolEarnings: toPvc(earningsRaw[2]),
  };

  const earned = toPvc(autoPoolStatusRaw[0]);
  const target = toPvc(autoPoolStatusRaw[1]) || tokenConfig.autoPoolTarget;
  const currentRecipientAddress =
    !currentRecipient || currentRecipient === ethers.ZeroAddress
      ? ""
      : ethers.getAddress(currentRecipient);

  const referrerAddress = resolveSponsorAddress(
    userInfo.sponsor && userInfo.sponsor !== ethers.ZeroAddress
      ? userInfo.sponsor
      : referrerOfRaw
  );

  const emptyUserInfo = {
    fullName: "",
    email: "",
    mobile: "",
    sponsor: ethers.ZeroAddress,
    joined: false,
    joinedAt: BigInt(0),
  };

  const [uplines, referrals, levelBoard, sponsorInfo, recipientInfo, recipientStatusRaw] =
    await Promise.all([
      enrichUplineSlots(uplinesRaw as string[], tokenConfig.levelReward),
      hasJoined ? fetchDirectReferrals(cleanAddress) : Promise.resolve([]),
      hasJoined
        ? fetchLevelBoard(cleanAddress)
        : Promise.resolve({
            levelStats: Array.from({ length: CONTRACT_CONSTANTS.MAX_LEVELS }, (_, i) => ({
              level: i + 1,
              income: 0,
              joinings: 0,
            })),
            levelRewards: [],
          }),
      referralContract.userInfo(referrerAddress).catch(() => emptyUserInfo),
      currentRecipientAddress
        ? referralContract.userInfo(currentRecipientAddress).catch(() => emptyUserInfo)
        : Promise.resolve(emptyUserInfo),
      currentRecipientAddress
        ? referralContract
            .getAutoPoolStatus(currentRecipientAddress)
            .catch(() => [
              BigInt(0),
              ethers.parseUnits(String(tokenConfig.autoPoolTarget), DECIMALS),
              false,
            ])
        : Promise.resolve([
            BigInt(0),
            ethers.parseUnits(String(tokenConfig.autoPoolTarget), DECIMALS),
            false,
          ]),
    ]);

  const currentRecipientEarned = toPvc(recipientStatusRaw[0]);
  const currentRecipientTarget =
    toPvc(recipientStatusRaw[1]) || tokenConfig.autoPoolTarget;

  const autoPool: AutoPoolStatus = {
    earned,
    target,
    remaining: Math.max(0, target - earned),
    completed: Boolean(autoPoolStatusRaw[2]),
    currentRecipient: currentRecipientAddress,
    currentRecipientName: recipientInfo.fullName || "",
    currentRecipientEarned,
    currentRecipientTarget,
    queueLength: Number(queueLength),
  };

  return {
    pvcBalance: toPvc(balanceRaw),
    allowance: toPvc(allowanceRaw),
    hasJoined: Boolean(hasJoined),
    referrerAddress,
    referrerName: sponsorInfo.fullName || "",
    isRoot: Boolean(isRoot),
    name: userInfo.fullName || "",
    email: userInfo.email || "",
    mobile: userInfo.mobile || "",
    earnings,
    uplines,
    levelStats: levelBoard.levelStats,
    levelRewards: levelBoard.levelRewards,
    autoPool,
    totalJoined: Number(totalJoined),
    tokenConfig,
    referrals,
  };
}

export async function executeApprovePvcToken(
  signer: ethers.Signer,
  amountPVC: number
): Promise<string> {
  const pvcTokenAddress = await resolvePvcTokenAddress(signer);
  const tokenContract = getTokenContract(signer, pvcTokenAddress);
  const amountWei = ethers.parseUnits(amountPVC.toString(), DECIMALS);
  const tx = await tokenContract.approve(CONTRACT_CONSTANTS.CONTRACT_ADDRESS, amountWei);
  const receipt = await tx.wait(1);
  return receipt.hash;
}

export async function executeJoinAutoPool(
  signer: ethers.Signer,
  profile: Pick<UserProfile, "name" | "email" | "mobile" | "referrerAddress">
): Promise<string> {
  const referralContract = getReferralContract(signer);
  const signerAddress = await signer.getAddress();
  const sponsor = resolveSponsorAddress(profile.referrerAddress);

  if (sponsor.toLowerCase() === signerAddress.toLowerCase()) {
    throw new Error("Sponsor cannot be your own wallet.");
  }

  const isValidSponsor = await referralContract.hasJoined(sponsor).catch(() => false);
  if (!isValidSponsor) {
    throw new Error("Sponsor has not joined the system.");
  }

  const tx = await referralContract.join({
    fullName: sanitizeJoinField(profile.name, "Member"),
    email: sanitizeJoinField(profile.email),
    mobile: sanitizeJoinField(profile.mobile),
    sponsor,
  });
  const receipt = await tx.wait(1);
  return receipt.hash;
}
