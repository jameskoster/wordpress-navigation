"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { getAllNavItems } from "@/data/navigation";
import styles from "./Sidebar.module.css";

export default function HistoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { history } = useNavigationHistory();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const allNav = getAllNavItems();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const displayHistory = history.filter((entry) => entry.href !== pathname);

  if (displayHistory.length === 0) return null;

  return (
    <div className={styles.historyWrapper} ref={menuRef}>
      <button
        className={styles.historyButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Navigation history"
      >
        <Clock size={14} />
      </button>
      {isOpen && (
        <div className={styles.historyDropdown}>
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
