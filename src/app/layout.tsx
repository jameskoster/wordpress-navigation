import type { Metadata } from "next";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { ActiveSourceProvider } from "@/hooks/useActiveSource";
import { HiddenItemsProvider } from "@/hooks/useHiddenItems";
import { NavigationHistoryProvider } from "@/hooks/useNavigationHistory";
import Sidebar from "@/components/Sidebar/Sidebar";
import CommandPalette from "@/components/CommandPalette/CommandPalette";
import "./globals.css";

export const metadata: Metadata = {
  title: "WordPress Admin",
  description: "WordPress Admin Navigation Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ActiveSourceProvider>
        <HiddenItemsProvider>
        <NavigationHistoryProvider>
        <FavoritesProvider>
          <div
            style={{
              display: "flex",
              minHeight: "100vh",
            }}
          >
            <Sidebar />
            <CommandPalette />
            <main
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {children}
            </main>
          </div>
        </FavoritesProvider>
        </NavigationHistoryProvider>
        </HiddenItemsProvider>
        </ActiveSourceProvider>
      </body>
    </html>
  );
}
