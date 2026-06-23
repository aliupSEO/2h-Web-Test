"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HeaderNav from "./HeaderNav";

interface HeaderClientProps {
  menuItems: any[];
  logoLight: string | null;
  logoDark: string | null;
  siteTitle: string | null;
}

export default function HeaderClient({ menuItems, logoLight, logoDark, siteTitle }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = isScrolled ? (logoDark || logoLight) : logoLight;
  const textColor = isScrolled ? "#111111" : "var(--color-text-light, #ffffff)";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-4" : "bg-transparent py-8"}`}>
      <div className="max-w-[1300px] mx-auto w-full px-6 sm:px-10 md:px-12 lg:px-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 relative h-[45px] w-[180px] flex items-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteTitle || "Logo"}
              fill
              priority
              sizes="192px"
              className="object-contain object-left transition-opacity duration-300"
            />
          ) : (
            <span
              className="text-2xl font-bold tracking-wider transition-colors duration-300"
              style={{ color: textColor }}
            >
              {siteTitle || "LOGO"}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        {menuItems && menuItems.length > 0 ? (
          <HeaderNav items={menuItems} isScrolled={isScrolled} />
        ) : (
          <HeaderNav items={[
            { id: "fallback-1", label: "STARTSEITE", uri: "/" },
            { id: "fallback-2", label: "DIGITALE LÖSUNGEN", uri: "/digitale-losungen" },
            { id: "fallback-3", label: "REFERENZEN", uri: "/referenzen" },
            { id: "fallback-4", label: "ÜBER 2H", uri: "/uber-2h" },
            { id: "fallback-5", label: "KONTAKT", uri: "/kontakt" }
          ]} isScrolled={isScrolled} />
        )}

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2"
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 rounded mb-1.5 transition-colors duration-300" style={{ background: textColor }} />
          <span className="block w-6 h-0.5 rounded mb-1.5 transition-colors duration-300" style={{ background: textColor }} />
          <span className="block w-6 h-0.5 rounded transition-colors duration-300" style={{ background: textColor }} />
        </button>
      </div>
    </header>
  );
}
