import { TabType } from "@/types";

export const APP_PATHS = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  admin: "/admin",
} as const satisfies Record<TabType, string>;

export function tabToPath(tab: TabType): string {
  return APP_PATHS[tab];
}

export function pathToTab(pathname: string): TabType {
  const match = (Object.entries(APP_PATHS) as [TabType, string][]).find(
    ([, path]) => path === pathname
  );
  return match?.[0] ?? "home";
}
