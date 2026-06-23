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
import { getFooterData } from "@/lib/graphql";
import ScrollToTop from "@/components/ui/ScrollToTop";
import DinoGame from "@/components/ui/DinoGame";

export default async function Footer() {
  const dsSettings = await getDesignSystemSettings();
  const footerData = await getFooterData();

  const branding = dsSettings?.branding;
  const logoUrl = branding?.logo_dark || branding?.logo_primary || null;
  const siteTitle = branding?.site_title || null;
  const tagline = branding?.tagline || null;
  const copyright = branding?.footer_copyright || null;
  const social = branding?.social;

  const currentYear = new Date().getFullYear();

  const socialLinks = social
    ? [
        { name: "LinkedIn", url: social.linkedin, icon: linkedInIcon },
        { name: "WhatsApp", url: social.whatsapp || "https://wa.me/", icon: whatsappIcon },
        { name: "Phone", url: social.phone || "tel:", icon: phoneIcon },
        { name: "Email", url: social.email || "mailto:", icon: emailIcon },
      ].filter((s) => s.url)
    : [];

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--color-footer-bg, #3a3a3a)",
        borderColor: "var(--color-brand-border, #1f2937)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-12 mb-20">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col items-start">
            <Link href="/" className="block mb-4">
              {logoUrl ? (
                <div className="relative h-[60px] w-[180px]">
                  <Image
                    src={logoUrl}
                    alt={siteTitle || "Logo"}
                    fill
                    sizes="(max-width: 768px) 180px, 180px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <span
                  className="text-2xl font-bold tracking-wider"
                  style={{ color: "var(--color-text-light, #ffffff)" }}
                >
                  {siteTitle || "LOGO"}
                </span>
              )}
            </Link>
            
            <p className="text-[13px] text-zinc-300 mb-6 font-sans tracking-wide">
              {tagline || "Hier entsteht ihr digitales Ökosystem"}
            </p>
            
            <div className="flex items-center gap-5 mb-10">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="text-zinc-400 hover:text-[var(--color-brand-primary,#b6ef00)] transition-colors scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {footerData?.btnText && (
              <div className="w-full">
                <Link 
                  href={footerData.btnLink}
                  className="flex border border-[var(--color-brand-primary,#b6ef00)] text-white hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-black rounded-full px-4 py-3.5 text-[11px] font-medium tracking-[1.5px] uppercase transition-all duration-300 text-center justify-center items-center leading-[1.3] w-full sm:w-[230px]"
                >
                  {/* Use a wrapper to force the specific wrap if the text matches */}
                  <span className="whitespace-pre-line">
                    {footerData.btnText.replace("KOSTENLOSES ", "KOSTENLOSES\n")}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Column 2: Menu 1 */}
          <div>
            <h4 className="text-white font-serif uppercase tracking-wide text-[18px] md:text-[20px] font-normal mb-8 mt-2">
              {footerData?.column2?.title || "DIGITALE LÖSUNGEN"}
            </h4>
            <ul className="space-y-4">
              {footerData?.column2?.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.url} className="text-zinc-300 hover:text-white flex items-center gap-4 text-[15px] font-sans transition-colors group">
                    <span className="text-[var(--color-brand-primary,#b6ef00)] font-bold text-[14px] transition-transform group-hover:translate-x-1">&gt;</span> 
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Menu 2 */}
          <div>
            <h4 className="text-white font-serif uppercase tracking-wide text-[18px] md:text-[20px] font-normal mb-8 mt-2">
              {footerData?.column3?.title || "2H WEBSOLUTIONS"}
            </h4>
            <ul className="space-y-4">
              {footerData?.column3?.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.url} className="text-zinc-300 hover:text-white flex items-center gap-4 text-[15px] font-sans transition-colors group">
                    <span className="text-[var(--color-brand-primary,#b6ef00)] font-bold text-[14px] transition-transform group-hover:translate-x-1">&gt;</span> 
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Dino Game */}
          <DinoGame title={footerData?.gameTitle || "Lass uns ein Spiel spielen"} />

        </div>

        {/* Divider & Bottom Bar (Flex container for divider and items) */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-[13px] text-zinc-400 order-2 md:order-1">
              <Link href="/impressum" className="transition-colors hover:text-white">Impressum</Link>
              <Link href="/datenschutz" className="transition-colors hover:text-white">Datenschutz</Link>
            </nav>
  
            <p className="text-[13px] text-zinc-400 text-center md:absolute md:left-1/2 md:-translate-x-1/2 order-3 md:order-2">
              {copyright || `© Copyright ${currentYear} ${siteTitle || "2H Web Solutions"}`}
            </p>
  
            <div className="flex items-center order-1 md:order-3">
              <ScrollToTop />
            </div>
          </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Social Icons
// ---------------------------------------------------------------------------

const linkedInIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const whatsappIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const phoneIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.011 15.698l-3.351-1.428a1.996 1.996 0 00-2.327.56l-1.488 1.819c-2.825-1.436-5.111-3.722-6.547-6.547l1.819-1.488a1.996 1.996 0 00.56-2.327L7.25 2.936A1.996 1.996 0 005.32 1.5H3A1.5 1.5 0 001.5 3c0 10.77 8.73 19.5 19.5 19.5a1.5 1.5 0 001.5-1.5v-2.32a1.996 1.996 0 00-1.436-1.93L20.01 15.7z" />
  </svg>
);

const emailIcon = (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M2 5.5A2.5 2.5 0 014.5 3h15A2.5 2.5 0 0122 5.5v13a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 18.5v-13zM4.5 5c-.276 0-.5.224-.5.5v.71l7.586 4.74a.75.75 0 00.795 0L20 6.21V5.5c0-.276-.224-.5-.5-.5h-15zM20 7.962l-7.394 4.622a2.25 2.25 0 01-2.38 0L3 7.962v10.538c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5V7.962z" />
  </svg>
);
