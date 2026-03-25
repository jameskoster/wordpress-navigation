"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { FavoritesState, FavoritesFolder, DynamicNavItem } from "@/types/navigation";

const STORAGE_KEY = "wp-nav-favorites";

const defaultState: FavoritesState = {
  starred: [],
  folders: [],
};

interface FavoritesContextValue {
  favorites: FavoritesState;
  folders: FavoritesFolder[];
  hasFavorites: boolean;
  isStarred: (id: string) => boolean;
  toggleStarred: (id: string, dynamicMeta?: DynamicNavItem) => void;
  removeStarred: (id: string) => void;
  getDynamicItem: (id: string) => DynamicNavItem | undefined;
  createFolder: (label: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, label: string) => void;
  moveToFolder: (itemId: string, folderId: string) => void;
  removeFromFolder: (itemId: string, folderId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, loaded]);

  const isStarred = useCallback(
    (id: string) => favorites.starred.includes(id),
    [favorites.starred]
  );

  const toggleStarred = useCallback((id: string, dynamicMeta?: DynamicNavItem) => {
    setFavorites((prev) => {
      const isCurrentlyStarred = prev.starred.includes(id);
      if (isCurrentlyStarred) {
        const { [id]: _, ...remainingDynamic } = prev.dynamicItems || {};
        return {
          ...prev,
          starred: prev.starred.filter((s) => s !== id),
          folders: prev.folders.map((f) => ({
            ...f,
            items: f.items.filter((i) => i !== id),
          })),
          dynamicItems: remainingDynamic,
        };
      }
      return {
        ...prev,
        starred: [...prev.starred, id],
        ...(dynamicMeta && {
          dynamicItems: { ...prev.dynamicItems, [id]: dynamicMeta },
        }),
      };
    });
  }, []);

  const removeStarred = useCallback((id: string) => {
    setFavorites((prev) => ({
      ...prev,
      starred: prev.starred.filter((s) => s !== id),
      folders: prev.folders.map((f) => ({
        ...f,
        items: f.items.filter((i) => i !== id),
      })),
    }));
  }, []);

  const createFolder = useCallback((label: string) => {
    setFavorites((prev) => ({
      ...prev,
      folders: [
        ...prev.folders,
        { id: `folder-${Date.now()}`, label, items: [] },
      ],
    }));
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFavorites((prev) => ({
      ...prev,
      folders: prev.folders.filter((f) => f.id !== folderId),
    }));
  }, []);

  const renameFolder = useCallback((folderId: string, label: string) => {
    setFavorites((prev) => ({
      ...prev,
      folders: prev.folders.map((f) =>
        f.id === folderId ? { ...f, label } : f
      ),
    }));
  }, []);

  const moveToFolder = useCallback((itemId: string, folderId: string) => {
    setFavorites((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => {
        if (f.id === folderId) {
          if (f.items.includes(itemId)) return f;
          return { ...f, items: [...f.items, itemId] };
        }
        return { ...f, items: f.items.filter((i) => i !== itemId) };
      }),
    }));
  }, []);

  const removeFromFolder = useCallback((itemId: string, folderId: string) => {
    setFavorites((prev) => ({
      ...prev,
      folders: prev.folders.map((f) =>
        f.id === folderId
          ? { ...f, items: f.items.filter((i) => i !== itemId) }
          : f
      ),
    }));
  }, []);

  const getDynamicItem = useCallback(
    (id: string) => favorites.dynamicItems?.[id],
    [favorites.dynamicItems]
  );

  const hasFavorites = favorites.starred.length > 0 || favorites.folders.length > 0;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        folders: favorites.folders,
        hasFavorites,
        isStarred,
        toggleStarred,
        removeStarred,
        getDynamicItem,
        createFolder,
        deleteFolder,
        renameFolder,
        moveToFolder,
        removeFromFolder,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
