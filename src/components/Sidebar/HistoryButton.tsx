"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { getAllNavItems } from "@/data/navigation";
import Tooltip from "@/components/Tooltip/Tooltip";
import styles from "./Sidebar.module.css";

export default function HistoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { history } = useNavigationHistory();
  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const allNav = getAllNavItems();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  const displayHistory = history.filter((entry) => entry.href !== pathname);

  if (displayHistory.length === 0) return null;

  return (
    <div className={styles.historyWrapper} ref={wrapperRef}>
      <Tooltip label="Navigation history">
        <button
          ref={buttonRef}
          className={styles.historyButton}
          onClick={handleOpen}
          aria-label="Navigation history"
        >
          <Clock size={14} />
        </button>
      </Tooltip>
      {isOpen && (
        <div
          className={styles.historyDropdown}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <div className={styles.historyHeader}>Recent</div>
          <ul className={styles.historyList}>
            {displayHistory.map((entry) => {
              const navItem = allNav.find((item) => item.href === entry.href);
              const Icon = navItem?.icon;
              return (
                <li key={entry.href}>
                  <button
                    className={styles.historyItem}
                    onClick={() => {
                      router.push(entry.href);
                      setIsOpen(false);
                    }}
                  >
                    {Icon && <Icon size={14} className={styles.historyItemIcon} />}
                    <span className={styles.historyItemLabel}>
                      {entry.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
