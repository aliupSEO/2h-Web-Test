/**
 * components/layout/Footer.tsx
 *
 * Site-wide footer.
 * All text content (company name, tagline, links) should come from WordPress.
 *
 * AGENT RULES:
 * - Footer text comes from WordPress — NEVER hardcode company info.
 * - This is a Server Component by default (no "use client").
 *
 * Usage:
 *   import Footer from "@/components/layout/Footer";
 *   <Footer />
 */

import Link from "next/link";

interface FooterProps {
  /** Company name (from WordPress settings or page content) */
  companyName?: string;
  /** Footer navigation links (from WordPress menu or page data) */
  links?: Array<{ label: string; href: string }>;
}

export default function Footer({ companyName, links }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-brand-border py-12 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Copyright */}
        <p className="text-zinc-500 text-sm">
          © {currentYear} {companyName || "Company Name"}
        </p>

        {/* Footer Links */}
        {links && links.length > 0 && (
          <nav className="flex items-center gap-6 text-sm text-zinc-400">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="hover:text-brand-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
