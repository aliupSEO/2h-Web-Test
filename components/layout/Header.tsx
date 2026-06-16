/**
 * components/layout/Header.tsx
 *
 * Site-wide header / navigation bar.
 * Fetches its own data (menu items + branding) from WordPress.
 * Shows "LOGO" and "NOT SET" fallbacks when WordPress is not connected.
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
    <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-16 lg:px-24 py-8 bg-transparent">
      {/* Logo */}
      <Link href="/" className="relative h-12 w-48 block flex items-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={siteTitle || "Logo"}
            fill
            priority
            className="object-contain object-left"
          />
        ) : (
          <span className="text-white text-xl font-bold tracking-wider opacity-50">
            {siteTitle || "LOGO"}
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-8 text-[11px] sm:text-xs tracking-[2px] font-semibold text-white">
        {menuItems && menuItems.length > 0 ? (
          menuItems.map((item: { id: string; label: string; uri: string }) => (
            <Link
              key={item.id}
              href={item.uri}
              className="hover:text-brand-green transition-colors"
            >
              {item.label.toUpperCase()}
            </Link>
          ))
        ) : (
          /* Fallback nav items when WP menus not configured */
          <>
            <span className="text-zinc-600 cursor-default">HOME</span>
            <span className="text-zinc-600 cursor-default">ABOUT</span>
            <span className="text-zinc-600 cursor-default">SERVICES</span>
            <span className="text-zinc-600 cursor-default">CONTACT</span>
          </>
        )}
      </nav>

      {/* CTA Button */}
      <div className="hidden lg:block">
        <Link
          href="/contact"
          className="px-6 py-2.5 bg-brand-green hover:bg-brand-green-light text-black text-[11px] font-semibold uppercase tracking-[1.5px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {dsSettings?.branding?.tagline
            ? dsSettings.branding.tagline.length > 30
              ? "Contact"
              : dsSettings.branding.tagline
            : "Get in Touch"}
        </Link>
      </div>
    </header>
  );
}
