"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, CornerDownLeft, File } from "lucide-react";
import { getAllNavItems, findBreadcrumbs } from "@/data/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import type { NavItem } from "@/types/navigation";
import styles from "./CommandPalette.module.css";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { favorites } = useFavorites();

  const staticItems = getAllNavItems();
  const dynamicItems: NavItem[] = Object.values(favorites.dynamicItems || {}).map((d) => ({
    id: d.id,
    label: d.label,
    href: d.href,
    section: d.section,
    icon: File,
    starrable: true,
  }));
  const dynamicIds = new Set(dynamicItems.map((d) => d.id));
  const allItems = [...staticItems.filter((i) => !dynamicIds.has(i.id)), ...dynamicItems];

  const filtered = query.trim()
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.filter((item) => !item.children || item.children.length === 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (item: NavItem) => {
      router.push(item.href);
      setIsOpen(false);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate(filtered[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <Search size={16} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className={styles.kbd}>esc</kbd>
        </div>
        <div className={styles.results} ref={listRef}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No results found</div>
          )}
          {filtered.map((item, i) => {
            const crumbs = findBreadcrumbs(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                data-index={i}
                className={`${styles.resultItem} ${i === selectedIndex ? styles.resultItemSelected : ""}`}
                onClick={() => navigate(item)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span className={styles.resultLeft}>
                  {Icon && <Icon size={16} className={styles.resultIcon} />}
                  <span className={styles.resultLabel}>{item.label}</span>
                </span>
                {crumbs.length > 1 && (
                  <span className={styles.resultBreadcrumbs}>
                    {crumbs.slice(0, -1).map((c, j) => (
                      <span key={c.id} className={styles.resultCrumb}>
                        {j > 0 && <ChevronRight size={10} />}
                        {c.label}
                      </span>
                    ))}
                  </span>
                )}
                {i === selectedIndex && (
                  <CornerDownLeft size={12} className={styles.resultEnter} />
                )}
              </button>
            );
          })}
        </div>
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <kbd className={styles.kbdSmall}>↑↓</kbd> navigate
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.kbdSmall}>↵</kbd> open
          </span>
        </div>
      </div>
    </div>
  );
}
