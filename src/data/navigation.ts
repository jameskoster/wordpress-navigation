import {
  LayoutDashboard,
  FileText,
  FilePlus,
  FolderOpen,
  Tags,
  Image,
  File,
  MessageSquare,
  Paintbrush,
  Palette,
  PanelLeft,
  Menu,
  Users,
  UserPlus,
  UserCircle,
  Wrench,
  Import,
  HeartPulse,
  Settings,
  Globe,
  PenLine,
  BookOpen,
  MessagesSquare,
  Link2,
  ShieldCheck,
  ShoppingCart,
  Package,
  ClipboardList,
  BarChart3,
  UserCheck,
  Truck,
  CreditCard,
  Receipt,
  MapPin,
  Percent,
  Layers,
  Search,
  FileSearch,
  Gauge,
  Zap,
  Activity,
  BarChart,
  Share2,
  Mail,
  FormInput,
  ListChecks,
  Grid3X3,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";

export const coreNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    section: "core",
  },
  {
    id: "pages",
    label: "Pages",
    icon: File,
    href: "/pages",
    section: "core",
    hideable: true,
  },
  {
    id: "media",
    label: "Media",
    icon: Image,
    href: "/media",
    section: "core",
    hideable: true,
  },
  {
    id: "comments",
    label: "Comments",
    icon: MessageSquare,
    href: "/comments",
    section: "core",
    hideable: true,
  },
  {
    id: "posts",
    label: "Posts",
    icon: FileText,
    href: "/posts",
    section: "core",
    hideable: true,
    children: [
      {
        id: "posts-all",
        label: "All Posts",
        icon: FileText,
        href: "/posts",
        section: "core",
      },
      {
        id: "posts-categories",
        label: "Categories",
        icon: FolderOpen,
        href: "/posts/categories",
        section: "core",
      },
      {
        id: "posts-tags",
        label: "Tags",
        icon: Tags,
        href: "/posts/tags",
        section: "core",
      },
    ],
  },
  {
    id: "appearance",
    label: "Design",
    icon: Paintbrush,
    href: "/appearance",
    section: "core",
    hideable: true,
    children: [
      {
        id: "appearance-themes",
        label: "Themes",
        icon: Palette,
        href: "/appearance/themes",
        section: "core",
      },
      {
        id: "appearance-editor",
        label: "Editor",
        icon: PanelLeft,
        href: "/appearance/editor",
        section: "core",
      },
      {
        id: "appearance-menus",
        label: "Menus",
        icon: Menu,
        href: "/appearance/menus",
        section: "core",
      },
    ],
  },
];

export const toolsNavItems: NavItem[] = [
  {
    id: "tools-import",
    label: "Import",
    icon: Import,
    href: "/tools/import",
    section: "core",
  },
  {
    id: "tools-export",
    label: "Export",
    icon: Share2,
    href: "/tools/export",
    section: "core",
  },
  {
    id: "tools-health",
    label: "Site Health",
    icon: HeartPulse,
    href: "/tools/site-health",
    section: "core",
  },
];

export const settingsNavItems: NavItem[] = [
  {
    id: "settings-general",
    label: "General",
    icon: Settings,
    href: "/settings/general",
    section: "settings",
  },
  {
    id: "settings-writing",
    label: "Writing",
    icon: PenLine,
    href: "/settings/writing",
    section: "settings",
  },
  {
    id: "settings-reading",
    label: "Reading",
    icon: BookOpen,
    href: "/settings/reading",
    section: "settings",
  },
  {
    id: "settings-discussion",
    label: "Discussion",
    icon: MessagesSquare,
    href: "/settings/discussion",
    section: "settings",
  },
  {
    id: "settings-permalinks",
    label: "Permalinks",
    icon: Link2,
    href: "/settings/permalinks",
    section: "settings",
  },
  {
    id: "settings-privacy",
    label: "Privacy",
    icon: ShieldCheck,
    href: "/settings/privacy",
    section: "settings",
  },
  {
    id: "settings-users",
    label: "Users",
    icon: Users,
    href: "/settings/users",
    section: "settings",
    children: [
      {
        id: "settings-users-all",
        label: "All Users",
        icon: Users,
        href: "/settings/users",
        section: "settings",
      },
      {
        id: "settings-users-add",
        label: "Add New",
        icon: UserPlus,
        href: "/settings/users/add-new",
        section: "settings",
      },
      {
        id: "settings-users-profile",
        label: "Profile",
        icon: UserCircle,
        href: "/settings/users/profile",
        section: "settings",
      },
    ],
  },
];

export const pluginNavItems: NavItem[] = [
  {
    id: "plugin-woocommerce",
    label: "WooCommerce",
    icon: ShoppingCart,
    href: "/plugins/woocommerce",
    section: "plugin",
    pluginId: "woocommerce",
    starrable: true,
    children: [
      {
        id: "plugin-woo-orders",
        label: "Orders",
        icon: ClipboardList,
        href: "/plugins/woocommerce/orders",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
        badge: 3,
      },
      {
        id: "plugin-woo-products",
        label: "Products",
        icon: Package,
        href: "/plugins/woocommerce/products",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
        children: [
          {
            id: "plugin-woo-products-categories",
            label: "Categories",
            icon: FolderOpen,
            href: "/plugins/woocommerce/products/categories",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
          {
            id: "plugin-woo-products-tags",
            label: "Tags",
            icon: Tags,
            href: "/plugins/woocommerce/products/tags",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
          {
            id: "plugin-woo-products-attributes",
            label: "Attributes",
            icon: Grid3X3,
            href: "/plugins/woocommerce/products/attributes",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
        ],
      },
      {
        id: "plugin-woo-customers",
        label: "Customers",
        icon: UserCheck,
        href: "/plugins/woocommerce/customers",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
      },
      {
        id: "plugin-woo-analytics",
        label: "Analytics",
        icon: BarChart3,
        href: "/plugins/woocommerce/analytics",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
        children: [
          {
            id: "plugin-woo-analytics-revenue",
            label: "Revenue",
            icon: BarChart,
            href: "/plugins/woocommerce/analytics/revenue",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
          {
            id: "plugin-woo-analytics-orders",
            label: "Orders",
            icon: ClipboardList,
            href: "/plugins/woocommerce/analytics/orders",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
        ],
      },
      {
        id: "plugin-woo-shipping",
        label: "Shipping",
        icon: Truck,
        href: "/plugins/woocommerce/shipping",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
        children: [
          {
            id: "plugin-woo-shipping-zones",
            label: "Zones & Rates",
            icon: MapPin,
            href: "/plugins/woocommerce/shipping/zones-and-rates",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
          {
            id: "plugin-woo-shipping-classes",
            label: "Shipping Classes",
            icon: Layers,
            href: "/plugins/woocommerce/shipping/classes",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
        ],
      },
      {
        id: "plugin-woo-payments",
        label: "Payments",
        icon: CreditCard,
        href: "/plugins/woocommerce/payments",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
      },
      {
        id: "plugin-woo-tax",
        label: "Tax",
        icon: Receipt,
        href: "/plugins/woocommerce/tax",
        section: "plugin",
        pluginId: "woocommerce",
        starrable: true,
        children: [
          {
            id: "plugin-woo-tax-rates",
            label: "Tax Rates",
            icon: Percent,
            href: "/plugins/woocommerce/tax/rates",
            section: "plugin",
            pluginId: "woocommerce",
            starrable: true,
          },
        ],
      },
    ],
  },
  {
    id: "plugin-yoast",
    label: "Yoast SEO",
    icon: Search,
    href: "/plugins/yoast",
    section: "plugin",
    pluginId: "yoast",
    starrable: true,
    children: [
      {
        id: "plugin-yoast-dashboard",
        label: "Dashboard",
        icon: Gauge,
        href: "/plugins/yoast/dashboard",
        section: "plugin",
        pluginId: "yoast",
        starrable: true,
      },
      {
        id: "plugin-yoast-tools",
        label: "Tools",
        icon: Wrench,
        href: "/plugins/yoast/tools",
        section: "plugin",
        pluginId: "yoast",
        starrable: true,
      },
      {
        id: "plugin-yoast-seo",
        label: "SEO",
        icon: Search,
        href: "/plugins/yoast/seo",
        section: "plugin",
        pluginId: "yoast",
        starrable: true,
        badge: 1,
      },
      {
        id: "plugin-yoast-search",
        label: "Search Appearance",
        icon: FileSearch,
        href: "/plugins/yoast/search-appearance",
        section: "plugin",
        pluginId: "yoast",
        starrable: true,
      },
    ],
  },
  {
    id: "plugin-jetpack",
    label: "Jetpack",
    icon: Zap,
    href: "/plugins/jetpack",
    section: "plugin",
    pluginId: "jetpack",
    starrable: true,
    children: [
      {
        id: "plugin-jetpack-dashboard",
        label: "Dashboard",
        icon: Gauge,
        href: "/plugins/jetpack/dashboard",
        section: "plugin",
        pluginId: "jetpack",
        starrable: true,
      },
      {
        id: "plugin-jetpack-stats",
        label: "Stats",
        icon: Activity,
        href: "/plugins/jetpack/stats",
        section: "plugin",
        pluginId: "jetpack",
        starrable: true,
      },
    ],
  },
  {
    id: "plugin-cf7",
    label: "Contact Form 7",
    icon: Mail,
    href: "/plugins/contact-form-7",
    section: "plugin",
    pluginId: "cf7",
    starrable: true,
    children: [
      {
        id: "plugin-cf7-forms",
        label: "Forms",
        icon: FormInput,
        href: "/plugins/contact-form-7/forms",
        section: "plugin",
        pluginId: "cf7",
        starrable: true,
      },
      {
        id: "plugin-cf7-integrations",
        label: "Integrations",
        icon: ListChecks,
        href: "/plugins/contact-form-7/integrations",
        section: "plugin",
        pluginId: "cf7",
        starrable: true,
      },
    ],
  },
];

const deepPages: NavItem[] = [
  {
    id: "plugin-woo-shipping-zone-us",
    label: "United States",
    icon: Globe,
    href: "/plugins/woocommerce/shipping/zones-and-rates/united-states",
    section: "plugin",
    pluginId: "woocommerce",
    starrable: true,
  },
  {
    id: "plugin-woo-shipping-zone-eu",
    label: "Europe",
    icon: Globe,
    href: "/plugins/woocommerce/shipping/zones-and-rates/europe",
    section: "plugin",
    pluginId: "woocommerce",
    starrable: true,
  },
  {
    id: "plugin-woo-shipping-zone-row",
    label: "Rest of World",
    icon: Globe,
    href: "/plugins/woocommerce/shipping/zones-and-rates/rest-of-world",
    section: "plugin",
    pluginId: "woocommerce",
    starrable: true,
  },
];

function getSidebarNavItems(): NavItem[] {
  const all: NavItem[] = [];
  const collect = (items: NavItem[]) => {
    for (const item of items) {
      all.push(item);
      if (item.children) collect(item.children);
    }
  };
  collect(coreNavItems);
  collect(toolsNavItems);
  collect(settingsNavItems);
  collect(pluginNavItems);
  return all;
}

export function getAllNavItems(): NavItem[] {
  return [...getSidebarNavItems(), ...deepPages];
}

export function findNavItemByHref(href: string): NavItem | undefined {
  const all = getAllNavItems();
  return all.find((item) => item.href === href);
}

export function findAncestorLabel(id: string): string | null {
  const search = (
    items: NavItem[],
    root: string | null
  ): string | null => {
    for (const item of items) {
      if (item.id === id) return root;
      if (item.children) {
        const found = search(item.children, root ?? item.label);
        if (found) return found;
      }
    }
    return null;
  };
  const treeResult =
    search(coreNavItems, null) ??
    search(toolsNavItems, null) ??
    search(settingsNavItems, null) ??
    search(pluginNavItems, null);
  if (treeResult) return treeResult;

  const deepItem = deepPages.find((item) => item.id === id);
  if (deepItem) {
    const parent = getAllNavItems().find(
      (item) =>
        item.href !== deepItem.href &&
        deepItem.href.startsWith(item.href + "/") &&
        item.pluginId
    );
    if (parent) return findAncestorLabel(parent.id) ?? parent.label;
  }

  return null;
}

function toLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Returns breadcrumbs only for pages that go deeper than the sidebar.
 * If the page is directly represented in the sidebar nav, returns [].
 */
export function findBreadcrumbs(href: string): NavItem[] {
  const allItems = getAllNavItems();

  if (getSidebarNavItems().some((item) => item.href === href)) {
    return [];
  }

  let bestMatch: NavItem | null = null;
  for (const item of allItems) {
    if (href.startsWith(item.href + "/")) {
      if (!bestMatch || item.href.length > bestMatch.href.length) {
        bestMatch = item;
      }
    }
  }

  if (!bestMatch) return [];

  const remaining = href
    .slice(bestMatch.href.length)
    .split("/")
    .filter(Boolean);
  let currentPath = bestMatch.href;
  const extraCrumbs = remaining.map((seg) => {
    currentPath += `/${seg}`;
    const existing = allItems.find((item) => item.href === currentPath);
    return (
      existing ?? ({
        id: `dynamic-${currentPath}`,
        label: toLabel(seg),
        href: currentPath,
        section: bestMatch!.section,
      } as NavItem)
    );
  });

  return [bestMatch, ...extraCrumbs];
}
