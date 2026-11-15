import { UserPaneType } from "@/types";

export interface DashboardNavItem {
  pane: UserPaneType;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    pane: "main",
    label: "Dashboard Overview",
    shortLabel: "Home",
    icon: "fa-house",
    color: "text-cyan-600",
  },
  {
    pane: "autopool",
    label: "Auto Pool",
    shortLabel: "Pool",
    icon: "fa-water",
    color: "text-cyan-600",
  },
  {
    pane: "referrals",
    label: "Direct Referrals",
    shortLabel: "Direct",
    icon: "fa-users",
    color: "text-emerald-600",
  },
  {
    pane: "level",
    label: "Level Reward",
    shortLabel: "Levels",
    icon: "fa-layer-group",
    color: "text-amber-600",
  },
];
