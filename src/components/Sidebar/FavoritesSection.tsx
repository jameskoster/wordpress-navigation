"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderPlus,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X,
  File,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useActiveSource } from "@/hooks/useActiveSource";
import { getAllNavItems, findAncestorLabel } from "@/data/navigation";
import type { NavItem } from "@/types/navigation";
import SidebarSection from "./SidebarSection";
import Tooltip from "@/components/Tooltip/Tooltip";
import styles from "./Sidebar.module.css";

interface MenuPosition {
  top: number;
  left: number;
}

type ListType = "root" | "folders" | "folderItems";

type DragSource = {
  id: string;
  listType: ListType;
  folderId?: string;
} | null;

type DropTarget = {
  id: string;
  position: "above" | "below";
} | null;

export default function FavoritesSection() {
  const {
    favorites,
    folders,
    createFolder,
    deleteFolder,
    renameFolder,
    moveToFolder,
    removeFromFolder,
    toggleStarred,
    getDynamicItem,
    reorderStarred,
    reorderFolders,
    reorderFolderItems,
  } = useFavorites();
  const pathname = usePathname();
  const { activeSource, setActiveSource } = useActiveSource();
  const allNav = getAllNavItems();
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const prevStarredCount = useRef(favorites.starred.length);

  useEffect(() => {
    if (favorites.starred.length > prevStarredCount.current) {
      setSectionExpanded(true);
    }
    prevStarredCount.current = favorites.starred.length;
  }, [favorites.starred.length]);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const [folderMenuId, setFolderMenuId] = useState<string | null>(null);
  const [folderItemMenuId, setFolderItemMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, left: 0 });
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);

  const [dragSource, setDragSource] = useState<DragSource>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);
  const [folderDropTarget, setFolderDropTarget] = useState<string | null>(null);
  const dragCounterRef = useRef(0);

  const rootStarred = favorites.starred.filter(
    (id) => !folders.some((f) => f.items.includes(id))
  );

  const getNavItem = (
    id: string
  ): (NavItem & { ancestorOverride?: string }) | null => {
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
    setFolderItemMenuId(null);
  }, []);

  useEffect(() => {
    if (contextMenuId || folderMenuId || folderItemMenuId) {
      const handler = () => closeMenus();
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  }, [contextMenuId, folderMenuId, folderItemMenuId, closeMenus]);

  const openMenu = (
    e: React.MouseEvent,
    id: string,
    type: "item" | "folder" | "folderItem"
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left - 140 });
    if (type === "item") {
      setContextMenuId(contextMenuId === id ? null : id);
      setFolderMenuId(null);
      setFolderItemMenuId(null);
    } else if (type === "folder") {
      setFolderMenuId(folderMenuId === id ? null : id);
      setContextMenuId(null);
      setFolderItemMenuId(null);
    } else {
      setFolderItemMenuId(folderItemMenuId === id ? null : id);
      setContextMenuId(null);
      setFolderMenuId(null);
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

  // --- Drag and drop helpers ---

  const isDraggingItem =
    dragSource?.listType === "root" || dragSource?.listType === "folderItems";

  const handleDragStart = (
    e: React.DragEvent,
    id: string,
    listType: ListType,
    folderId?: string
  ) => {
    e.dataTransfer.effectAllowed = "move";
    setDragSource({ id, listType, folderId });
    dragCounterRef.current = 0;
  };

  const handleDragOver = (
    e: React.DragEvent,
    targetId: string,
    targetListType: ListType,
    targetFolderId?: string
  ) => {
    if (!dragSource) return;

    const isSameList =
      dragSource.listType === targetListType &&
      dragSource.folderId === targetFolderId;
    const isFolderItemToRoot =
      dragSource.listType === "folderItems" && targetListType === "root";

    if (!isSameList && !isFolderItemToRoot) return;
    if (dragSource.id === targetId) {
      setDropTarget(null);
      return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? "above" : "below";
    setDropTarget({ id: targetId, position });
  };

  const handleDrop = (
    e: React.DragEvent,
    list: string[],
    targetId: string,
    listType: ListType,
    folderId?: string
  ) => {
    e.preventDefault();
    if (!dragSource) return;

    const isSameList =
      dragSource.listType === listType &&
      dragSource.folderId === folderId;
    const isFolderItemToRoot =
      dragSource.listType === "folderItems" && listType === "root";

    if (isFolderItemToRoot && dragSource.folderId) {
      removeFromFolder(dragSource.id, dragSource.folderId);
      setDragSource(null);
      setDropTarget(null);
      return;
    }

    if (!isSameList) return;

    const fromIndex = list.indexOf(dragSource.id);
    let toIndex = list.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    if (dropTarget?.position === "below") toIndex++;
    if (fromIndex < toIndex) toIndex--;

    if (listType === "root") {
      reorderStarred(fromIndex, toIndex);
    } else if (listType === "folders") {
      reorderFolders(fromIndex, toIndex);
    } else if (listType === "folderItems" && folderId) {
      reorderFolderItems(folderId, fromIndex, toIndex);
    }

    setDragSource(null);
    setDropTarget(null);
  };

  const handleFolderHeaderDragOver = (
    e: React.DragEvent,
    folderId: string
  ) => {
    if (!dragSource || !isDraggingItem) return;
    if (dragSource.folderId === folderId) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setFolderDropTarget(folderId);
    setDropTarget(null);
  };

  const handleFolderHeaderDrop = (
    e: React.DragEvent,
    folderId: string
  ) => {
    if (!dragSource || !isDraggingItem) return;
    if (dragSource.folderId === folderId) return;
    e.preventDefault();
    e.stopPropagation();
    moveToFolder(dragSource.id, folderId);
    setDragSource(null);
    setDropTarget(null);
    setFolderDropTarget(null);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDropTarget(null);
    setFolderDropTarget(null);
    dragCounterRef.current = 0;
  };

  const getDragClasses = (id: string) => {
    const classes = [styles.draggable];
    if (dragSource?.id === id) classes.push(styles.dragging);
    if (dropTarget?.id === id && dropTarget.position === "above")
      classes.push(styles.dragOverAbove);
    if (dropTarget?.id === id && dropTarget.position === "below")
      classes.push(styles.dragOverBelow);
    return classes.join(" ");
  };

  const addAction = (
    <Tooltip label="Create folder">
      <button
        className={styles.sectionActionBtn}
        onClick={() => setIsCreatingFolder(true)}
        aria-label="Create folder"
      >
        <FolderPlus size={12} />
      </button>
    </Tooltip>
  );

  if (favorites.starred.length === 0) return null;

  return (
    <SidebarSection label="Favorites" expanded={sectionExpanded} onToggle={() => setSectionExpanded(!sectionExpanded)} action={addAction}>
      <ul className={styles.navList}>
        {/* Root starred items */}
        {rootStarred.map((id, index) => {
          const item = getNavItem(id);
          if (!item) return null;
          const Icon = item.icon;
          const ancestor =
            ("ancestorOverride" in item && item.ancestorOverride) ||
            findAncestorLabel(id);
          const isFirst = index === 0;
          const isLast = index === rootStarred.length - 1;
          const hasMenuContent = true;
          return (
            <li
              key={id}
              className={`${styles.navItemWrapper} ${getDragClasses(id)}`}
              draggable
              onDragStart={(e) => handleDragStart(e, id, "root")}
              onDragOver={(e) => handleDragOver(e, id, "root")}
              onDrop={(e) => handleDrop(e, rootStarred, id, "root")}
              onDragEnd={handleDragEnd}
            >
              <div className={styles.favItemRow}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${pathname === item.href && activeSource === "favorites" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveSource("favorites")}
                  draggable={false}
                >
                  <span className={styles.navItemContent}>
                    {Icon && (
                      <Icon size={16} className={styles.navItemIcon} />
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
                {hasMenuContent && (
                  <Tooltip label="More options">
                    <button
                      className={styles.favItemAction}
                      onClick={(e) => openMenu(e, id, "item")}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </Tooltip>
                )}
              </div>
              {contextMenuId === id && (
                <div
                  className={styles.contextMenu}
                  style={{ top: menuPos.top, left: menuPos.left }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={`${styles.contextMenuItem} ${isFirst ? styles.contextMenuItemDisabled : ""}`}
                    onClick={() => {
                      if (!isFirst) reorderStarred(index, index - 1);
                      closeMenus();
                    }}
                  >
                    <ArrowUp size={12} />
                    Move up
                  </button>
                  <button
                    className={`${styles.contextMenuItem} ${isLast ? styles.contextMenuItemDisabled : ""}`}
                    onClick={() => {
                      if (!isLast) reorderStarred(index, index + 1);
                      closeMenus();
                    }}
                  >
                    <ArrowDown size={12} />
                    Move down
                  </button>
                  {folders.length > 0 && (
                    <>
                      <div className={styles.contextMenuDivider} />
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
                    </>
                  )}
                  <div className={styles.contextMenuDivider} />
                  <button
                    className={styles.contextMenuItem}
                    onClick={() => {
                      toggleStarred(id);
                      closeMenus();
                    }}
                  >
                    <X size={12} />
                    Remove from Favorites
                  </button>
                </div>
              )}
            </li>
          );
        })}

        {/* Folders */}
        {folders.map((folder, folderIndex) => {
          const folderItems = folder.items
            .map((id) => getNavItem(id))
            .filter(Boolean);
          const isExpanded = expandedFolderId === folder.id;
          const isFirstFolder = folderIndex === 0;
          const isLastFolder = folderIndex === folders.length - 1;

          return (
            <li
              key={folder.id}
              className={`${styles.navItemWrapper} ${getDragClasses(folder.id)}`}
              draggable
              onDragStart={(e) =>
                handleDragStart(e, folder.id, "folders")
              }
              onDragOver={(e) =>
                handleDragOver(e, folder.id, "folders")
              }
              onDrop={(e) =>
                handleDrop(
                  e,
                  folders.map((f) => f.id),
                  folder.id,
                  "folders"
                )
              }
              onDragEnd={handleDragEnd}
            >
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
                <div
                  className={`${styles.favItemRow} ${folderDropTarget === folder.id ? styles.dragOverFolder : ""}`}
                  onDragOver={(e) =>
                    handleFolderHeaderDragOver(e, folder.id)
                  }
                  onDragLeave={() => setFolderDropTarget(null)}
                  onDrop={(e) => handleFolderHeaderDrop(e, folder.id)}
                >
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
                      <ChevronRight
                        size={12}
                        className={`${styles.favFolderChevron} ${isExpanded ? styles.navItemChevronOpen : ""}`}
                      />
                    </span>
                  </button>
                  <Tooltip label="More options">
                    <button
                      className={styles.favItemAction}
                      onClick={(e) => openMenu(e, folder.id, "folder")}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </Tooltip>
                </div>
              )}
              {folderMenuId === folder.id && (
                <div
                  className={styles.contextMenu}
                  style={{ top: menuPos.top, left: menuPos.left }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {folders.length > 1 && (
                    <>
                      <button
                        className={`${styles.contextMenuItem} ${isFirstFolder ? styles.contextMenuItemDisabled : ""}`}
                        onClick={() => {
                          if (!isFirstFolder)
                            reorderFolders(folderIndex, folderIndex - 1);
                          closeMenus();
                        }}
                      >
                        <ArrowUp size={12} />
                        Move up
                      </button>
                      <button
                        className={`${styles.contextMenuItem} ${isLastFolder ? styles.contextMenuItemDisabled : ""}`}
                        onClick={() => {
                          if (!isLastFolder)
                            reorderFolders(folderIndex, folderIndex + 1);
                          closeMenus();
                        }}
                      >
                        <ArrowDown size={12} />
                        Move down
                      </button>
                      <div className={styles.contextMenuDivider} />
                    </>
                  )}
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
                  {folderItems.map((item, itemIndex) => {
                    if (!item) return null;
                    const Icon = item.icon;
                    const ancestor =
                      ("ancestorOverride" in item &&
                        item.ancestorOverride) ||
                      findAncestorLabel(item.id);
                    const isFirstItem = itemIndex === 0;
                    const isLastItem =
                      itemIndex === folderItems.length - 1;
                    return (
                      <li
                        key={item.id}
                        className={`${styles.navItemWrapper} ${getDragClasses(item.id)}`}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(
                            e,
                            item.id,
                            "folderItems",
                            folder.id
                          );
                        }}
                        onDragOver={(e) =>
                          handleDragOver(
                            e,
                            item.id,
                            "folderItems",
                            folder.id
                          )
                        }
                        onDrop={(e) => {
                          e.stopPropagation();
                          handleDrop(
                            e,
                            folder.items,
                            item.id,
                            "folderItems",
                            folder.id
                          );
                        }}
                        onDragEnd={handleDragEnd}
                      >
                        <div className={styles.favItemRow}>
                          <Link
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href && activeSource === "favorites" ? styles.navItemActive : ""}`}
                            style={{ paddingLeft: "28px" }}
                            onClick={() => setActiveSource("favorites")}
                            draggable={false}
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
                          <Tooltip label="More options">
                            <button
                              className={styles.favItemAction}
                              onClick={(e) =>
                                openMenu(e, item.id, "folderItem")
                              }
                              aria-label="More options"
                            >
                              <MoreHorizontal size={12} />
                            </button>
                          </Tooltip>
                        </div>
                        {folderItemMenuId === item.id && (
                          <div
                            className={styles.contextMenu}
                            style={{
                              top: menuPos.top,
                              left: menuPos.left,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {folderItems.length > 1 && (
                              <>
                                <button
                                  className={`${styles.contextMenuItem} ${isFirstItem ? styles.contextMenuItemDisabled : ""}`}
                                  onClick={() => {
                                    if (!isFirstItem)
                                      reorderFolderItems(
                                        folder.id,
                                        itemIndex,
                                        itemIndex - 1
                                      );
                                    closeMenus();
                                  }}
                                >
                                  <ArrowUp size={12} />
                                  Move up
                                </button>
                                <button
                                  className={`${styles.contextMenuItem} ${isLastItem ? styles.contextMenuItemDisabled : ""}`}
                                  onClick={() => {
                                    if (!isLastItem)
                                      reorderFolderItems(
                                        folder.id,
                                        itemIndex,
                                        itemIndex + 1
                                      );
                                    closeMenus();
                                  }}
                                >
                                  <ArrowDown size={12} />
                                  Move down
                                </button>
                                <div
                                  className={styles.contextMenuDivider}
                                />
                              </>
                            )}
                            <button
                              className={styles.contextMenuItem}
                              onClick={() => {
                                removeFromFolder(item.id, folder.id);
                                closeMenus();
                              }}
                            >
                              <X size={12} />
                              Remove from folder
                            </button>
                            {folders.filter((f) => f.id !== folder.id).length >
                              0 && (
                              <>
                                <div className={styles.contextMenuDivider} />
                                {folders
                                  .filter((f) => f.id !== folder.id)
                                  .map((targetFolder) => (
                                    <button
                                      key={targetFolder.id}
                                      className={styles.contextMenuItem}
                                      onClick={() => {
                                        moveToFolder(
                                          item.id,
                                          targetFolder.id
                                        );
                                        closeMenus();
                                      }}
                                    >
                                      <FolderOpen size={12} />
                                      Move to {targetFolder.label}
                                    </button>
                                  ))}
                              </>
                            )}
                            <div className={styles.contextMenuDivider} />
                            <button
                              className={styles.contextMenuItem}
                              onClick={() => {
                                removeFromFolder(item.id, folder.id);
                                toggleStarred(item.id);
                                closeMenus();
                              }}
                            >
                              <X size={12} />
                              Remove from Favorites
                            </button>
                          </div>
                        )}
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

      </ul>
    </SidebarSection>
  );
}
