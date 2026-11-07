import {
  UserProfile,
  ClaimItem,
  ReferralItem,
  TransactionItem,
  NotificationItem,
  UplineSlot,
} from "@/types";
import { CONTRACT_CONSTANTS } from "./contractConfig";

export const INITIAL_USER: UserProfile = {
  name: "Santosh Kumar",
  accountNo: "123456789012",
  walletAddress: "0x71C93aE54dE7Bb4310E3F3203F7a40bac2564E8b",
  referrerAddress: CONTRACT_CONSTANTS.ROOT_ADDRESS,
  email: "santosh@example.com",
  mobile: "+91 9900000099",
  status: "Active Member",
  pvcBalance: 250_000, // Sufficient balance to test 200,000 PVC joining
  allowance: 0,
  autoPoolEarnings: 100_000,
  isPoolJoined: false,
  isRoot: false,
  isWeb3Connected: true,
  earnings: {
    directEarnings: 100_000, // 2 active direct referrals * 50,000 PVC
    levelEarnings: 800, // 8 team matrix transactions * 100 PVC
  },
};

export const INITIAL_UPLINES: UplineSlot[] = [
  { level: 1, address: "0x3A21c8B8399580436d4B37AfC5F84b5585094B18", amount: 100, isPaid: true, status: "Active" },
  { level: 2, address: "0x98F421Ac8380D216a751684cEb9bF3976865d1B2", amount: 100, isPaid: true, status: "Active" },
  { level: 3, address: "0x4C1226159A30E6Ebcfb30fD4F4F9Fae82705a610", amount: 100, isPaid: true, status: "Active" },
  { level: 4, address: "0x89D22AfD3B0387b9264c7A2803b879C51Ac25324", amount: 100, isPaid: true, status: "Active" },
  { level: 5, address: "0x5E83210408Fa241Db116D178e5fAec05221b2D11", amount: 100, isPaid: true, status: "Active" },
  { level: 6, address: "0x789bF45123A8C6049C22C08b6EAc72A6F1470b42", amount: 100, isPaid: true, status: "Active" },
  { level: 7, address: "0x12Fa90C53298642a8b9410F4D08Ce561726a9B18", amount: 100, isPaid: true, status: "Active" },
  { level: 8, address: "0x6A9e4210B551a3F6b42b10D597A812E2305ca789", amount: 100, isPaid: true, status: "Active" },
  { level: 9, address: CONTRACT_CONSTANTS.ROOT_ADDRESS, amount: 100, isPaid: true, status: "Empty / Root Reserve" },
  { level: 10, address: CONTRACT_CONSTANTS.ROOT_ADDRESS, amount: 100, isPaid: true, status: "Empty / Root Reserve" },
];

export const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: "CLM-9012",
    accountNo: "123456789012",
    amount: 100_000,
    date: "2026-10-18",
    status: "Pending Admin Approval",
    category: "Pool Claim",
  },
  {
    id: "CLM-8821",
    accountNo: "123456789012",
    amount: 100_000,
    date: "2026-10-15",
    status: "Approved & Paid",
    category: "Pool Claim",
  },
];

export const INITIAL_REFERRALS: ReferralItem[] = [
  {
    accountNo: "100274189231",
    address: "0xA1b2C3d4E5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0",
    name: "Amit Sharma",
    date: "2026-10-18",
    status: "Active",
    directReward: CONTRACT_CONSTANTS.DIRECT_REWARD, // 50,000 PVC
  },
  {
    accountNo: "100274194822",
    address: "0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0C1",
    name: "Priya Verma",
    date: "2026-10-19",
    status: "Active",
    directReward: CONTRACT_CONSTANTS.DIRECT_REWARD, // 50,000 PVC
  },
  {
    accountNo: "100274102934",
    address: "0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1D2",
    name: "Rahul Saini",
    date: "2026-10-20",
    status: "Pending",
    directReward: 0,
  },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: "TXN-778901",
    type: "Direct Referral Reward",
    amount: CONTRACT_CONSTANTS.DIRECT_REWARD, // +50,000 PVC
    isPositive: true,
    date: "2026-10-19 14:20",
    status: "Success",
    txHash: "0x892a...f41b",
  },
  {
    id: "TXN-778850",
    type: "10-Level Reward Commission",
    amount: CONTRACT_CONSTANTS.LEVEL_REWARD, // +100 PVC
    isPositive: true,
    date: "2026-10-18 16:45",
    status: "Success",
    txHash: "0x12ec...99a0",
  },
  {
    id: "TXN-778601",
    type: "Auto Pool Community Distribution",
    amount: CONTRACT_CONSTANTS.POOL_REWARD, // +100,000 PVC
    isPositive: true,
    date: "2026-10-16 09:12",
    status: "Success",
    txHash: "0x78df...52c4",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Direct Referral Joined (+50,000 PVC)",
    message: "Partner 0xB2c3...B0C1 joined under your link. 50,000 PVC direct reward credited!",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: "2",
    title: "10-Level Reward Upline Share (+100 PVC)",
    message: "Level 3 upline join occurred. 100 PVC level reward recorded to your account.",
    time: "5 hours ago",
    type: "info",
  },
  {
    id: "3",
    title: "Auto Pool Share Allocated",
    message: "100,000 PVC from a new join was reserved in the global auto pool for community distribution.",
    time: "1 day ago",
    type: "info",
  },
];
