import {
  UserProfile,
  ClaimItem,
  ReferralItem,
  TransactionItem,
  ScratchCardItem,
  NotificationItem,
} from "@/types";

export const INITIAL_USER: UserProfile = {
  name: "Santosh Kumar",
  accountNo: "123456789012",
  email: "santosh@example.com",
  mobile: "+91 9900000099",
  status: "Startup Active",
  pvcBalance: 3450,
  scratchBalance: 45,
  autoPoolEarnings: 18500,
  isPoolJoined: false,
};

export const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: "CLM-9012",
    accountNo: "123456789012",
    amount: 20,
    date: "2026-10-18",
    status: "Pending Admin Approval",
  },
  {
    id: "CLM-8821",
    accountNo: "123456789012",
    amount: 50,
    date: "2026-10-15",
    status: "Approved & Paid",
  },
];

export const INITIAL_REFERRALS: ReferralItem[] = [
  {
    accountNo: "100274189231",
    name: "Amit Sharma",
    date: "2026-10-18",
    status: "Active",
  },
  {
    accountNo: "100274194822",
    name: "Priya Verma",
    date: "2026-10-19",
    status: "Active",
  },
  {
    accountNo: "100274102934",
    name: "Rahul Saini",
    date: "2026-10-20",
    status: "Pending",
  },
];

export const INITIAL_SCRATCH_CARDS: ScratchCardItem[] = [
  { id: "1", cardCode: "SC-1021", amount: 14, isRevealed: false },
  { id: "2", cardCode: "SC-1022", amount: 8, isRevealed: false },
  { id: "3", cardCode: "SC-1023", amount: 19, isRevealed: false },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: "TXN-554102",
    type: "Direct Referral Income",
    amount: 1000,
    isPositive: true,
    date: "2026-10-19 14:20",
    status: "Success",
  },
  {
    id: "TXN-553921",
    type: "Auto Pool Distribution",
    amount: 1000,
    isPositive: true,
    date: "2026-10-18 09:12",
    status: "Success",
  },
  {
    id: "TXN-551102",
    type: "Scratch Card Reward",
    amount: 15,
    isPositive: true,
    date: "2026-10-17 18:45",
    status: "Success",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Direct Referral Joined",
    message: "User 100274194822 joined successfully under your L1 referral link.",
    time: "2 hours ago",
    type: "info",
  },
  {
    id: "2",
    title: "Reward Payout Completed",
    message: "Your claim request CLM-8821 for 50 PVC has been successfully processed.",
    time: "2 days ago",
    type: "success",
  },
];
