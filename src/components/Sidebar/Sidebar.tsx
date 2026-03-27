"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  coreNavItems,
  toolsNavItems,
  settingsNavItems,
  pluginNavItems,
} from "@/data/navigation";
import { useHiddenItems } from "@/hooks/useHiddenItems";
import { useActiveSource } from "@/hooks/useActiveSource";
import NavItem from "./NavItem";
import SidebarSection from "./SidebarSection";
import FavoritesSection from "./FavoritesSection";
import AccordionNav from "./AccordionNav";
import SearchTrigger from "./SearchTrigger";
import HistoryButton from "./HistoryButton";
import CustomizePopover from "./CustomizePopover";
import styles from "./Sidebar.module.css";

import type { NavItem as NavItemType } from "@/types/navigation";

function totalBadges(items: NavItemType[]): number {
  let total = 0;
  for (const item of items) {
    total += item.badge ?? 0;
    if (item.children) total += totalBadges(item.children);
  }
  return total;
}

type PinnedSection = "tools" | "settings" | "plugins" | null;

function getInitialPinned(pathname: string): PinnedSection {
  if (pathname.startsWith("/plugins/")) return "plugins";
  if (pathname.startsWith("/settings/")) return "settings";
  if (pathname.startsWith("/tools/")) return "tools";
  return null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedPinned, setExpandedPinned] = useState<PinnedSection>(() => getInitialPinned(pathname));
  const { isHidden } = useHiddenItems();
  const { activeSource } = useActiveSource();

  const togglePinned = (section: PinnedSection) => {
    setExpandedPinned((prev) => (prev === section ? null : section));
  };

  const visibleCoreItems = coreNavItems.filter((item) => !isHidden(item.id));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchRow}>
        <SearchTrigger />
        <HistoryButton />
      </div>

      <nav className={styles.nav}>
        <div className={styles.navScrollable}>
          <AccordionNav items={visibleCoreItems} defaultExpandedId="posts" />

          <FavoritesSection />
        </div>

        <div className={styles.navPinned}>
          <SidebarSection
            label="Plugins"
            expanded={expandedPinned === "plugins"}
            onToggle={() => togglePinned("plugins")}
            badge={totalBadges(pluginNavItems)}
            active={
              pathname.startsWith("/plugins/") &&
              activeSource !== "favorites"
            }
          >
            <AccordionNav items={pluginNavItems} depth={1} />
          </SidebarSection>

          <SidebarSection
            label="Tools"
            expanded={expandedPinned === "tools"}
            onToggle={() => togglePinned("tools")}
            active={
              pathname.startsWith("/tools/") && activeSource !== "favorites"
            }
          >
            <ul className={styles.navList}>
              {toolsNavItems.map((item) => (
                <NavItem key={item.id} item={item} depth={1} />
              ))}
            </ul>
          </SidebarSection>

          <SidebarSection
            label="Settings"
            expanded={expandedPinned === "settings"}
            onToggle={() => togglePinned("settings")}
            active={
              pathname.startsWith("/settings/") &&
              activeSource !== "favorites"
            }
          >
            <AccordionNav items={settingsNavItems} depth={1} />
          </SidebarSection>
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <span className={styles.sidebarVersion}>WordPress 6.8</span>
        <CustomizePopover />
      </div>
    </aside>
  );
}
