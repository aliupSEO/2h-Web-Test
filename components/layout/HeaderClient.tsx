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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = isScrolled || isMobileMenuOpen ? (logoDark || logoLight) : logoLight;
  const textColor = isScrolled || isMobileMenuOpen ? "var(--color-text-primary, #101010)" : "var(--color-text-light, #ffffff)";

  const navItems = menuItems && menuItems.length > 0 ? menuItems : [
    { id: "fallback-1", label: "STARTSEITE", uri: "/" },
    { id: "fallback-4", label: "ÜBER 2H", uri: "/uber-2h" },
    { id: "fallback-5", label: "KONTAKT", uri: "/kontakt" }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-white shadow-md py-4" : "bg-transparent py-8"}`}>
      <div className="max-w-[1300px] mx-auto w-full px-6 sm:px-10 md:px-12 lg:px-24 flex items-center justify-between relative z-50">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 relative h-[45px] w-[180px] flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
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
        <HeaderNav items={navItems} isScrolled={isScrolled || isMobileMenuOpen} />

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 relative z-50"
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`block w-6 h-0.5 rounded mb-1.5 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: textColor }} />
          <span className={`block w-6 h-0.5 rounded mb-1.5 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} style={{ background: textColor }} />
          <span className={`block w-6 h-0.5 rounded transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: textColor }} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out lg:hidden pt-24 px-6 overflow-y-auto ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <div key={item.id} className="border-b border-zinc-100 pb-4">
              <Link 
                href={item.uri} 
                className="text-xl font-medium tracking-wide uppercase text-black hover:text-[var(--color-brand-primary)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span suppressHydrationWarning>{item.label}</span>
              </Link>
              {item.childItems?.nodes && item.childItems.nodes.length > 0 && (
                <ul className="mt-4 flex flex-col gap-3 pl-4">
                  {item.childItems.nodes.map((child: any) => (
                    <li key={child.id}>
                      <Link 
                        href={child.uri}
                        className="text-base text-zinc-600 hover:text-[var(--color-brand-primary)]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span suppressHydrationWarning>{child.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
