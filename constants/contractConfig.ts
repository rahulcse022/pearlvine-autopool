// Smart Contract Configuration for PVCReferralSystem & PVC Token on BSC Testnet

export const CONTRACT_CONSTANTS = {
  // Token Units & Decimals
  TOKEN_SYMBOL: "PVC",
  TOKEN_DECIMALS: 18,
  UNIT: 1, // Normalized in frontend to 1 PVC (1e18 on-chain)

  // BSC Testnet Contract Addresses provided by user
  TOKEN_CONTRACT_ADDRESS: "0xe17F21F020d79b69f167768e2Eb62fB94EC5c483",
  CONTRACT_ADDRESS: "0xc43bc4f325f2103e60DD0aC6DDB11651dAAe3572",
  ROOT_ADDRESS: "0xc43bc4f325f2103e60DD0aC6DDB11651dAAe3572", // address(this) in Solidity

  // BSC Testnet Network Parameters
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
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://bsc-testnet.publicnode.com",
      "https://bsc-testnet-dataseed.bnbchain.org",
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },

  // Core Financial Parameters from pvc_pool.sol
  JOIN_AMOUNT: 200_000, // 200,000 PVC per join
  DIRECT_REWARD: 50_000, // 50,000 PVC to direct referrer (25%)
  LEVEL_REWARD: 100, // 100 PVC paid per existing upline
  LEVEL_SHARE: 10_000, // 10,000 PVC total 10-level share (5%)
  ADMIN_REWARD: 40_000, // 40,000 PVC to admin reserve (20%)
  POOL_REWARD: 100_000, // 100,000 PVC to global auto pool (50%)
  MAX_LEVELS: 10, // Maximum 10 upline levels for level rewards

  // Allocation Percentages
  PERCENTAGES: {
    DIRECT: 25, // 50,000 / 200,000 = 25%
    LEVEL: 5, // 10,000 / 200,000 = 5%
    ADMIN: 20, // 40,000 / 200,000 = 20%
    POOL: 50, // 100,000 / 200,000 = 50%
  },
} as const;

export interface DistributionRow {
  recipient: string;
  amount: number;
  percentage: number;
  description: string;
  smartContractVar: string;
}

export const JOIN_DISTRIBUTION_BREAKDOWN: DistributionRow[] = [
  {
    recipient: "Direct Sponsor Reward",
    amount: CONTRACT_CONSTANTS.DIRECT_REWARD,
    percentage: CONTRACT_CONSTANTS.PERCENTAGES.DIRECT,
    description: "Instant direct sponsor commission (goes to admin reserve if sponsor is Root contract)",
    smartContractVar: "DIRECT_REWARD (50,000 PVC)",
  },
  {
    recipient: "10-Level Reward Upline Share",
    amount: CONTRACT_CONSTANTS.LEVEL_SHARE,
    percentage: CONTRACT_CONSTANTS.PERCENTAGES.LEVEL,
    description: "100 PVC paid per existing upline (up to 10 levels). Unpaid share remains in admin reserve.",
    smartContractVar: "LEVEL_SHARE (10,000 PVC / 100 PVC per upline)",
  },
  {
    recipient: "Admin & Infrastructure Reserve",
    amount: CONTRACT_CONSTANTS.ADMIN_REWARD,
    percentage: CONTRACT_CONSTANTS.PERCENTAGES.ADMIN,
    description: "Contract maintenance and network security reserve",
    smartContractVar: "ADMIN_REWARD (40,000 PVC + remaining level share)",
  },
  {
    recipient: "Global Auto Pool Allocation",
    amount: CONTRACT_CONSTANTS.POOL_REWARD,
    percentage: CONTRACT_CONSTANTS.PERCENTAGES.POOL,
    description: "Automated community distribution pool reserved for active participants",
    smartContractVar: "POOL_REWARD (100,000 PVC)",
  },
];

// Complete Contract ABIs
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

export const PVC_REFERRAL_SYSTEM_ABI = [
  "function pvcToken() view returns (address)",
  "function referrerOf(address user) view returns (address)",
  "function owner() view returns (address)",
  "function hasJoined(address user) view returns (bool)",
  "function isRoot(address user) view returns (bool)",
  "function join(tuple(string fullName, string email, string mobile, address sponsor, bool joined) user)",
  "function userInfo(address user) view returns (string fullName, string email, string mobile, address sponsor, bool joined)",
  "function getUserUpline(address user) view returns (address[10] uplines)",
  "function earning(address user) view returns (uint256 directEarnings, uint256 levelEarnings, uint256, uint256)",
  "function getTokenConfiguration() pure returns (tuple(uint256 joinAmount, uint256 directReward, uint256 levelReward, uint256 adminReward, uint256 poolReward))",
  "event UserJoined(address indexed user, address indexed referrer)",
  "event DirectRewardPaid(address indexed user, address indexed referrer, uint256 amount)",
  "event LevelRewardPaid(address indexed user, address indexed upline, uint256 level, uint256 amount)",
];
