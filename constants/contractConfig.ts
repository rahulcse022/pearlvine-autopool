export const CONTRACT_CONSTANTS = {
  TOKEN_SYMBOL: "PVC",
  TOKEN_DECIMALS: 18,

  TOKEN_CONTRACT_ADDRESS: "0xb2d59dCE908907e94A4d3C911402131968B87777",
  CONTRACT_ADDRESS: "0xa7cAC7c3391eea396b15609a2407C66AbCD12459",
  ROOT_ADDRESS: "0xa7cAC7c3391eea396b15609a2407C66AbCD12459",

  BSC_MAINNET: {
    chainId: 56,
    chainIdHex: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.bnbchain.org/",
      "https://bsc-dataseed2.bnbchain.org/",
      "https://bsc-dataseed3.defibit.io/",
      "https://bsc-dataseed4.ninicoin.io/",
      "https://bsc.publicnode.com",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
  },

  // Production amounts (fallback until getTokenConfiguration loads)
  JOIN_AMOUNT: 500_000,
  ADMIN_REWARD: 100_000,
  DIRECT_REWARD: 100_000,
  LEVEL_SHARE: 100_000,
  LEVEL_REWARD: 10_000,
  MAX_LEVELS: 10,
  AUTOPOOL_CONTRIBUTION: 200_000,
  AUTOPOOL_TARGET: 800_000,
} as const;

export const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const MEMBER_DETAILS =
  "tuple(address wallet, string fullName, string email, string mobile, uint256 joinedAt, bool joined)";

export const PVC_REFERRAL_SYSTEM_ABI = [
  "function pvcToken() view returns (address)",
  "function referrerOf(address user) view returns (address)",
  "function owner() view returns (address)",
  "function adminReserve() view returns (uint256)",
  "function totalJoined() view returns (uint256)",
  "function autoPoolQueueHead() view returns (uint256)",
  "function autoPoolCompleted(address user) view returns (bool)",
  "function hasJoined(address user) view returns (bool)",
  "function isRoot(address user) view returns (bool)",
  "function userInfo(address user) view returns (string fullName, string email, string mobile, address sponsor, bool joined, uint256 joinedAt)",
  "function earning(address user) view returns (uint256 directEarnings, uint256 levelEarnings, uint256 autoPoolEarnings)",
  "function getUserEarnings(address user) view returns (uint256 direct, uint256 level, uint256 autoPool)",
  "function getUserUpline(address user) view returns (address[10] uplines)",
  "function getAutoPoolStatus(address user) view returns (uint256 earned, uint256 target, bool completed)",
  "function getCurrentAutoPoolRecipient() view returns (address)",
  "function getAutoPoolQueueLength() view returns (uint256)",
  "function getAutoPoolQueue(uint256 start, uint256 count) view returns (address[] result)",
  "function getTokenConfiguration() pure returns (tuple(uint256 joinAmount, uint256 adminReward, uint256 directReward, uint256 levelShare, uint256 levelReward, uint256 maxLevels, uint256 autoPoolContribution, uint256 autoPoolTarget))",
  "function getDirectReferralCount(address user) view returns (uint256)",
  `function getDirectReferrals(address user, uint256 offset, uint256 limit) view returns (${MEMBER_DETAILS}[] result)`,
  "function getLevelSummary(address user) view returns (uint256[10] earnings, uint256[10] memberCounts)",
  `function getLevelMembers(address user, uint256 level, uint256 offset, uint256 limit) view returns (${MEMBER_DETAILS}[] result)`,
  "function join(tuple(string fullName, string email, string mobile, address sponsor) input)",
];
