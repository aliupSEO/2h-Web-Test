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

export default function HeaderNav({ items, isScrolled = false }: { items: MenuItem[], isScrolled?: boolean }) {
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
              className={`flex items-center gap-1.5 transition-colors duration-200 uppercase tracking-[1.5px] text-[15px] leading-[15px] font-medium font-sans group-hover:!text-[var(--color-brand-primary,#b6ef00)]`}
              style={{ color: active ? "var(--color-brand-primary, #b6ef00)" : (isScrolled ? "var(--color-text-primary, #101010)" : "var(--color-text-light, #ffffff)") }}
            >
              <span suppressHydrationWarning>{item.label}</span>
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
                  className="opacity-70 mt-[-2px] transition-transform duration-200 group-hover:rotate-180"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </Link>
            {/* Dropdown Menu */}
            {hasChildren && (
              <div className="absolute top-full left-[-10px] pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                <div 
                  className="min-w-[160px] rounded-xl shadow-xl py-3 border"
                  style={{ 
                    background: "var(--color-bg-primary, #ffffff)", 
                    borderColor: "var(--color-brand-border, #e4e4e7)" 
                  }}
                >
                  <ul className="flex flex-col">
                    {item.childItems?.nodes.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.uri}
                          className="block px-5 py-2 text-[17px] leading-[30px] text-[#101010] hover:!text-[var(--color-brand-primary,#b6ef00)] hover:translate-x-2 transition-all duration-300"
                          style={{ fontFamily: 'var(--font-barlow)', fontWeight: 400 }}
                        >
                          <span suppressHydrationWarning>{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
