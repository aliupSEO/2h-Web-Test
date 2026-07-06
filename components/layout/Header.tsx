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
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [menuItems, dsSettings] = await Promise.all([
    getMenuItems(),
    getDesignSystemSettings(),
  ]);

  const logoLight = dsSettings?.branding?.logo_primary || null;
  const logoDark = dsSettings?.branding?.logo_dark || logoLight;
  const siteTitle = dsSettings?.branding?.site_title || null;

  return (
    <HeaderClient 
      menuItems={menuItems} 
      logoLight={logoLight} 
      logoDark={logoDark} 
      siteTitle={siteTitle} 
    />
  );
}
