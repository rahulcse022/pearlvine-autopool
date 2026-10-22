"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  TabType,
  UserPaneType,
  UserProfile,
  ClaimItem,
  ReferralItem,
  TransactionItem,
  ScratchCardItem,
  NotificationItem,
  ModalState,
} from "@/types";
import {
  INITIAL_USER,
  INITIAL_CLAIMS,
  INITIAL_REFERRALS,
  INITIAL_SCRATCH_CARDS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from "@/constants/mockData";

interface PearlvineContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userPane: UserPaneType;
  setUserPane: (pane: UserPaneType) => void;
  user: UserProfile;
  claims: ClaimItem[];
  referrals: ReferralItem[];
  scratchCards: ScratchCardItem[];
  transactions: TransactionItem[];
  notifications: NotificationItem[];
  modal: ModalState;
  showModal: (
    title: string,
    message: string,
    type?: "info" | "success" | "warning"
  ) => void;
  closeModal: () => void;
  joinAutoPool: () => boolean;
  revealScratchCard: (id: string) => void;
  submitClaim: (amount: number) => boolean;
  approveClaim: (claimId: string) => void;
  rejectClaim: (claimId: string) => void;
  registerUser: (name: string, email: string, mobile: string, sponsor: string) => string;
  loginUser: (accountNo: string) => void;
}

const PearlvineContext = createContext<PearlvineContextType | undefined>(
  undefined
);

export function PearlvineProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabType>("home");
  const [userPane, setUserPaneState] = useState<UserPaneType>("main");
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [referrals, setReferrals] = useState<ReferralItem[]>(INITIAL_REFERRALS);
  const [scratchCards, setScratchCards] =
    useState<ScratchCardItem[]>(INITIAL_SCRATCH_CARDS);
  const [transactions, setTransactions] =
    useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "Notification",
    message: "",
    type: "info",
  });

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setUserPane = (pane: UserPaneType) => {
    setUserPaneState(pane);
  };

  const showModal = (
    title: string,
    message: string,
    type: "info" | "success" | "warning" = "info"
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const joinAutoPool = (): boolean => {
    if (user.pvcBalance >= 3000) {
      setUser((prev) => ({
        ...prev,
        pvcBalance: prev.pvcBalance - 3000,
        isPoolJoined: true,
      }));

      const newTxn: TransactionItem = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        type: "Auto Pool Joining Allocation",
        amount: 3000,
        isPositive: false,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "Success",
      };
      setTransactions((prev) => [newTxn, ...prev]);

      setNotifications((prev) => [
        {
          id: String(Date.now()),
          title: "Auto Pool Joined",
          message: "You successfully joined the 3,000 PVC global auto pool.",
          time: "Just now",
          type: "success",
        },
        ...prev,
      ]);

      showModal(
        "Auto Pool Activated",
        "Auto Pool joining successful! 3,000 PVC debited and distributed across system pool (Admin 500, Direct Sponsor 1,000, L2-L6 500, Global Pool 1,000).",
        "success"
      );
      return true;
    } else {
      showModal(
        "Insufficient Balance",
        "Insufficient PVC balance to join Auto Pool (Required: 3,000 PVC).",
        "warning"
      );
      return false;
    }
  };

  const revealScratchCard = (id: string) => {
    const card = scratchCards.find((c) => c.id === id);
    if (!card || card.isRevealed) return;

    setScratchCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRevealed: true } : c))
    );

    setUser((prev) => ({
      ...prev,
      scratchBalance: prev.scratchBalance + card.amount,
      pvcBalance: prev.pvcBalance + card.amount,
    }));

    const newTxn: TransactionItem = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: `Scratch Card Unlocked (${card.cardCode})`,
      amount: card.amount,
      isPositive: true,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "Success",
    };
    setTransactions((prev) => [newTxn, ...prev]);

    showModal(
      "Scratch Reward Unlocked!",
      `Congratulations! You revealed ${card.cardCode} and earned +${card.amount} PVC added to your reward balance.`,
      "success"
    );
  };

  const submitClaim = (amount: number): boolean => {
    if (amount <= 0) {
      showModal("Invalid Amount", "Please enter a valid claim amount.", "warning");
      return false;
    }
    if (amount > user.scratchBalance) {
      showModal(
        "Limit Exceeded",
        "Requested amount exceeds available scratch reward balance.",
        "warning"
      );
      return false;
    }

    setUser((prev) => ({
      ...prev,
      scratchBalance: prev.scratchBalance - amount,
    }));

    const newClaim: ClaimItem = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNo: user.accountNo,
      amount,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending Admin Approval",
    };
    setClaims((prev) => [newClaim, ...prev]);

    showModal(
      "Claim Submitted",
      `Claim request ${newClaim.id} for ${amount} PVC submitted successfully. Pending admin approval.`,
      "success"
    );
    return true;
  };

  const approveClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId ? { ...c, status: "Approved & Paid" } : c
      )
    );
    showModal(
      "Claim Approved",
      `Claim ${claimId} has been approved and payout processed.`,
      "success"
    );
  };

  const rejectClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "Rejected" } : c))
    );
    showModal(
      "Claim Rejected",
      `Claim ${claimId} has been rejected by administration.`,
      "warning"
    );
  };

  const registerUser = (
    name: string,
    email: string,
    mobile: string,
    sponsor: string
  ): string => {
    const randomAcc =
      "100" + Math.floor(100000000 + Math.random() * 900000000).toString();
    setUser({
      name,
      accountNo: randomAcc,
      email,
      mobile: `+91 ${mobile}`,
      status: "Startup Active",
      pvcBalance: 3000,
      scratchBalance: 20,
      autoPoolEarnings: 0,
      isPoolJoined: false,
    });

    const newReferral: ReferralItem = {
      accountNo: randomAcc,
      name,
      date: new Date().toISOString().slice(0, 10),
      status: "Active",
    };
    setReferrals((prev) => [newReferral, ...prev]);

    showModal(
      "Registration Successful",
      `Congratulations ${name}! Your Pearlvine account has been created. Assigned Account Number: ${randomAcc} (Sponsor: ${sponsor}).`,
      "success"
    );
    return randomAcc;
  };

  const loginUser = (accountNo: string) => {
    setUser((prev) => ({
      ...prev,
      accountNo: accountNo || prev.accountNo,
    }));
    setActiveTab("dashboard");
    setUserPane("main");
    showModal(
      "Welcome Back",
      "Mobile Number verified successfully! Welcome to your Pearlvine Panel.",
      "success"
    );
  };

  return (
    <PearlvineContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userPane,
        setUserPane,
        user,
        claims,
        referrals,
        scratchCards,
        transactions,
        notifications,
        modal,
        showModal,
        closeModal,
        joinAutoPool,
        revealScratchCard,
        submitClaim,
        approveClaim,
        rejectClaim,
        registerUser,
        loginUser,
      }}
    >
      {children}
    </PearlvineContext.Provider>
  );
}

export function usePearlvine() {
  const context = useContext(PearlvineContext);
  if (!context) {
    throw new Error("usePearlvine must be used within a PearlvineProvider");
  }
  return context;
}
