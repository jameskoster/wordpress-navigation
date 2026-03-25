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
    !hasChildren && isPathMatch(item.href, pathname) && activeSource !== "favorites";
  const childActive = hasChildren ? isDescendantActive(item, pathname) : false;

  const isControlled = expanded !== undefined;
  const [localExpanded, setLocalExpanded] = useState(childActive);
  const isExpanded = isControlled ? expanded : localExpanded;

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
          <NavItem key={child.id} item={child} depth={depth + 1} />
        ))}
      </ul>
    </div>
  );

  if (hasChildren && depth === 0) {
    return (
      <li className={styles.navItemWrapper}>
        <button
          className={`${styles.navFolder} ${childActive ? styles.navFolderActive : ""}`}
          onClick={handleToggle}
        >
          <ChevronRight
            size={10}
            className={`${styles.sectionChevron} ${isExpanded ? styles.sectionChevronOpen : ""}`}
          />
          <span className={styles.navItemLabel}>{item.label}</span>
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
      </Link>
    </li>
  );
}
