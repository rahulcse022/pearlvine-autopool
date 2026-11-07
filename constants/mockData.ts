import { UserProfile, TokenConfig, UplineSlot } from "@/types";
import { CONTRACT_CONSTANTS } from "./contractConfig";

export const DEFAULT_TOKEN_CONFIG: TokenConfig = {
  joinAmount: CONTRACT_CONSTANTS.JOIN_AMOUNT,
  adminReward: CONTRACT_CONSTANTS.ADMIN_REWARD,
  directReward: CONTRACT_CONSTANTS.DIRECT_REWARD,
  levelShare: CONTRACT_CONSTANTS.LEVEL_SHARE,
  levelReward: CONTRACT_CONSTANTS.LEVEL_REWARD,
  maxLevels: CONTRACT_CONSTANTS.MAX_LEVELS,
  autoPoolContribution: CONTRACT_CONSTANTS.AUTOPOOL_CONTRIBUTION,
  autoPoolTarget: CONTRACT_CONSTANTS.AUTOPOOL_TARGET,
};

export const INITIAL_UPLINES: UplineSlot[] = Array.from(
  { length: CONTRACT_CONSTANTS.MAX_LEVELS },
  (_, index) => ({
    level: index + 1,
    address: "",
    name: "",
    email: "",
    mobile: "",
    amount: CONTRACT_CONSTANTS.LEVEL_REWARD,
    isPaid: false,
  })
);

export const INITIAL_USER: UserProfile = {
  name: "",
  walletAddress: "",
  referrerAddress: CONTRACT_CONSTANTS.ROOT_ADDRESS,
  email: "",
  mobile: "",
  pvcBalance: 0,
  allowance: 0,
  isPoolJoined: false,
  isRoot: false,
  isWeb3Connected: false,
  earnings: {
    directEarnings: 0,
    levelEarnings: 0,
    autoPoolEarnings: 0,
  },
};
