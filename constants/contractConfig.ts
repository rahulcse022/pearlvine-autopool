export const CONTRACT_CONSTANTS = {
  TOKEN_SYMBOL: "PVC",
  TOKEN_DECIMALS: 18,

  TOKEN_CONTRACT_ADDRESS: "0x4aE0f8058e0307314255F0C579Af59bD1995529f",
  CONTRACT_ADDRESS: "0x06Bdf6B545F30fff95074F35B91aCeeAFd890108",
  ROOT_ADDRESS: "0x06Bdf6B545F30fff95074F35B91aCeeAFd890108",

  BSC_TESTNET: {
    chainId: 97,
    chainIdHex: "0x61",
    chainName: "BNB Smart Chain Testnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-testnet.publicnode.com",
      "https://bsc-testnet-dataseed.bnbchain.org",
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },

  JOIN_AMOUNT: 5,
  ADMIN_REWARD: 1,
  DIRECT_REWARD: 1,
  LEVEL_SHARE: 1,
  LEVEL_REWARD: 0.1,
  MAX_LEVELS: 10,
  AUTOPOOL_CONTRIBUTION: 2,
  AUTOPOOL_TARGET: 8,
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
