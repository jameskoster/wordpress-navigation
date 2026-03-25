"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import { coreNavItems } from "@/data/navigation";
import { useHiddenItems } from "@/hooks/useHiddenItems";
import Tooltip from "@/components/Tooltip/Tooltip";
import styles from "./Sidebar.module.css";

const hideableItems = coreNavItems.filter((item) => item.hideable);

export default function CustomizePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { hiddenIds, isHidden, toggleHidden, resetHidden } = useHiddenItems();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className={styles.customizeWrapper} ref={popoverRef}>
      <Tooltip label="Customize sidebar">
        <button
          className={styles.customizeButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Customize sidebar"
        >
          <SlidersHorizontal size={14} />
        </button>
      </Tooltip>
      {isOpen && (
        <div className={styles.customizePopover}>
          <div className={styles.customizeHeader}>Customize sidebar</div>
          <ul className={styles.customizeList}>
            {hideableItems.map((item) => {
              const Icon = item.icon;
              const hidden = isHidden(item.id);
              return (
                <li key={item.id}>
                  <label className={styles.customizeItem}>
                    <span className={styles.customizeItemLabel}>
                      {Icon && (
                        <Icon size={14} className={styles.customizeItemIcon} />
                      )}
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={!hidden}
                      onChange={() => toggleHidden(item.id)}
                      className={styles.customizeCheckbox}
                    />
                  </label>
                </li>
              );
            })}
          </ul>
          {hiddenIds.length > 0 && (
            <div className={styles.customizeFooter}>
              <button
                className={styles.customizeReset}
                onClick={() => resetHidden()}
              >
                Reset to defaults
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
