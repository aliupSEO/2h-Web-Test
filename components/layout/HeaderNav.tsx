"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  uri: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

export default function HeaderNav({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();

  // Helper to check if a link is active
  const isActive = (uri: string) => {
    if (uri === "/" && pathname === "/") return true;
    if (uri !== "/" && pathname.startsWith(uri)) return true;
    return false;
  };

  return (
    <nav className="hidden lg:flex items-center gap-8 text-[16px] font-sans font-medium ml-auto">
      {items.map((item) => {
        const active = isActive(item.uri);
        // Simple check if it has children or if the label contains something indicating a dropdown
        // (In a real app, WPGraphQL childItems would populate this, but for now we'll simulate if needed)
        const hasChildren = item.childItems?.nodes && item.childItems.nodes.length > 0;
        
        // As a fallback for the specific "DIGITALE LÖSUNGEN" item from the screenshot,
        // we can check the label to add a chevron if we don't have nested menus yet.
        const showChevron = hasChildren || item.label.toUpperCase() === "DIGITALE LÖSUNGEN";

        return (
          <div key={item.id} className="relative group">
            <Link
              href={item.uri}
              className={`flex items-center gap-1 transition-opacity duration-200 hover:opacity-80 uppercase tracking-[1px] text-[15px] font-medium`}
              style={{ color: active ? "var(--color-brand-primary, #b6ef00)" : "var(--color-text-light, #ffffff)" }}
            >
              {item.label}
              {showChevron && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70 mt-[-2px]"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </Link>
            
            {/* Optional dropdown menu could go here */}
          </div>
        );
      })}
    </nav>
  );
}
