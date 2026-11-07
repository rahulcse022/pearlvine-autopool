import { UserPaneType } from "@/types";

export interface DashboardNavItem {
  pane: UserPaneType;
  label: string;
  icon: string;
  color: string;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { pane: "main", label: "Dashboard Overview", icon: "fa-house", color: "text-cyan-400" },
  { pane: "autopool", label: "Auto Pool", icon: "fa-water", color: "text-cyan-400" },
  { pane: "referrals", label: "Direct Referrals", icon: "fa-users", color: "text-emerald-400" },
  { pane: "level", label: "Level Reward", icon: "fa-layer-group", color: "text-amber-400" },
  
];
