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
  | "scratch"
  | "claims"
  | "transactions"
  | "notifications"
  | "profile";

export interface ClaimItem {
  id: string;
  accountNo: string;
  amount: number;
  date: string;
  status: "Pending Admin Approval" | "Approved & Paid" | "Rejected";
}

export interface ReferralItem {
  accountNo: string;
  name: string;
  date: string;
  status: "Active" | "Pending";
}

export interface TransactionItem {
  id: string;
  type: string;
  amount: number;
  isPositive: boolean;
  date: string;
  status: "Success" | "Pending" | "Failed";
}

export interface ScratchCardItem {
  id: string;
  cardCode: string;
  amount: number;
  isRevealed: boolean;
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
  email: string;
  mobile: string;
  status: string;
  pvcBalance: number;
  scratchBalance: number;
  autoPoolEarnings: number;
  isPoolJoined: boolean;
}
