"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { NavItem as NavItemType } from "@/types/navigation";
import { useActiveSource } from "@/hooks/useActiveSource";
import styles from "./Sidebar.module.css";

interface NavItemProps {
  item: NavItemType;
  depth?: number;
  expanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

function isPathMatch(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

function collectBadges(item: NavItemType): number {
  let total = item.badge ?? 0;
  if (item.children) {
    for (const child of item.children) {
      total += collectBadges(child);
    }
  }
  return total;
}

function isDescendantActive(item: NavItemType, pathname: string): boolean {
  if (!item.children) return false;
  return item.children.some(
    (child) =>
      isPathMatch(child.href, pathname) || isDescendantActive(child, pathname)
  );
}

export default function NavItem({
  item,
  depth = 0,
  expanded,
  onToggleExpand,
}: NavItemProps) {
  const pathname = usePathname();
  const { activeSource, setActiveSource } = useActiveSource();
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    !hasChildren && pathname === item.href && activeSource !== "favorites";
  const childActive = hasChildren ? isDescendantActive(item, pathname) : false;

  const isControlled = expanded !== undefined;
  const [localExpanded, setLocalExpanded] = useState(childActive);
  const isExpanded = isControlled ? expanded : localExpanded;

  const [expandedChildId, setExpandedChildId] = useState<string | null>(() => {
    if (!hasChildren) return null;
    for (const child of item.children!) {
      if (child.children && isDescendantActive(child, pathname)) {
        return child.id;
      }
    }
    return null;
  });

  const handleChildToggle = (id: string) => {
    setExpandedChildId((prev) => (prev === id ? null : id));
  };

  const Icon = item.icon;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand(item.id);
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const childrenList = hasChildren && (
    <div className={`${styles.sectionContent} ${isExpanded ? styles.sectionContentOpen : ""}`}>
      <ul className={styles.navItemChildren}>
        {item.children!.map((child) => (
          <NavItem
            key={child.id}
            item={child}
            depth={depth + 1}
            expanded={child.children ? expandedChildId === child.id : undefined}
            onToggleExpand={child.children ? handleChildToggle : undefined}
          />
        ))}
      </ul>
    </div>
  );

  const badge = item.badge;
  const childBadgeTotal = hasChildren ? collectBadges(item) : 0;

  if (hasChildren && depth === 0) {
    return (
      <li className={styles.navItemWrapper}>
        <button
          className={`${styles.navFolder} ${childActive ? styles.navFolderActive : ""}`}
          onClick={handleToggle}
        >
          <span className={styles.navItemLabel}>{item.label}</span>
          <ChevronRight
            size={10}
            className={`${styles.sectionChevron} ${isExpanded ? styles.sectionChevronOpen : ""}`}
          />
          {childBadgeTotal > 0 && (
            <span className={styles.badgeDot} />
          )}
        </button>
        {childrenList}
      </li>
    );
  }

  if (hasChildren) {
    const folderIndent = depth > 1 ? { paddingLeft: `${12 + (depth - 1) * 16}px` } : undefined;
    return (
      <li className={styles.navItemWrapper}>
        <button
          className={`${styles.navItem} ${childActive ? styles.navItemChildActive : ""}`}
          onClick={handleToggle}
          style={folderIndent}
        >
          <span className={styles.navItemContent}>
            {Icon && <Icon size={16} className={styles.navItemIcon} />}
            <span className={styles.navItemLabel}>{item.label}</span>
            <ChevronRight
              size={12}
              className={`${styles.subFolderChevron} ${isExpanded ? styles.navItemChevronOpen : ""}`}
            />
          </span>
          {childBadgeTotal > 0 && (
            <span className={styles.badgeDot} />
          )}
        </button>
        {childrenList}
      </li>
    );
  }

  const indent = depth > 1 ? { paddingLeft: `${12 + (depth - 1) * 16}px` } : undefined;

  return (
    <li className={styles.navItemWrapper}>
      <Link
        href={item.href}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
        style={indent}
        onClick={() => setActiveSource("nav")}
      >
        <span className={styles.navItemContent}>
          {Icon && <Icon size={16} className={styles.navItemIcon} />}
          <span className={styles.navItemLabel}>{item.label}</span>
        </span>
        {badge != null && badge > 0 && (
          <span className={styles.badgeInline}>{badge}</span>
        )}
      </Link>
    </li>
  );
}
