"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import {
  findBreadcrumbs,
  findNavItemByHref,
  findAncestorLabel,
  getAllNavItems,
} from "@/data/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import type { DynamicNavItem } from "@/types/navigation";
import Tooltip from "@/components/Tooltip/Tooltip";
import styles from "./PageHeader.module.css";

function titleFromPath(pathname: string): string {
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Page";
  return lastSegment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function findDeepAncestorLabel(href: string): string | undefined {
  const allItems = getAllNavItems();
  let best: { id: string; len: number } | null = null;
  for (const item of allItems) {
    if (href.startsWith(item.href + "/") && (!best || item.href.length > best.len)) {
      best = { id: item.id, len: item.href.length };
    }
  }
  if (!best) return undefined;
  return findAncestorLabel(best.id) ?? undefined;
}

export default function PageHeader() {
  const pathname = usePathname();
  const breadcrumbs = findBreadcrumbs(pathname);
  const currentItem = findNavItemByHref(pathname);
  const { isStarred, toggleStarred } = useFavorites();

  const isPluginPage = pathname.startsWith("/plugins/");
  const isDeepPage = !currentItem && breadcrumbs.length > 0;

  const showStar = currentItem?.starrable === true || (isPluginPage && isDeepPage);

  const dynamicId = isDeepPage ? `dynamic-${pathname}` : null;
  const starId = currentItem?.id ?? dynamicId;
  const starred = starId ? isStarred(starId) : false;

  const title =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].label
      : currentItem?.label || titleFromPath(pathname);

  const handleToggleStar = () => {
    if (!starId) return;
    if (currentItem) {
      toggleStarred(currentItem.id);
    } else {
      const meta: DynamicNavItem = {
        id: starId,
        label: title,
        href: pathname,
        section: "plugin",
        ancestorLabel: findDeepAncestorLabel(pathname),
      };
      toggleStarred(starId, meta);
    }
  };

  return (
    <header className={styles.header}>
      {breadcrumbs.length > 1 && (
        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.id} className={styles.breadcrumbItem}>
              {i > 0 && (
                <ChevronRight size={12} className={styles.breadcrumbSep} />
              )}
              {i < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className={styles.breadcrumbLink}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {showStar && starId && (
          <Tooltip label={starred ? "Remove from Favorites" : "Add to Favorites"}>
            <button
              className={`${styles.starButton} ${starred ? styles.starButtonActive : ""}`}
              onClick={handleToggleStar}
              aria-label={starred ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star size={18} fill={starred ? "currentColor" : "none"} />
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
