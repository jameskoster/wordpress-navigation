"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { getAllNavItems } from "@/data/navigation";

export interface HistoryEntry {
  href: string;
  label: string;
  timestamp: number;
}

const MAX_ENTRIES = 10;

function toLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function labelFromPath(href: string): string {
  const segments = href.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  return toLabel(segments[segments.length - 1]);
}

interface NavigationHistoryContextValue {
  history: HistoryEntry[];
}

const NavigationHistoryContext =
  createContext<NavigationHistoryContextValue>({ history: [] });

export function NavigationHistoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const allNav = useRef(getAllNavItems());

  useEffect(() => {
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].href === pathname) return prev;

      const navItem = allNav.current.find((item) => item.href === pathname);
      const label = navItem?.label ?? labelFromPath(pathname);

      const entry: HistoryEntry = {
        href: pathname,
        label,
        timestamp: Date.now(),
      };

      const filtered = prev.filter((e) => e.href !== pathname);
      return [entry, ...filtered].slice(0, MAX_ENTRIES);
    });
  }, [pathname]);

  return (
    <NavigationHistoryContext.Provider value={{ history }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  return useContext(NavigationHistoryContext);
}
