"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderPlus,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { File } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useActiveSource } from "@/hooks/useActiveSource";
import { getAllNavItems, findAncestorLabel } from "@/data/navigation";
import type { NavItem } from "@/types/navigation";
import SidebarSection from "./SidebarSection";
import styles from "./Sidebar.module.css";

interface MenuPosition {
  top: number;
  left: number;
}

export default function FavoritesSection() {
  const {
    favorites,
    folders,
    createFolder,
    deleteFolder,
    renameFolder,
    moveToFolder,
    removeFromFolder,
    getDynamicItem,
  } = useFavorites();
  const pathname = usePathname();
  const { activeSource, setActiveSource } = useActiveSource();
  const allNav = getAllNavItems();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, left: 0 });
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);

  const rootStarred = favorites.starred.filter(
    (id) => !folders.some((f) => f.items.includes(id))
  );

  const getNavItem = (id: string): (NavItem & { ancestorOverride?: string }) | null => {
    const staticItem = allNav.find((item) => item.id === id);
    if (staticItem) return staticItem;
    const dynamic = getDynamicItem(id);
    if (dynamic) {
      return {
        id: dynamic.id,
        label: dynamic.label,
        href: dynamic.href,
        section: dynamic.section,
        icon: File,
        starrable: true,
        ancestorOverride: dynamic.ancestorLabel,
      };
    }
    return null;
  };

  const closeMenus = useCallback(() => {
    setContextMenuId(null);
    setFolderMenuId(null);
  }, []);

  useEffect(() => {
    if (contextMenuId || folderMenuId) {
      const handler = () => closeMenus();
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [contextMenuId, folderMenuId, closeMenus]);

  const openMenu = (
    e: React.MouseEvent,
    id: string,
    type: "item" | "folder"
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left - 140 });
    if (type === "item") {
      setContextMenuId(contextMenuId === id ? null : id);
      setFolderMenuId(null);
    } else {
      setFolderMenuId(folderMenuId === id ? null : id);
      setContextMenuId(null);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleRenameFolder = (folderId: string) => {
    if (editFolderName.trim()) {
      renameFolder(folderId, editFolderName.trim());
      setEditingFolderId(null);
      setEditFolderName("");
    }
  };

  const addAction = (
    <button
      className={styles.sectionActionBtn}
      onClick={() => setIsCreatingFolder(true)}
      title="Create folder"
    >
      <FolderPlus size={12} />
    </button>
  );

  return (
    <SidebarSection label="Favorites" defaultExpanded action={addAction}>
      <ul className={styles.navList}>
        {rootStarred.map((id) => {
          const item = getNavItem(id);
          if (!item) return null;
          const Icon = item.icon;
          const ancestor = ("ancestorOverride" in item && item.ancestorOverride) || findAncestorLabel(id);
          const hasMoveFolders = folders.length > 0;
          return (
            <li key={id} className={styles.navItemWrapper}>
              <div className={styles.favItemRow}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${pathname === item.href && activeSource === "favorites" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveSource("favorites")}
                >
                  <span className={styles.navItemContent}>
                    {Icon && <Icon size={16} className={styles.navItemIcon} />}
                    <span className={styles.navItemLabel}>
                      {item.label}
                      {ancestor && (
                        <span className={styles.favAncestor}>{ancestor}</span>
                      )}
                    </span>
                  </span>
                </Link>
                {hasMoveFolders && (
                  <button
                    className={styles.favItemAction}
                    onClick={(e) => openMenu(e, id, "item")}
                  >
                    <MoreHorizontal size={12} />
                  </button>
                )}
              </div>
              {contextMenuId === id && (
                <div
                  className={styles.contextMenu}
                  style={{ top: menuPos.top, left: menuPos.left }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      className={styles.contextMenuItem}
                      onClick={() => {
                        moveToFolder(id, folder.id);
                        closeMenus();
                      }}
                    >
                      <FolderOpen size={12} />
                      Move to {folder.label}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}

        {folders.map((folder) => {
          const folderItems = folder.items
            .map((id) => getNavItem(id))
            .filter(Boolean);
          const isExpanded = expandedFolderId === folder.id;

          return (
            <li key={folder.id} className={styles.navItemWrapper}>
              {editingFolderId === folder.id ? (
                <div className={styles.createFolderRow}>
                  <FolderOpen size={16} />
                  <input
                    className={styles.folderInput}
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    onBlur={() => handleRenameFolder(folder.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameFolder(folder.id);
                      if (e.key === "Escape") setEditingFolderId(null);
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <div className={styles.favItemRow}>
                  <button
                    className={styles.navItem}
                    onClick={() =>
                      setExpandedFolderId(isExpanded ? null : folder.id)
                    }
                  >
                    <span className={styles.navItemContent}>
                      <FolderOpen size={16} className={styles.navItemIcon} />
                      <span className={styles.navItemLabel}>
                        {folder.label}
                      </span>
                    </span>
                    <ChevronRight
                      size={12}
                      className={`${styles.navItemChevron} ${isExpanded ? styles.navItemChevronOpen : ""}`}
                    />
                  </button>
                  <button
                    className={styles.favItemAction}
                    onClick={(e) => openMenu(e, folder.id, "folder")}
                  >
                    <MoreHorizontal size={12} />
                  </button>
                </div>
              )}
              {folderMenuId === folder.id && (
                <div
                  className={styles.contextMenu}
                  style={{ top: menuPos.top, left: menuPos.left }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.contextMenuItem}
                    onClick={() => {
                      setEditFolderName(folder.label);
                      setEditingFolderId(folder.id);
                      closeMenus();
                    }}
                  >
                    <Pencil size={12} />
                    Rename
                  </button>
                  <button
                    className={styles.contextMenuItem}
                    onClick={() => {
                      deleteFolder(folder.id);
                      closeMenus();
                    }}
                  >
                    <Trash2 size={12} />
                    Delete folder
                  </button>
                </div>
              )}
              <div
                className={`${styles.sectionContent} ${isExpanded ? styles.sectionContentOpen : ""}`}
              >
                <ul className={styles.navItemChildren}>
                  {folderItems.map((item) => {
                    if (!item) return null;
                    const Icon = item.icon;
                    const ancestor = ("ancestorOverride" in item && item.ancestorOverride) || findAncestorLabel(item.id);
                    return (
                      <li key={item.id} className={styles.navItemWrapper}>
                        <Link
                          href={item.href}
                          className={`${styles.navItem} ${pathname === item.href && activeSource === "favorites" ? styles.navItemActive : ""}`}
                          style={{ paddingLeft: "28px" }}
                          onClick={() => setActiveSource("favorites")}
                        >
                          <span className={styles.navItemContent}>
                            {Icon && (
                              <Icon
                                size={16}
                                className={styles.navItemIcon}
                              />
                            )}
                            <span className={styles.navItemLabel}>
                              {item.label}
                              {ancestor && (
                                <span className={styles.favAncestor}>
                                  {ancestor}
                                </span>
                              )}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  {folderItems.length === 0 && (
                    <li>
                      <div className={styles.emptyHint}>No items</div>
                    </li>
                  )}
                </ul>
              </div>
            </li>
          );
        })}

        {isCreatingFolder && (
          <li className={styles.navItemWrapper}>
            <div className={styles.createFolderRow}>
              <FolderOpen size={16} />
              <input
                className={styles.folderInput}
                placeholder="Folder name…"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => {
                  if (newFolderName.trim()) handleCreateFolder();
                  else setIsCreatingFolder(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") setIsCreatingFolder(false);
                }}
                autoFocus
              />
            </div>
          </li>
        )}

        {rootStarred.length === 0 &&
          folders.length === 0 &&
          !isCreatingFolder && (
            <li>
              <div className={styles.emptyHint}>
                Star plugin pages to add them here
              </div>
            </li>
          )}
      </ul>
    </SidebarSection>
  );
}
