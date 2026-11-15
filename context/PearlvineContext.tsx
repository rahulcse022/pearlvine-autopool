"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ethers } from "ethers";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
  useDisconnect,
  type Provider,
} from "@reown/appkit/react";
import { bsc } from "@reown/appkit/networks";
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
import { appKitModal } from "@/context/AppKitProvider";
import {
  getBrowserProvider,
  getWalletChainId,
  setActiveWalletProvider,
  switchToBscMainnet,
  createAuthChallenge,
  signAuthChallenge,
  fetchLiveBlockchainState,
  executeApprovePvcToken,
  executeJoinAutoPool,
  resolveSponsorAddress,
  fetchTokenConfiguration,
  fetchContractOwner,
  executeWithdrawPvcToPartners,
  type EthereumProvider,
} from "@/services/web3Service";
import {
  loadAuthSession,
  saveAuthSession,
  clearAuthSession,
} from "@/utils/authSession";

function waitForAppKitAddress(timeoutMs = 20_000): Promise<string | null> {
  const existing = appKitModal.getAddress("eip155");
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      unsub();
      resolve(appKitModal.getAddress("eip155") ?? null);
    }, timeoutMs);

    const unsub = appKitModal.subscribeAccount((state) => {
      if (state.isConnected && state.address) {
        clearTimeout(timer);
        unsub();
        resolve(state.address);
      }
    });
  });
}

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
  isAdmin: boolean;
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
  withdrawPvcToPartners: (amountPVC: number) => Promise<boolean>;
}

const EMPTY_AUTO_POOL: AutoPoolStatus = {
  earned: 0,
  target: DEFAULT_TOKEN_CONFIG.autoPoolTarget,
  remaining: DEFAULT_TOKEN_CONFIG.autoPoolTarget,
  completed: false,
  currentRecipient: "",
  currentRecipientName: "",
  currentRecipientEarned: 0,
  currentRecipientTarget: DEFAULT_TOKEN_CONFIG.autoPoolTarget,
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
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { chainId: appKitChainId, switchNetwork } = useAppKitNetwork();
  const { address: appKitAddress, isConnected: appKitConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const sessionWalletRef = useRef<string>("");
  const appKitAddressRef = useRef<string | undefined>(appKitAddress);
  const switchingNetworkRef = useRef(false);

  useEffect(() => {
    appKitAddressRef.current = appKitAddress;
  }, [appKitAddress]);

  const bscChainId = CONTRACT_CONSTANTS.BSC_MAINNET.chainId;

  const ensureBscNetwork = useCallback(async () => {
    const current =
      appKitChainId != null ? Number(appKitChainId) : await getWalletChainId();
    if (current === bscChainId) {
      setChainId(bscChainId);
      return;
    }

    try {
      await switchNetwork(bsc);
      setChainId(bscChainId);
      return;
    } catch (appKitErr) {
      console.warn("AppKit switchNetwork failed, trying wallet provider:", appKitErr);
    }

    await switchToBscMainnet();
    setChainId(bscChainId);
  }, [appKitChainId, bscChainId, switchNetwork]);

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [contractOwner, setContractOwner] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
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

  useEffect(() => {
    setActiveWalletProvider(
      walletProvider ? (walletProvider as unknown as EthereumProvider) : null
    );
  }, [walletProvider]);

  useEffect(() => {
    sessionWalletRef.current = user.walletAddress || "";
  }, [user.walletAddress]);

  // Auto-switch to BSC Mainnet whenever wallet is connected on another chain
  useEffect(() => {
    if (!appKitConnected) return;
    if (appKitChainId == null) return;

    const current = Number(appKitChainId);
    setChainId(current);
    if (current === bscChainId) return;
    if (switchingNetworkRef.current) return;

    switchingNetworkRef.current = true;
    void ensureBscNetwork()
      .catch((err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to switch to BSC Mainnet.";
        setModal({
          isOpen: true,
          title: "Wrong Network",
          message: msg,
          type: "warning",
        });
      })
      .finally(() => {
        switchingNetworkRef.current = false;
      });
  }, [appKitConnected, appKitChainId, bscChainId, ensureBscNetwork]);

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
    let mounted = true;
    void fetchContractOwner().then((owner) => {
      if (mounted) setContractOwner(owner);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isWeb3Connected || !user.walletAddress || !contractOwner) {
      setIsAdmin(false);
      return;
    }
    try {
      setIsAdmin(
        ethers.getAddress(user.walletAddress) === ethers.getAddress(contractOwner)
      );
    } catch {
      setIsAdmin(false);
    }
  }, [isWeb3Connected, user.walletAddress, contractOwner]);

  useEffect(() => {
    if (!authReady) return;
    if (
      !isWeb3Connected &&
      (pathname === APP_PATHS.dashboard || pathname === APP_PATHS.admin)
    ) {
      router.replace(APP_PATHS.login);
      return;
    }
    if (isWeb3Connected && pathname === APP_PATHS.admin && contractOwner && !isAdmin) {
      router.replace(APP_PATHS.dashboard);
      return;
    }
    if (
      isWeb3Connected &&
      (pathname === APP_PATHS.login || pathname === APP_PATHS.register)
    ) {
      router.replace(APP_PATHS.dashboard);
    }
  }, [authReady, isWeb3Connected, isAdmin, contractOwner, pathname, router]);

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

  const resetLocalAuthState = useCallback(() => {
    clearAuthSession();
    setIsWeb3Connected(false);
    setIsAdmin(false);
    setSignature(undefined);
    setUser(INITIAL_USER);
    setReferrals([]);
    setUplines(INITIAL_UPLINES);
    setLevelRewards([]);
    setLevelStats(EMPTY_LEVEL_STATS);
    setAutoPool(EMPTY_AUTO_POOL);
    setTotalJoined(0);
    setUserPaneState("main");
  }, []);

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
        referrerName: data.referrerName || "",
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

  useEffect(() => {
    let mounted = true;
    void fetchTokenConfiguration().then((config) => {
      if (mounted) setTokenConfig(config);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Restore session after refresh; logout only on manual logout or wallet change
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const session = loadAuthSession();
      if (!session) {
        if (mounted) setAuthReady(true);
        return;
      }

      try {
        const live = await fetchLiveBlockchainState(session.walletAddress);
        if (!mounted) return;

        if (!live.hasJoined) {
          clearAuthSession();
          setAuthReady(true);
          return;
        }

        setSignature(session.signature);
        applyLiveState(session.walletAddress, live, {
          signature: session.signature,
          isWeb3Connected: true,
        });
        setIsWeb3Connected(true);
      } catch (err) {
        console.warn("Failed to restore auth session:", err);
        // Keep session on transient RPC errors so refresh does not force logout
        if (!mounted) return;
        setSignature(session.signature);
        setUser((prev) => ({
          ...prev,
          walletAddress: session.walletAddress,
          signature: session.signature,
          isWeb3Connected: true,
        }));
        setIsWeb3Connected(true);
      } finally {
        if (mounted) setAuthReady(true);
      }
    };

    void restoreSession();
    return () => {
      mounted = false;
    };
  }, [applyLiveState]);

  // Auto-logout when AppKit account disconnects or switches away from session wallet
  useEffect(() => {
    if (!isWeb3Connected) return;

    const unsub = appKitModal.subscribeAccount((state) => {
      const sessionWallet = sessionWalletRef.current;
      if (!sessionWallet) return;

      if (!state.isConnected || !state.address) {
        resetLocalAuthState();
        router.replace(APP_PATHS.login);
        return;
      }

      try {
        if (ethers.getAddress(state.address) !== ethers.getAddress(sessionWallet)) {
          resetLocalAuthState();
          showModal(
            "Wallet Changed",
            "Active wallet changed. Please sign in again with the new wallet.",
            "warning"
          );
          router.replace(APP_PATHS.login);
        }
      } catch {
        // ignore invalid address during transient wallet updates
      }
    });

    return () => {
      unsub();
    };
  }, [isWeb3Connected, router, resetLocalAuthState]);

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
      let selectedAddress =
        (appKitConnected && appKitAddress) ||
        appKitModal.getAddress("eip155") ||
        appKitAddressRef.current ||
        null;

      if (!selectedAddress) {
        await open({ view: "Connect" });
        // Modal close resolves first; brief wait covers provider hydration race.
        selectedAddress =
          appKitModal.getAddress("eip155") ||
          appKitAddressRef.current ||
          (await waitForAppKitAddress(4_000));
      }

      if (!selectedAddress) {
        showModal(
          "Wallet Required",
          "Connect Bitget, MetaMask, Trust Wallet, or SafePal to continue.",
          "warning"
        );
        return null;
      }

      const provider =
        (walletProvider as unknown as EthereumProvider | undefined) ||
        appKitModal.getProvider<EthereumProvider>("eip155");
      if (provider) setActiveWalletProvider(provider);

      await ensureBscNetwork();

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
    void disconnect().catch(() => undefined);
    setActiveWalletProvider(null);
    resetLocalAuthState();
    router.replace(APP_PATHS.home);
  };

  const getConnectedSigner = async (): Promise<{
    signer: ethers.Signer;
    address: string;
  } | null> => {
    const connectedAddress = await connectWallet();
    if (!connectedAddress) return null;

    await ensureBscNetwork();

    const providerFromKit =
      (walletProvider as unknown as EthereumProvider | undefined) ||
      appKitModal.getProvider<EthereumProvider>("eip155");
    if (providerFromKit) setActiveWalletProvider(providerFromKit);

    const browserProvider = getBrowserProvider();
    if (!browserProvider) {
      showModal(
        "Wallet Required",
        "Connect Bitget, MetaMask, Trust Wallet, or SafePal to continue.",
        "warning"
      );
      return null;
    }

    let signer: ethers.Signer;
    try {
      signer = await browserProvider.getSigner();
    } catch {
      await browserProvider.send("eth_requestAccounts", []);
      signer = await browserProvider.getSigner();
    }

    const signerAddress = await signer.getAddress();
    return { signer, address: signerAddress };
  };

  const loginWithSignature = async (): Promise<boolean> => {
    setIsSigning(true);
    try {
      const ready = await getConnectedSigner();
      if (!ready) return false;

      const { signer, address: signerAddress } = ready;
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
      saveAuthSession(signerAddress, verifiedSig);
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
      const ready = await getConnectedSigner();
      if (!ready) return false;

      const { signer, address: activeAddr } = ready;
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
      saveAuthSession(activeAddr, verifiedSig);
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

  const withdrawPvcToPartners = async (amountPVC: number): Promise<boolean> => {
    if (!isAdmin) {
      showModal("Admin Only", "Only the contract owner can withdraw to partners.", "warning");
      return false;
    }
    if (!(amountPVC > 0)) {
      showModal("Invalid Amount", "Enter an amount greater than 0.", "warning");
      return false;
    }

    setIsTransacting(true);
    try {
      const ready = await getConnectedSigner();
      if (!ready) return false;

      showModal(
        "Withdraw to Partners",
        `Confirm ${amountPVC} PVC split 50/50 to partner wallets.`,
        "info"
      );
      await executeWithdrawPvcToPartners(ready.signer, amountPVC);
      showModal(
        "Withdrawn",
        `${amountPVC} PVC sent 50/50 to Partner 1 and Partner 2.`,
        "success"
      );
      return true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Withdraw failed.";
      showModal("Withdraw Failed", errMsg, "warning");
      return false;
    } finally {
      setIsTransacting(false);
    }
  };

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
        isAdmin,
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
        withdrawPvcToPartners,
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
