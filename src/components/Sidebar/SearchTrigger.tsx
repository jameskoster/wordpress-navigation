"use client";

import { Search } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function SearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <button className={styles.searchTrigger} onClick={handleClick}>
      <span className={styles.searchTriggerLeft}>
        <Search size={14} />
        <span>Search</span>
      </span>
      <kbd className={styles.searchKbd}>⌘K</kbd>
    </button>
  );
}
