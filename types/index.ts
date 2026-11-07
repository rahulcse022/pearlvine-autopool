export type TabType =
  | "home"
  | "about"
  | "structure"
  | "login"
  | "register"
  | "dashboard";

export type UserPaneType =
  | "main"
  | "autopool"
  | "referrals"
  | "level"
  | "claims"
  | "transactions"
  | "notifications"
  | "profile";

export type ClaimCategory = "Pool Claim" | "Level Reward";

export interface DigitalSignature {
  message: string;
  signature: string;
  timestamp: number;
  signerAddress: string;
  isValid: boolean;
}

export interface ContractEarnings {
  directEarnings: number; // 50,000 PVC per direct
  levelEarnings: number; // 100 PVC per upline member
}

export interface UplineSlot {
  level: number; // 1 to 10
  address: string;
  amount: number; // 100 PVC
  isPaid: boolean;
  status: "Active" | "Empty / Root Reserve";
}

export interface ClaimItem {
  id: string;
  accountNo: string;
  amount: number;
  date: string;
  status: "Pending Admin Approval" | "Approved & Paid" | "Rejected";
  category?: ClaimCategory;
}

export interface ReferralItem {
  accountNo: string;
  address?: string;
  name: string;
  date: string;
  status: "Active" | "Pending";
  directReward: number; // 50,000 PVC
}

export interface TransactionItem {
  id: string;
  type: string;
  amount: number;
  isPositive: boolean;
  date: string;
  status: "Success" | "Pending" | "Failed";
  txHash?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning";
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "info" | "success" | "warning";
}

export interface UserProfile {
  name: string;
  accountNo: string;
  walletAddress: string;
  referrerAddress: string;
  email: string;
  mobile: string;
  status: string;
  pvcBalance: number;
  allowance: number;
  autoPoolEarnings: number;
  isPoolJoined: boolean;
  isRoot: boolean;
  isWeb3Connected: boolean;
  signature?: DigitalSignature;
  earnings: ContractEarnings;
}

export interface TokenConfig {
  joinAmount: number;
  directReward: number;
  levelReward: number;
  levelShare: number;
  adminReward: number;
  poolReward: number;
  maxLevels: number;
}
