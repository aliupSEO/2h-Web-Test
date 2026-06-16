/**
 * components/layout/Header.tsx
 *
 * Site-wide header / navigation bar.
 * Navigation items should come from WordPress via getMenuItems().
 *
 * AGENT RULES:
 * - Navigation labels come from WordPress menus — NEVER hardcode nav text.
 * - This is a Server Component by default (no "use client").
 * - If you need a mobile menu toggle, extract that into a separate client component.
 *
 * Usage (in app/layout.tsx or page files):
 *   import Header from "@/components/layout/Header";
 *   <Header menuItems={menuItems} />
 */

import Link from "next/link";
import Image from "next/image";
import type { WordPressMenuItem } from "@/lib/types";

interface HeaderProps {
  /** Navigation menu items from WordPress */
  menuItems: WordPressMenuItem[];
  /** Optional logo URL from WordPress (or use local /logo.svg) */
  logoUrl?: string;
}

export default function Header({ menuItems, logoUrl }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-16 lg:px-24 py-8 bg-transparent">
      {/* Logo */}
      <Link href="/" className="relative h-12 w-48 block">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Logo"
            fill
            priority
            className="object-contain object-left"
          />
        ) : (
          <span className="text-white text-xl font-bold tracking-wider">LOGO</span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-8 text-[11px] sm:text-xs tracking-[2px] font-semibold text-white">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.uri}
            className="hover:text-brand-green transition-colors"
          >
            {item.label.toUpperCase()}
          </Link>
        ))}
      </nav>
    </header>
  );
}
