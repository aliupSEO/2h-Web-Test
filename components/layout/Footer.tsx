/**
 * components/layout/Footer.tsx
 *
 * Site-wide footer with branding, social links, and navigation.
 * Fetches its own data from the Design System Settings plugin.
 * Shows "Not set" fallbacks when WordPress/plugin is not connected.
 * Colors from CSS variables (Design System Settings plugin).
 *
 * AGENT RULES:
 * - Footer text comes from WordPress Design System Settings — NEVER hardcode company info.
 * - Social URLs come from branding.social — NEVER hardcode social links.
 * - This is a Server Component (no "use client").
 */

import Link from "next/link";
import Image from "next/image";
import { getDesignSystemSettings } from "@/lib/design-system";

export default async function Footer() {
  const dsSettings = await getDesignSystemSettings();

  const branding = dsSettings?.branding;
  const logoUrl = branding?.logo_dark || branding?.logo_primary || null;
  const siteTitle = branding?.site_title || null;
  const tagline = branding?.tagline || null;
  const copyright = branding?.footer_copyright || null;
  const social = branding?.social;

  const currentYear = new Date().getFullYear();

  // Collect non-empty social links
  const socialLinks = social
    ? [
        { name: "LinkedIn", url: social.linkedin, icon: linkedInIcon },
        { name: "Instagram", url: social.instagram, icon: instagramIcon },
        { name: "Facebook", url: social.facebook, icon: facebookIcon },
        { name: "X", url: social.twitter, icon: xIcon },
        { name: "YouTube", url: social.youtube, icon: youtubeIcon },
        { name: "TikTok", url: social.tiktok, icon: tiktokIcon },
      ].filter((s) => s.url)
    : [];

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--color-bg-dark, #000000)",
        borderColor: "var(--color-brand-border, #1f2937)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16">
        {/* Top Row — Logo + Tagline + Social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="block">
              {logoUrl ? (
                <div className="relative h-10 w-40">
                  <Image
                    src={logoUrl}
                    alt={siteTitle || "Logo"}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <span
                  className="text-lg font-bold tracking-wider opacity-60"
                  style={{ color: "var(--color-text-light, #ffffff)" }}
                >
                  {siteTitle || "LOGO"}
                </span>
              )}
            </Link>
            <p
              className="text-sm max-w-xs"
              style={{ color: "var(--color-brand-muted, #6b7280)" }}
            >
              {tagline || (
                <span className="opacity-50 italic">Tagline not set</span>
              )}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.length > 0 ? (
              socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:opacity-80"
                  style={{
                    background: "var(--color-bg-alternate, #111111)",
                    color: "var(--color-brand-muted, #6b7280)",
                  }}
                >
                  {s.icon}
                </a>
              ))
            ) : (
              <span
                className="text-xs italic opacity-40"
                style={{ color: "var(--color-brand-muted, #6b7280)" }}
              >
                Social links not set
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{ background: "var(--color-brand-border, #1f2937)" }}
        />

        {/* Bottom Row — Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-xs"
            style={{ color: "var(--color-brand-muted, #6b7280)" }}
          >
            {copyright || (
              <>
                © {currentYear}{" "}
                <span className="opacity-80">
                  {siteTitle || "Company Name"}
                </span>
              </>
            )}
          </p>

          {/* Quick links */}
          <nav className="flex items-center gap-6 text-xs">
            <Link
              href="/impressum"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--color-brand-muted, #6b7280)" }}
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--color-brand-muted, #6b7280)" }}
            >
              Datenschutz
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Social Icons (inline SVGs — small enough to not warrant a separate file)
// ---------------------------------------------------------------------------

const linkedInIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const instagramIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const facebookIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const xIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const youtubeIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const tiktokIcon = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);
