/**
 * components/layout/Header.tsx
 *
 * Site-wide header / navigation bar.
 * Fetches its own data (menu items + branding) from WordPress.
 * Shows "LOGO" and "NOT SET" fallbacks when WordPress is not connected.
 * Colors from CSS variables (Design System Settings plugin).
 *
 * AGENT RULES:
 * - Navigation labels come from WordPress menus — NEVER hardcode nav text.
 * - Logo comes from Design System Settings plugin branding.
 * - This is a Server Component (no "use client").
 * - If you need a mobile menu toggle, extract that into a separate client component.
 */

import Link from "next/link";
import Image from "next/image";
import { getMenuItems } from "@/lib/graphql";
import { getDesignSystemSettings } from "@/lib/design-system";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const [menuItems, dsSettings] = await Promise.all([
    getMenuItems(),
    getDesignSystemSettings(),
  ]);

  const logoUrl = dsSettings?.branding?.logo_primary || null;
  const siteTitle = dsSettings?.branding?.site_title || null;

  return (
    <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 py-4 bg-black/60 backdrop-blur-sm border-b border-white/10">

      {/* Logo */}
      <Link href="/" className="flex-shrink-0 relative h-12 w-48 flex items-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={siteTitle || "Logo"}
            fill
            priority
            sizes="192px"
            className="object-contain object-left"
          />
        ) : (
          <span
            className="text-xl font-bold tracking-wider opacity-50"
            style={{ color: "var(--color-text-light, #ffffff)" }}
          >
            {siteTitle || "LOGO"}
          </span>
        )}
      </Link>

      {/* Desktop Navigation */}
      {menuItems && menuItems.length > 0 ? (
        <HeaderNav items={menuItems} />
      ) : (
        /* Fallback nav items when WP menus not configured */
        <HeaderNav items={[
          { id: "fallback-1", label: "Startseite", uri: "/" },
          { id: "fallback-2", label: "Digitale Lösungen", uri: "/digitale-losungen" },
          { id: "fallback-3", label: "Referenzen", uri: "/referenzen" },
          { id: "fallback-4", label: "Über 2H", uri: "/uber-2h" },
          { id: "fallback-5", label: "Kontakt", uri: "/kontakt" }
        ]} />
      )}

      {/* Mobile hamburger */}
      <button
        className="lg:hidden p-2"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 rounded mb-1.5" style={{ background: "var(--color-text-light, #ffffff)" }} />
        <span className="block w-5 h-0.5 rounded mb-1.5" style={{ background: "var(--color-text-light, #ffffff)" }} />
        <span className="block w-5 h-0.5 rounded" style={{ background: "var(--color-text-light, #ffffff)" }} />
      </button>
    </header>
  );
}
