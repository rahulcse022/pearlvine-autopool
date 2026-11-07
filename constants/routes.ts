import { TabType } from "@/types";

export const APP_PATHS = {
  home: "/",
  about: "/about",
  structure: "/structure",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
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
