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

export default async function Header() {
  const [menuItems, dsSettings] = await Promise.all([
    getMenuItems(),
    getDesignSystemSettings(),
  ]);

  const logoUrl = dsSettings?.branding?.logo_primary || null;
  const siteTitle = dsSettings?.branding?.site_title || null;

  return (
    <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24 py-8 bg-transparent">

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
      <nav className="hidden lg:flex items-center gap-8 text-[11px] sm:text-xs tracking-[2px] font-semibold">
        {menuItems && menuItems.length > 0 ? (
          menuItems.map((item: { id: string; label: string; uri: string }) => (
            <Link
              key={item.id}
              href={item.uri}
              className="transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--color-text-light, #ffffff)" }}
            >
              {item.label.toUpperCase()}
            </Link>
          ))
        ) : (
          /* Fallback nav items when WP menus not configured */
          <>
            <span className="cursor-default opacity-40" style={{ color: "var(--color-text-light, #ffffff)" }}>HOME</span>
            <span className="cursor-default opacity-40" style={{ color: "var(--color-text-light, #ffffff)" }}>ABOUT</span>
            <span className="cursor-default opacity-40" style={{ color: "var(--color-text-light, #ffffff)" }}>SERVICES</span>
            <span className="cursor-default opacity-40" style={{ color: "var(--color-text-light, #ffffff)" }}>CONTACT</span>
          </>
        )}
      </nav>

      {/* CTA Button */}
      <div className="hidden lg:block">
        <Link
          href="/contact"
          className="inline-block transition-all duration-300 active:scale-95 hover:scale-105 btn-primary"
        >
          {dsSettings?.branding?.tagline
            ? dsSettings.branding.tagline.length > 30
              ? "Contact"
              : dsSettings.branding.tagline
            : "Get in Touch"}
        </Link>
      </div>

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
