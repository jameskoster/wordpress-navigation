"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ActiveSource = "favorites" | "nav" | null;

interface ActiveSourceContextType {
  activeSource: ActiveSource;
  setActiveSource: (source: ActiveSource) => void;
}

const ActiveSourceContext = createContext<ActiveSourceContextType>({
  activeSource: null,
  setActiveSource: () => {},
});

export function ActiveSourceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSource, setActiveSourceState] = useState<ActiveSource>(null);
  const setActiveSource = useCallback(
    (source: ActiveSource) => setActiveSourceState(source),
    []
  );

  return (
    <ActiveSourceContext.Provider value={{ activeSource, setActiveSource }}>
      {children}
    </ActiveSourceContext.Provider>
  );
}

export function useActiveSource() {
  return useContext(ActiveSourceContext);
}
