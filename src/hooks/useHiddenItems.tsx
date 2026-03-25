"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "wp-nav-hidden-items";

interface HiddenItemsContextValue {
  hiddenIds: string[];
  isHidden: (id: string) => boolean;
  toggleHidden: (id: string) => void;
  resetHidden: () => void;
}

const HiddenItemsContext = createContext<HiddenItemsContextValue>({
  hiddenIds: [],
  isHidden: () => false,
  toggleHidden: () => {},
  resetHidden: () => {},
});

export function HiddenItemsProvider({ children }: { children: ReactNode }) {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHiddenIds(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenIds));
    }
  }, [hiddenIds, loaded]);

  const isHidden = useCallback(
    (id: string) => hiddenIds.includes(id),
    [hiddenIds]
  );

  const toggleHidden = useCallback((id: string) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const resetHidden = useCallback(() => {
    setHiddenIds([]);
  }, []);

  return (
    <HiddenItemsContext.Provider
      value={{ hiddenIds, isHidden, toggleHidden, resetHidden }}
    >
      {children}
    </HiddenItemsContext.Provider>
  );
}

export function useHiddenItems() {
  return useContext(HiddenItemsContext);
}
