import type { LucideIcon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
  section: "core" | "plugin" | "settings";
  pluginId?: string;
  children?: NavItem[];
  starrable?: boolean;
  hideable?: boolean;
  badge?: number;
};

export type FavoritesFolder = {
  id: string;
  label: string;
  items: string[];
};

export type DynamicNavItem = {
  id: string;
  label: string;
  href: string;
  section: "core" | "plugin" | "settings";
  pluginId?: string;
  ancestorLabel?: string;
};

export type FavoritesState = {
  starred: string[];
  folders: FavoritesFolder[];
  dynamicItems?: Record<string, DynamicNavItem>;
};
