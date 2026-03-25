"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem as NavItemType } from "@/types/navigation";
import NavItem from "./NavItem";
import styles from "./Sidebar.module.css";

interface AccordionNavProps {
  items: NavItemType[];
  depth?: number;
  defaultExpandedId?: string;
}

function findActiveParentId(
  items: NavItemType[],
  pathname: string
): string | null {
  for (const item of items) {
    if (item.href === pathname) return item.children ? item.id : null;
    if (item.children?.some((child) => child.href === pathname)) {
      return item.id;
    }
  }
  return null;
}

export default function AccordionNav({ items, depth = 0, defaultExpandedId }: AccordionNavProps) {
  const pathname = usePathname();
  const [expandedId, setExpandedId] = useState<string | null>(
    findActiveParentId(items, pathname) ?? defaultExpandedId ?? null
  );

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <ul className={styles.navList}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          depth={depth}
          expanded={item.children ? expandedId === item.id : undefined}
          onToggleExpand={item.children ? handleToggle : undefined}
        />
      ))}
    </ul>
  );
}
