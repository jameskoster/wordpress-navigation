"use client";

import { useState } from "react";
import {
  coreNavItems,
  toolsNavItems,
  settingsNavItems,
  pluginNavItems,
} from "@/data/navigation";
import { useHiddenItems } from "@/hooks/useHiddenItems";
import NavItem from "./NavItem";
import SidebarSection from "./SidebarSection";
import FavoritesSection from "./FavoritesSection";
import AccordionNav from "./AccordionNav";
import SearchTrigger from "./SearchTrigger";
import CustomizePopover from "./CustomizePopover";
import styles from "./Sidebar.module.css";

type PinnedSection = "tools" | "settings" | "plugins" | null;

export default function Sidebar() {
  const [expandedPinned, setExpandedPinned] = useState<PinnedSection>("plugins");
  const { isHidden } = useHiddenItems();

  const togglePinned = (section: PinnedSection) => {
    setExpandedPinned((prev) => (prev === section ? null : section));
  };

  const visibleCoreItems = coreNavItems.filter((item) => !isHidden(item.id));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.siteName}>WordPress</div>
        <CustomizePopover />
      </div>

      <SearchTrigger />

      <nav className={styles.nav}>
        <div className={styles.navScrollable}>
          <AccordionNav items={visibleCoreItems} />

          <FavoritesSection />
        </div>

        <div className={styles.navPinned}>
          <SidebarSection
            label="Tools"
            expanded={expandedPinned === "tools"}
            onToggle={() => togglePinned("tools")}
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
          >
            <AccordionNav items={settingsNavItems} depth={1} />
          </SidebarSection>

          <SidebarSection
            label="Plugins"
            expanded={expandedPinned === "plugins"}
            onToggle={() => togglePinned("plugins")}
          >
            <AccordionNav items={pluginNavItems} depth={1} />
          </SidebarSection>
        </div>
      </nav>
    </aside>
  );
}
