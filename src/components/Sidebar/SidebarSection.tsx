"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./Sidebar.module.css";

interface SidebarSectionProps {
  label: string;
  defaultExpanded?: boolean;
  children: ReactNode;
  action?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  badge?: number;
}

export default function SidebarSection({
  label,
  defaultExpanded = true,
  children,
  action,
  expanded,
  onToggle,
  badge,
}: SidebarSectionProps) {
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : localExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <button
          className={styles.sectionToggle}
          onClick={handleToggle}
        >
          <ChevronRight
            size={10}
            className={`${styles.sectionChevron} ${isExpanded ? styles.sectionChevronOpen : ""}`}
          />
          <span className={styles.sectionLabel}>{label}</span>
          {badge != null && badge > 0 && (
            <span className={styles.badgeDot} />
          )}
        </button>
        {action && (
          <span className={styles.sectionAction}>{action}</span>
        )}
      </div>
      <div
        className={`${styles.sectionContent} ${isExpanded ? styles.sectionContentOpen : ""}`}
      >
        <div className={styles.sectionContentInner}>{children}</div>
      </div>
    </div>
  );
}
