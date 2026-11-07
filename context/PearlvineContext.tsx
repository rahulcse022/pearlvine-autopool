"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ethers } from "ethers";
import {
  TabType,
  UserPaneType,
  UserProfile,
  ReferralItem,
  LevelRewardItem,
  LevelStat,
  ModalState,
  UplineSlot,
  TokenConfig,
  DigitalSignature,
  AutoPoolStatus,
} from "@/types";
import { INITIAL_USER, DEFAULT_TOKEN_CONFIG, INITIAL_UPLINES } from "@/constants/mockData";
import { CONTRACT_CONSTANTS } from "@/constants/contractConfig";
import { APP_PATHS, pathToTab, tabToPath } from "@/constants/routes";
import {
  getBrowserProvider,
  switchToBscTestnet,
  createAuthChallenge,
  signAuthChallenge,
  fetchLiveBlockchainState,
  executeApprovePvcToken,
  executeJoinAutoPool,
  resolveSponsorAddress,
  fetchTokenConfiguration,
} from "@/services/web3Service";

interface PearlvineContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userPane: UserPaneType;
  setUserPane: (pane: UserPaneType) => void;
  user: UserProfile;
  referrals: ReferralItem[];
  uplines: UplineSlot[];
  levelRewards: LevelRewardItem[];
  levelStats: LevelStat[];
  autoPool: AutoPoolStatus;
  totalJoined: number;
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
  isWeb3Connected: boolean;
  isConnecting: boolean;
  isSigning: boolean;
  isTransacting: boolean;
  chainId: number | null;
  signature?: DigitalSignature;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  loginWithSignature: () => Promise<boolean>;
  registerWithSignature: (
    name: string,
    email: string,
    mobile: string,
    sponsor: string
  ) => Promise<boolean>;
  syncBlockchainData: (address?: string) => Promise<void>;
}

const EMPTY_AUTO_POOL: AutoPoolStatus = {
  earned: 0,
  target: DEFAULT_TOKEN_CONFIG.autoPoolTarget,
  remaining: DEFAULT_TOKEN_CONFIG.autoPoolTarget,
  completed: false,
  currentRecipient: "",
  queueLength: 0,
};

const EMPTY_EARNINGS = {
  directEarnings: 0,
  levelEarnings: 0,
  autoPoolEarnings: 0,
};

const EMPTY_LEVEL_STATS: LevelStat[] = Array.from(
  { length: CONTRACT_CONSTANTS.MAX_LEVELS },
  (_, i) => ({ level: i + 1, income: 0, joinings: 0 })
);

const PearlvineContext = createContext<PearlvineContextType | undefined>(undefined);

export function PearlvineProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = pathToTab(pathname);

  const [userPane, setUserPaneState] = useState<UserPaneType>("main");
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [uplines, setUplines] = useState<UplineSlot[]>(INITIAL_UPLINES);
  const [levelRewards, setLevelRewards] = useState<LevelRewardItem[]>([]);
  const [levelStats, setLevelStats] = useState<LevelStat[]>(EMPTY_LEVEL_STATS);
  const [autoPool, setAutoPool] = useState<AutoPoolStatus>(EMPTY_AUTO_POOL);
  const [totalJoined, setTotalJoined] = useState(0);
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>(DEFAULT_TOKEN_CONFIG);

  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signature, setSignature] = useState<DigitalSignature | undefined>();

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "Notification",
    message: "",
    type: "info",
  });

  const setActiveTab = (tab: TabType) => {
    const nextPath = tabToPath(tab);
    if (pathname !== nextPath) {
      router.push(nextPath);
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isWeb3Connected && pathname === APP_PATHS.dashboard) {
      router.replace(APP_PATHS.login);
      return;
    }
    if (
      isWeb3Connected &&
      (pathname === APP_PATHS.login || pathname === APP_PATHS.register)
    ) {
      router.replace(APP_PATHS.dashboard);
    }
  }, [isWeb3Connected, pathname, router]);

  useEffect(() => {
    let mounted = true;
    void fetchTokenConfiguration().then((config) => {
      if (mounted) setTokenConfig(config);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setUserPane = (pane: UserPaneType) => {
    setUserPaneState(pane);
  };

  const showModal = (
    title: string,
    message: string,
    type: "info" | "success" | "warning" = "info"
  ) => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const applyLiveState = useCallback(
    (
      addr: string,
      data: Awaited<ReturnType<typeof fetchLiveBlockchainState>>,
      extras?: Partial<UserProfile>
    ) => {
      setTokenConfig(data.tokenConfig);
      setUplines(data.uplines);
      setLevelRewards(data.levelRewards);
      setLevelStats(data.levelStats);
      setAutoPool(data.autoPool);
      setTotalJoined(data.totalJoined);
      setReferrals(data.referrals);
      setUser((prev) => ({
        ...prev,
        walletAddress: addr,
        name: extras?.name || data.name || prev.name,
        email: extras?.email || data.email || prev.email,
        mobile: extras?.mobile || data.mobile || prev.mobile,
        pvcBalance: data.pvcBalance,
        allowance: data.allowance,
        isPoolJoined: data.hasJoined,
        referrerAddress: data.referrerAddress,
        isRoot: data.isRoot,
        isWeb3Connected: true,
        earnings: {
          directEarnings: data.earnings?.directEarnings ?? 0,
          levelEarnings: data.earnings?.levelEarnings ?? 0,
          autoPoolEarnings: data.earnings?.autoPoolEarnings ?? 0,
        },
        ...extras,
      }));
    },
    []
  );

  const syncBlockchainData = useCallback(
    async (targetAddress?: string) => {
      const addr = targetAddress || user.walletAddress;
      if (!addr || !ethers.isAddress(addr)) return;

      try {
        const data = await fetchLiveBlockchainState(addr);
        applyLiveState(addr, data);
      } catch (err) {
        console.warn("Could not sync live blockchain data:", err);
      }
    },
    [user.walletAddress, applyLiveState]
  );

  const connectWallet = async (): Promise<string | null> => {
    setIsConnecting(true);
    try {
      const browserProvider = getBrowserProvider();
      if (!browserProvider) {
        showModal(
          "Wallet Required",
          "Install MetaMask or another Web3 wallet to continue.",
          "warning"
        );
        return null;
      }

      const accounts = await browserProvider.send("eth_requestAccounts", []);
      if (!accounts?.length) {
        throw new Error("No accounts authorized.");
      }

      const selectedAddress = accounts[0] as string;
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      if (currentChainId !== CONTRACT_CONSTANTS.BSC_TESTNET.chainId) {
        await switchToBscTestnet();
        const updatedNet = await browserProvider.getNetwork();
        setChainId(Number(updatedNet.chainId));
      }

      await syncBlockchainData(selectedAddress);
      setUser((prev) => ({ ...prev, walletAddress: selectedAddress }));
      return selectedAddress;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to connect wallet.";
      showModal("Wallet Connection Failed", errMsg, "warning");
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsWeb3Connected(false);
    setSignature(undefined);
    setUser(INITIAL_USER);
    setReferrals([]);
    setUplines(INITIAL_UPLINES);
    setLevelRewards([]);
    setLevelStats(EMPTY_LEVEL_STATS);
    setAutoPool(EMPTY_AUTO_POOL);
    setTotalJoined(0);
    setUserPaneState("main");
    router.replace(APP_PATHS.home);
  };

  const loginWithSignature = async (): Promise<boolean> => {
    setIsSigning(true);
    try {
      const browserProvider = getBrowserProvider();
      if (!browserProvider) {
        showModal(
          "Wallet Required",
          "Install MetaMask or another Web3 wallet to sign in.",
          "warning"
        );
        return false;
      }

      await switchToBscTestnet();
      let signer: ethers.Signer;
      try {
        signer = await browserProvider.getSigner();
      } catch {
        await browserProvider.send("eth_requestAccounts", []);
        signer = await browserProvider.getSigner();
      }

      const signerAddress = await signer.getAddress();
      const live = await fetchLiveBlockchainState(signerAddress);

      if (!live.hasJoined) {
        showModal(
          "Not Registered",
          "This wallet has not joined yet. Please register and pay the join amount first.",
          "warning"
        );
        router.replace(APP_PATHS.register);
        return false;
      }

      const { message, timestamp } = createAuthChallenge(signerAddress);
      const verifiedSig = await signAuthChallenge(signer, message, timestamp);

      setSignature(verifiedSig);
      applyLiveState(signerAddress, live, {
        signature: verifiedSig,
        isWeb3Connected: true,
      });
      setIsWeb3Connected(true);
      setUserPaneState("main");
      showModal("Signed In", "Welcome back.", "success");
      return true;
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Signature verification failed.";
      showModal("Login Failed", errMsg, "warning");
      return false;
    } finally {
      setIsSigning(false);
    }
  };

  const registerWithSignature = async (
    name: string,
    email: string,
    mobile: string,
    sponsor: string
  ): Promise<boolean> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();
    if (!cleanName || !cleanEmail || !cleanMobile) {
      showModal("Missing Details", "Please fill name, email, and mobile.", "warning");
      return false;
    }

    if (!ethers.isAddress(sponsor.trim())) {
      showModal("Invalid Sponsor", "Enter a valid sponsor wallet address.", "warning");
      return false;
    }

    setIsSigning(true);
    setIsTransacting(true);
    try {
      const browserProvider = getBrowserProvider();
      if (!browserProvider) {
        showModal(
          "Wallet Required",
          "Install MetaMask or another Web3 wallet to register.",
          "warning"
        );
        return false;
      }

      await switchToBscTestnet();
      let signer: ethers.Signer;
      try {
        signer = await browserProvider.getSigner();
      } catch {
        await browserProvider.send("eth_requestAccounts", []);
        signer = await browserProvider.getSigner();
      }

      const activeAddr = await signer.getAddress();
      const cleanSponsor = resolveSponsorAddress(sponsor);

      if (cleanSponsor.toLowerCase() === activeAddr.toLowerCase()) {
        showModal("Invalid Sponsor", "Sponsor cannot be your own wallet.", "warning");
        return false;
      }

      const live = await fetchLiveBlockchainState(activeAddr);
      setTokenConfig(live.tokenConfig);
      const joinCost = live.tokenConfig.joinAmount;

      if (live.hasJoined) {
        showModal(
          "Already Joined",
          "This wallet is already registered. Please sign in.",
          "warning"
        );
        router.replace(APP_PATHS.login);
        return false;
      }

      if (live.pvcBalance < joinCost) {
        showModal(
          "Insufficient PVC",
          `Need ${joinCost} PVC to join. Available: ${live.pvcBalance} PVC.`,
          "warning"
        );
        return false;
      }

      showModal("Sign Message", "Confirm wallet ownership in your wallet.", "info");
      const { message, timestamp } = createAuthChallenge(activeAddr);
      const verifiedSig = await signAuthChallenge(signer, message, timestamp);
      setSignature(verifiedSig);

      const profile = {
        name: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
        referrerAddress: cleanSponsor,
      };

      if (live.allowance < joinCost) {
        showModal("Approve PVC", `Approve ${joinCost} PVC for joining.`, "info");
        await executeApprovePvcToken(signer, joinCost);
      }

      showModal("Joining", `Confirm join transaction · ${joinCost} PVC.`, "info");
      await executeJoinAutoPool(signer, profile);

      const afterJoin = await fetchLiveBlockchainState(activeAddr);
      if (!afterJoin.hasJoined) {
        throw new Error("Join transaction completed but membership not confirmed yet.");
      }

      applyLiveState(activeAddr, afterJoin, {
        name: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
        referrerAddress: cleanSponsor,
        signature: verifiedSig,
        isWeb3Connected: true,
        isPoolJoined: true,
        earnings: afterJoin.earnings ?? EMPTY_EARNINGS,
      });
      setIsWeb3Connected(true);
      setUserPaneState("main");
      showModal("Joined", `Registered successfully with ${joinCost} PVC.`, "success");
      return true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to register.";
      showModal("Registration Error", errMsg, "warning");
      return false;
    } finally {
      setIsSigning(false);
      setIsTransacting(false);
    }
  };

  useEffect(() => {
    if (!isWeb3Connected || !user.walletAddress) return;
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) void syncBlockchainData();
    }, 50);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isWeb3Connected, user.walletAddress, syncBlockchainData]);

  return (
    <PearlvineContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userPane,
        setUserPane,
        user,
        referrals,
        uplines,
        levelRewards,
        levelStats,
        autoPool,
        totalJoined,
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
