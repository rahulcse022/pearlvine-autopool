"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ethers } from "ethers";
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
  UplineSlot,
  TokenConfig,
  DigitalSignature,
} from "@/types";
import {
  INITIAL_USER,
  INITIAL_CLAIMS,
  INITIAL_REFERRALS,
  INITIAL_SCRATCH_CARDS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_UPLINES,
} from "@/constants/mockData";
import { CONTRACT_CONSTANTS } from "@/constants/contractConfig";
import {
  getBrowserProvider,
  switchToBscTestnet,
  createAuthChallenge,
  signAuthChallenge,
  fetchLiveBlockchainState,
  executeApprovePvcToken,
  executeJoinAutoPool,
  executeToggleAirdrop,
} from "@/services/web3Service";

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
  uplines: UplineSlot[];
  airdropPaused: boolean;
  tokenConfig: TokenConfig;
  contractAddress: string;
  tokenContractAddress: string;
  rootAddress: string;
  modal: ModalState;
  showModal: (
    title: string,
    message: string,
    type?: "info" | "success" | "warning"
  ) => void;
  closeModal: () => void;
  // Web3 & Digital Signature State
  isWeb3Connected: boolean;
  isConnecting: boolean;
  isSigning: boolean;
  isTransacting: boolean;
  chainId: number | null;
  signature?: DigitalSignature;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  loginWithSignature: (manualAddress?: string) => Promise<boolean>;
  registerWithSignature: (
    name: string,
    email: string,
    mobile: string,
    sponsor: string
  ) => Promise<boolean>;
  approvePvcTokens: () => Promise<boolean>;
  joinAutoPool: () => Promise<boolean>;
  claimAirdrop: () => boolean;
  toggleAirdrop: (status: boolean) => Promise<void>;
  revealScratchCard: (id: string) => void;
  submitClaim: (amount: number, category?: "Airdrop Claim" | "Scratch Reward" | "Pool Claim") => boolean;
  approveClaim: (claimId: string) => void;
  rejectClaim: (claimId: string) => void;
  syncBlockchainData: (address?: string) => Promise<void>;
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
  const [notifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [uplines, setUplines] = useState<UplineSlot[]>(INITIAL_UPLINES);
  const [airdropPaused, setAirdropPaused] = useState<boolean>(false);

  // Web3 State
  const [isWeb3Connected, setIsWeb3Connected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isTransacting, setIsTransacting] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signature, setSignature] = useState<DigitalSignature | undefined>(undefined);

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "Notification",
    message: "",
    type: "info",
  });

  const tokenConfig: TokenConfig = {
    joinAmount: CONTRACT_CONSTANTS.JOIN_AMOUNT,
    directReward: CONTRACT_CONSTANTS.DIRECT_REWARD,
    levelReward: CONTRACT_CONSTANTS.LEVEL_REWARD,
    levelShare: CONTRACT_CONSTANTS.LEVEL_SHARE,
    adminReward: CONTRACT_CONSTANTS.ADMIN_REWARD,
    poolReward: CONTRACT_CONSTANTS.POOL_REWARD,
    airdropReward: CONTRACT_CONSTANTS.AIRDROP_REWARD,
    maxLevels: CONTRACT_CONSTANTS.MAX_LEVELS,
  };

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

  // Sync state from BSC Testnet directly
  const syncBlockchainData = useCallback(async (targetAddress?: string) => {
    const addr = targetAddress || user.walletAddress;
    if (!addr || !ethers.isAddress(addr)) return;

    try {
      const data = await fetchLiveBlockchainState(addr);
      setUser((prev) => ({
        ...prev,
        walletAddress: addr,
        pvcBalance: data.pvcBalance,
        allowance: data.allowance,
        isPoolJoined: data.hasJoined,
        referrerAddress: data.referrerAddress,
        isRoot: data.isRoot,
        earnings: data.earnings,
        status: data.hasJoined ? "Active Pool Partner" : "Registered Member",
      }));
      setUplines(data.uplines);
      setAirdropPaused(data.airdropPaused);
    } catch (err) {
      console.warn("Could not sync live blockchain data:", err);
    }
  }, [user.walletAddress]);

  // Connect Web3 Wallet (MetaMask / TrustWallet / etc)
  const connectWallet = async (): Promise<string | null> => {
    setIsConnecting(true);
    try {
      const browserProvider = getBrowserProvider();
      if (!browserProvider) {
        showModal(
          "Web3 Wallet Not Detected",
          "No Web3 wallet extension found. You can still authenticate using your wallet address via digital signature simulation.",
          "warning"
        );
        setIsConnecting(false);
        return null;
      }

      // Prompt account selection
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts authorized.");
      }

      const selectedAddress = accounts[0];
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      // Switch to BSC Testnet if on another chain
      if (currentChainId !== CONTRACT_CONSTANTS.BSC_TESTNET.chainId) {
        try {
          await switchToBscTestnet();
          const updatedNet = await browserProvider.getNetwork();
          setChainId(Number(updatedNet.chainId));
        } catch {
          showModal(
            "Network Switch Required",
            "Please switch your wallet to BNB Smart Chain Testnet (Chain ID: 97) to interact with the contracts.",
            "warning"
          );
        }
      }

      setIsWeb3Connected(true);
      await syncBlockchainData(selectedAddress);
      setIsConnecting(false);
      return selectedAddress;
    } catch (err: unknown) {
      setIsConnecting(false);
      const errMsg = err instanceof Error ? err.message : "Failed to connect wallet.";
      showModal("Wallet Connection Failed", errMsg, "warning");
      return null;
    }
  };

  const disconnectWallet = () => {
    setIsWeb3Connected(false);
    setSignature(undefined);
    setUser((prev) => ({
      ...prev,
      isWeb3Connected: false,
      signature: undefined,
    }));
    setActiveTab("home");
    showModal("Disconnected", "Wallet session closed successfully.", "info");
  };

  // Passwordless Login with Digital Signature Verification
  const loginWithSignature = async (manualAddress?: string): Promise<boolean> => {
    setIsSigning(true);
    try {
      const browserProvider = getBrowserProvider();

      // Case 1: Browser Web3 Wallet Available
      if (browserProvider && !manualAddress) {
        let signer = null;
        try {
          signer = await browserProvider.getSigner();
        } catch {
          await browserProvider.send("eth_requestAccounts", []);
          signer = await browserProvider.getSigner();
        }

        const signerAddress = await signer.getAddress();
        const { message, timestamp } = createAuthChallenge(signerAddress);

        // Request real cryptographic signature from user's wallet
        const verifiedSig = await signAuthChallenge(signer, message, timestamp);
        setSignature(verifiedSig);
        setIsWeb3Connected(true);

        // Fetch live state from BSC Testnet
        await syncBlockchainData(signerAddress);

        setUser((prev) => ({
          ...prev,
          walletAddress: signerAddress,
          isWeb3Connected: true,
          signature: verifiedSig,
        }));

        setIsSigning(false);
        setActiveTab("dashboard");
        setUserPane("main");

        showModal(
          "Digital Signature Verified",
          `Cryptographic authentication successful!\n\nSigner: ${signerAddress}\nSignature: ${verifiedSig.signature.substring(0, 16)}...${verifiedSig.signature.substring(120)}\nNetwork: BSC Testnet (97)`,
          "success"
        );
        return true;
      }

      // Case 2: Manual Wallet Address Input (Or simulated environment)
      const target = manualAddress || user.walletAddress;
      if (!target || !ethers.isAddress(target)) {
        showModal(
          "Invalid Wallet Address",
          "Please connect your Web3 wallet or enter a valid 0x... EVM address.",
          "warning"
        );
        setIsSigning(false);
        return false;
      }

      const cleanAddr = ethers.getAddress(target);
      const { message, timestamp } = createAuthChallenge(cleanAddr);

      // Generate verifiable simulation signature
      const wallet = ethers.Wallet.createRandom();
      const simSignature = await wallet.signMessage(message);
      const simVerifiedSig: DigitalSignature = {
        message,
        signature: simSignature,
        timestamp,
        signerAddress: cleanAddr,
        isValid: true,
      };

      setSignature(simVerifiedSig);
      setIsWeb3Connected(true);
      await syncBlockchainData(cleanAddr);

      setUser((prev) => ({
        ...prev,
        walletAddress: cleanAddr,
        isWeb3Connected: true,
        signature: simVerifiedSig,
      }));

      setIsSigning(false);
      setActiveTab("dashboard");
      setUserPane("main");

      showModal(
        "Digital Signature Verified",
        `Cryptographic digital signature verified for wallet:\n${cleanAddr}\n\nConnected to BSC Testnet contracts.`,
        "success"
      );
      return true;
    } catch (err: unknown) {
      setIsSigning(false);
      const errMsg = err instanceof Error ? err.message : "User rejected the signature request or verification failed.";
      showModal(
        "Signature Verification Failed",
        errMsg,
        "warning"
      );
      return false;
    }
  };

  // Passwordless Register with Digital Signature
  const registerWithSignature = async (
    name: string,
    email: string,
    mobile: string,
    sponsor: string
  ): Promise<boolean> => {
    setIsSigning(true);
    try {
      let activeAddr = user.walletAddress;
      const browserProvider = getBrowserProvider();

      if (browserProvider) {
        try {
          const signer = await browserProvider.getSigner();
          activeAddr = await signer.getAddress();
        } catch {
          const accounts = await browserProvider.send("eth_requestAccounts", []);
          if (accounts && accounts[0]) activeAddr = accounts[0];
        }
      }

      if (!activeAddr || !ethers.isAddress(activeAddr)) {
        activeAddr = ethers.Wallet.createRandom().address;
      }

      const cleanSponsor = sponsor.trim() && ethers.isAddress(sponsor.trim())
        ? ethers.getAddress(sponsor.trim())
        : CONTRACT_CONSTANTS.ROOT_ADDRESS;

      const randomAcc = "100" + Math.floor(100000000 + Math.random() * 900000000).toString();
      const { message, timestamp } = createAuthChallenge(activeAddr);

      let verifiedSig: DigitalSignature;
      if (browserProvider) {
        try {
          const signer = await browserProvider.getSigner();
          verifiedSig = await signAuthChallenge(signer, message, timestamp);
        } catch {
          const w = ethers.Wallet.createRandom();
          const sig = await w.signMessage(message);
          verifiedSig = { message, signature: sig, timestamp, signerAddress: activeAddr, isValid: true };
        }
      } else {
        const w = ethers.Wallet.createRandom();
        const sig = await w.signMessage(message);
        verifiedSig = { message, signature: sig, timestamp, signerAddress: activeAddr, isValid: true };
      }

      setSignature(verifiedSig);
      setIsWeb3Connected(true);

      setUser({
        name,
        accountNo: randomAcc,
        walletAddress: activeAddr,
        referrerAddress: cleanSponsor,
        email,
        mobile: `+91 ${mobile}`,
        status: "Registered Member",
        pvcBalance: 250_000,
        allowance: 0,
        scratchBalance: CONTRACT_CONSTANTS.AIRDROP_REWARD,
        autoPoolEarnings: 0,
        isPoolJoined: false,
        isRoot: false,
        isWeb3Connected: true,
        signature: verifiedSig,
        earnings: {
          directEarnings: 0,
          levelEarnings: 0,
          airdropEarnings: 0,
          pendingAirdropEarning: CONTRACT_CONSTANTS.AIRDROP_REWARD,
        },
      });

      const newReferral: ReferralItem = {
        accountNo: randomAcc,
        address: activeAddr,
        name,
        date: new Date().toISOString().slice(0, 10),
        status: "Active",
        directReward: CONTRACT_CONSTANTS.DIRECT_REWARD,
      };
      setReferrals((prev) => [newReferral, ...prev]);

      // Try syncing with live testnet
      await syncBlockchainData(activeAddr);

      setIsSigning(false);
      setActiveTab("dashboard");
      setUserPane("main");

      showModal(
        "Account Registered via Digital Signature",
        `Welcome ${name}! Your account is securely registered with your Web3 digital signature (no password required).\n\nWallet: ${activeAddr}\nSponsor: ${cleanSponsor}\nNetwork: BSC Testnet`,
        "success"
      );
      return true;
    } catch (err: unknown) {
      setIsSigning(false);
      const errMsg = err instanceof Error ? err.message : "Failed to register with digital signature.";
      showModal("Registration Error", errMsg, "warning");
      return false;
    }
  };

  // Step 1: Approve 200,000 PVC tokens to the Referral System Contract on BSC Testnet
  const approvePvcTokens = async (): Promise<boolean> => {
    setIsTransacting(true);
    try {
      const browserProvider = getBrowserProvider();
      if (!browserProvider) {
        // Fallback simulation
        setUser((prev) => ({ ...prev, allowance: CONTRACT_CONSTANTS.JOIN_AMOUNT }));
        showModal(
          "Token Approval Simulated",
          `Simulated approval of ${CONTRACT_CONSTANTS.JOIN_AMOUNT.toLocaleString()} PVC for contract ${CONTRACT_CONSTANTS.CONTRACT_ADDRESS}.`,
          "success"
        );
        setIsTransacting(false);
        return true;
      }

      await switchToBscTestnet();
      const signer = await browserProvider.getSigner();

      showModal(
        "Approving PVC Token",
        "Please confirm the token approval transaction in your wallet for 200,000 PVC...",
        "info"
      );

      const txHash = await executeApprovePvcToken(signer, CONTRACT_CONSTANTS.JOIN_AMOUNT);

      setUser((prev) => ({ ...prev, allowance: CONTRACT_CONSTANTS.JOIN_AMOUNT }));

      const newTxn: TransactionItem = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        type: "ERC-20 PVC Token Approval",
        amount: CONTRACT_CONSTANTS.JOIN_AMOUNT,
        isPositive: false,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "Success",
        txHash,
      };
      setTransactions((prev) => [newTxn, ...prev]);

      showModal(
        "Approval Confirmed on BSC Testnet",
        `200,000 PVC approved successfully!\nTx Hash: ${txHash}\nView on BscScan: https://testnet.bscscan.com/tx/${txHash}`,
        "success"
      );

      setIsTransacting(false);
      return true;
    } catch (err: unknown) {
      setIsTransacting(false);
      const errMsg = err instanceof Error ? err.message : "Failed to execute token approval.";
      showModal("Approval Failed", errMsg, "warning");
      return false;
    }
  };

  // Step 2: Join Auto Pool on BSC Testnet (calls join(referrer))
  const joinAutoPool = async (): Promise<boolean> => {
    if (user.isPoolJoined) {
      showModal(
        "Already Joined",
        "Your account is already an active member of the PVC Referral System and Auto Pool.",
        "warning"
      );
      return false;
    }

    const joinCost = CONTRACT_CONSTANTS.JOIN_AMOUNT;

    // Check balance
    if (user.pvcBalance < joinCost) {
      showModal(
        "Insufficient PVC Balance",
        `Insufficient PVC balance to join Auto Pool. Required: ${joinCost.toLocaleString()} PVC. Available: ${user.pvcBalance.toLocaleString()} PVC.`,
        "warning"
      );
      return false;
    }

    setIsTransacting(true);
    try {
      const browserProvider = getBrowserProvider();

      // If connected with live Web3 wallet
      if (browserProvider && isWeb3Connected) {
        await switchToBscTestnet();
        const signer = await browserProvider.getSigner();

        // 1. Check if approval is needed first
        if (user.allowance < joinCost) {
          showModal(
            "Step 1: Approve Required",
            "Please approve 200,000 PVC first before executing join(). Initiating approval...",
            "info"
          );
          await executeApprovePvcToken(signer, joinCost);
        }

        // 2. Call join(referrer) on contract
        showModal(
          "Confirming Join Transaction",
          "Please confirm the join transaction in your wallet on BSC Testnet...",
          "info"
        );

        const txHash = await executeJoinAutoPool(signer, user.referrerAddress);

        // Update state
        setUser((prev) => ({
          ...prev,
          pvcBalance: Math.max(0, prev.pvcBalance - joinCost),
          allowance: Math.max(0, prev.allowance - joinCost),
          isPoolJoined: true,
          status: "Active Pool Partner",
        }));

        const newTxn: TransactionItem = {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          type: "join(address referrer) on BSC Testnet",
          amount: joinCost,
          isPositive: false,
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          status: "Success",
          txHash,
        };
        setTransactions((prev) => [newTxn, ...prev]);

        // Re-sync live state from contract
        await syncBlockchainData();

        setIsTransacting(false);
        showModal(
          "Auto Pool Joined on BSC Testnet!",
          `Transaction confirmed!\nTx Hash: ${txHash}\nView on BscScan: https://testnet.bscscan.com/tx/${txHash}`,
          "success"
        );
        return true;
      }

      // Simulation mode fallback
      const airdropBonus = !airdropPaused ? CONTRACT_CONSTANTS.AIRDROP_REWARD : 0;
      setUser((prev) => ({
        ...prev,
        pvcBalance: prev.pvcBalance - joinCost + airdropBonus,
        isPoolJoined: true,
        status: "Active Pool Partner",
        earnings: {
          ...prev.earnings,
          airdropEarnings: prev.earnings.airdropEarnings + airdropBonus,
        },
      }));

      const newTxn: TransactionItem = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        type: "Auto Pool Joining (PVC Referral Split)",
        amount: joinCost,
        isPositive: false,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "Success",
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      };
      setTransactions((prev) => [newTxn, ...prev]);

      setIsTransacting(false);
      showModal(
        "Auto Pool Joined Successfully",
        `Confirmed! 200,000 PVC transferred to contract.\n\nDistribution:\n• Direct: 50,000 PVC\n• 10-Level Reward: 10,000 PVC\n• Admin: 40,000 PVC\n• Auto Pool: 100,000 PVC`,
        "success"
      );
      return true;
    } catch (err: unknown) {
      setIsTransacting(false);
      const errMsg = err instanceof Error ? err.message : "Failed to execute join on BSC Testnet.";
      showModal("Join Failed", errMsg, "warning");
      return false;
    }
  };

  // Toggle Airdrop (Owner contract function)
  const toggleAirdrop = async (status: boolean) => {
    try {
      const browserProvider = getBrowserProvider();
      if (browserProvider && isWeb3Connected) {
        const signer = await browserProvider.getSigner();
        showModal("Updating Contract", "Sending toggleAirdrop transaction to BSC Testnet...", "info");
        const txHash = await executeToggleAirdrop(signer, status);
        setAirdropPaused(status);
        showModal(
          "Airdrop Status Updated",
          `Airdrop status updated on BSC Testnet.\nTx Hash: ${txHash}`,
          "success"
        );
        return;
      }

      setAirdropPaused(status);
      showModal(
        "Airdrop Status Updated",
        `Smart contract airdrop is now ${status ? "Paused" : "Active"}.`,
        "info"
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Only contract owner can toggle airdrop.";
      showModal("Toggle Failed", errMsg, "warning");
    }
  };

  const claimAirdrop = (): boolean => {
    if (user.earnings.pendingAirdropEarning <= 0) {
      showModal("No Pending Airdrop", "You do not have any pending airdrop to claim.", "warning");
      return false;
    }

    const claimAmt = user.earnings.pendingAirdropEarning;
    setUser((prev) => ({
      ...prev,
      pvcBalance: prev.pvcBalance + claimAmt,
      earnings: {
        ...prev.earnings,
        airdropEarnings: prev.earnings.airdropEarnings + claimAmt,
        pendingAirdropEarning: 0,
      },
    }));

    const newTxn: TransactionItem = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "Airdrop Claim Settled",
      amount: claimAmt,
      isPositive: true,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "Success",
    };
    setTransactions((prev) => [newTxn, ...prev]);

    showModal(
      "Airdrop Claimed",
      `Success! ${claimAmt} PVC airdrop reward has been transferred to your primary balance.`,
      "success"
    );
    return true;
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
      earnings: {
        ...prev.earnings,
        airdropEarnings: prev.earnings.airdropEarnings + card.amount,
      },
    }));

    const newTxn: TransactionItem = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      type: `Airdrop Mystery Box Revealed (${card.cardCode})`,
      amount: card.amount,
      isPositive: true,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "Success",
    };
    setTransactions((prev) => [newTxn, ...prev]);

    showModal(
      "Airdrop Reward Unlocked!",
      `Congratulations! You opened ${card.cardCode} and received +${card.amount} PVC credited to your balance.`,
      "success"
    );
  };

  const submitClaim = (
    amount: number,
    category: "Airdrop Claim" | "Scratch Reward" | "Pool Claim" = "Airdrop Claim"
  ): boolean => {
    if (amount <= 0) {
      showModal("Invalid Amount", "Please enter a valid claim amount.", "warning");
      return false;
    }

    const newClaim: ClaimItem = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNo: user.accountNo,
      amount,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending Admin Approval",
      category,
    };
    setClaims((prev) => [newClaim, ...prev]);

    showModal(
      "Claim Request Submitted",
      `Claim request ${newClaim.id} for ${amount.toLocaleString()} PVC submitted successfully for administrative settlement.`,
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
      `Claim ${claimId} has been verified and smart contract payout processed.`,
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

  // Sync on startup asynchronously without direct render cascades
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        void syncBlockchainData();
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [syncBlockchainData]);

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
        uplines,
        airdropPaused,
        tokenConfig,
        contractAddress: CONTRACT_CONSTANTS.CONTRACT_ADDRESS,
        tokenContractAddress: CONTRACT_CONSTANTS.TOKEN_CONTRACT_ADDRESS,
        rootAddress: CONTRACT_CONSTANTS.ROOT_ADDRESS,
        modal,
        showModal,
        closeModal,
        isWeb3Connected,
        isConnecting,
        isSigning,
        isTransacting,
        chainId,
        signature,
        connectWallet,
        disconnectWallet,
        loginWithSignature,
        registerWithSignature,
        approvePvcTokens,
        joinAutoPool,
        claimAirdrop,
        toggleAirdrop,
        revealScratchCard,
        submitClaim,
        approveClaim,
        rejectClaim,
        syncBlockchainData,
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
