export type TabType = "home" | "login" | "register" | "dashboard";

export type UserPaneType = "main" | "autopool" | "referrals" | "level";

export interface DigitalSignature {
  message: string;
  signature: string;
  timestamp: number;
  signerAddress: string;
  isValid: boolean;
}

export interface ContractEarnings {
  directEarnings: number;
  levelEarnings: number;
  autoPoolEarnings: number;
}

export interface UplineSlot {
  level: number;
  address: string;
  name: string;
  email: string;
  mobile: string;
  amount: number;
  isPaid: boolean;
}

export interface LevelStat {
  level: number;
  income: number;
  joinings: number;
}

export interface LevelRewardItem {
  level: number;
  address: string;
  name: string;
  email: string;
  mobile: string;
  amount: number;
  date: string;
  status: "Joined";
}

export interface ReferralItem {
  address: string;
  name: string;
  email: string;
  mobile: string;
  date: string;
  status: "Active" | "Joined";
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "info" | "success" | "warning";
}

export interface AutoPoolStatus {
  earned: number;
  target: number;
  remaining: number;
  completed: boolean;
  currentRecipient: string;
  queueLength: number;
}

export interface UserProfile {
  name: string;
  walletAddress: string;
  referrerAddress: string;
  email: string;
  mobile: string;
  pvcBalance: number;
  allowance: number;
  isPoolJoined: boolean;
  isRoot: boolean;
  isWeb3Connected: boolean;
  signature?: DigitalSignature;
  earnings: ContractEarnings;
}

export interface TokenConfig {
  joinAmount: number;
  adminReward: number;
  directReward: number;
  levelShare: number;
  levelReward: number;
  maxLevels: number;
  autoPoolContribution: number;
  autoPoolTarget: number;
}
